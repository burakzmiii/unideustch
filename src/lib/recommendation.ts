import { universities, type University } from '@/data/universities';
import type { QuizAnswer, QuizOption, RecommendationResult } from '@/data/quiz';

const budgetRank: Record<string, number> = { dusuk: 1, orta: 2, yuksek: 3 };

const HARD_UNI_IDS = ['rwth-aachen', 'tu-muenchen', 'kit-karlsruhe', 'tu-berlin', 'tu-darmstadt'];
const EASY_UNI_IDS = ['uni-bremen', 'ruhr-uni-bochum', 'tu-chemnitz', 'uni-siegen', 'hochschule-muenchen', 'hochschule-berlin', 'hochschule-aachen', 'uni-marburg', 'uni-leipzig'];

export function calculateRecommendations(answers: QuizAnswer[]): RecommendationResult[] {
  const results: Record<string, RecommendationResult> = {};
  universities.forEach((u) => {
    results[u.id] = { universityId: u.id, score: 0, reasons: [] };
  });

  const userWantsEasy = answers.some(
    (a) => a.questionId === 'graduation' && a.optionId === 'g_easy'
  );
  const userWantsLowDifficulty = answers.some(
    (a) => a.questionId === 'difficulty' && a.optionId === 'd_low'
  );
  const userWantsApplied = answers.some(
    (a) => a.questionId === 'institution' && a.optionId === 'uygulamali'
  );
  const userWantsHard = answers.some(
    (a) => a.questionId === 'difficulty' && a.optionId === 'd_high'
  );
  const userWantsHardGrad = answers.some(
    (a) => a.questionId === 'graduation' && a.optionId === 'g_hard'
  );

  const prefersEasyPath = userWantsEasy || userWantsLowDifficulty || userWantsApplied;
  const prefersHardPath = userWantsHard || userWantsHardGrad;

  for (const answer of answers) {
    const option = findOption(answer.questionId, answer.optionId);
    if (!option) continue;

    for (const u of universities) {
      const res = results[u.id];

      // State matching
      if (option.states && option.states.length > 0) {
        const match = option.states.some((s) => u.tags.states.includes(s));
        if (match) {
          res.score += 3;
          res.reasons.push(`Tercih ettiğiniz bölge/eyalet ile uyumlu`);
        }
      }

      // Budget matching
      if (option.budget) {
        if (u.tags.budget === option.budget) {
          res.score += 2;
          res.reasons.push(`Yaşam bütçenize uygun`);
        } else if (Math.abs(budgetRank[u.tags.budget] - budgetRank[option.budget]) === 1) {
          res.score += 1;
        }
      }

      // Work opportunities
      if (option.workOpportunities !== undefined) {
        const diff = Math.abs(u.tags.workOpportunities - option.workOpportunities);
        if (diff === 0) {
          res.score += 2;
          res.reasons.push(`İş ve çalışma imkanları beklentinize uygun`);
        } else if (diff === 1) {
          res.score += 1;
        }
      }

      // English programs
      if (option.englishPrograms !== undefined) {
        const diff = Math.abs(u.tags.englishPrograms - option.englishPrograms);
        if (diff === 0) {
          res.score += 2;
          res.reasons.push(`Dil tercihinize uygun programlar mevcut`);
        } else if (diff === 1) {
          res.score += 1;
        }
      }

      // Institution type
      if (option.institutionType) {
        if (u.tags.institutionType === option.institutionType) {
          res.score += 2;
          res.reasons.push(`Tercih ettiğiniz kurum türüyle uyumlu`);
        }
      }
    }
  }

  // --- CRITICAL: Apply graduation ease / difficulty penalties and bonuses ---
  for (const u of universities) {
    const res = results[u.id];

    if (prefersEasyPath) {
      // Heavily penalize hard universities
      if (HARD_UNI_IDS.includes(u.id)) {
        res.score -= 15;
        if (u.difficultyWarnings.length > 0) {
          res.reasons.push(`Uyarı: ${u.difficultyWarnings[0]}`);
        }
      }
      // Boost easy/friendly universities
      if (EASY_UNI_IDS.includes(u.id)) {
        res.score += 8;
        res.reasons.push(`Uluslararası öğrencilerin yüksek mezuniyet başarısı ve dengeli sınav sistemi nedeniyle önerildi`);
      }
      // Bonus based on graduationEase
      if (u.graduationEase >= 7.5) {
        res.score += 4;
        res.reasons.push(`Yüksek geçme oranı ve öğrenci dostu eğitim yapısı`);
      } else if (u.graduationEase >= 6.0) {
        res.score += 1;
      }
      // Penalty based on academicRigor
      if (u.academicRigor >= 8.5) {
        res.score -= 6;
      } else if (u.academicRigor >= 7.5) {
        res.score -= 2;
      }
    }

    if (prefersHardPath) {
      // Boost hard universities for users who want prestige
      if (HARD_UNI_IDS.includes(u.id)) {
        res.score += 6;
        res.reasons.push(`Yüksek akademik prestij ve güçlü araştırma altyapısı`);
      }
      if (u.academicRigor >= 8.0) {
        res.score += 3;
      }
      // Small penalty for very easy unis
      if (u.graduationEase >= 8.5) {
        res.score -= 3;
      }
    }

    // International support bonus (always relevant)
    if (u.internationalScore >= 8.5) {
      res.score += 2;
      res.reasons.push(`Güçlü uluslararası öğrenci destek sistemi`);
    } else if (u.internationalScore >= 7.5) {
      res.score += 1;
    }
  }

  // Dedupe reasons
  Object.values(results).forEach((r) => {
    r.reasons = [...new Set(r.reasons)];
  });

  return Object.values(results)
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function findOption(questionId: string, optionId: string): QuizOption | undefined {
  const question = quizQuestionsMap[questionId];
  if (!question) return undefined;
  return question.options.find((o) => o.id === optionId);
}

// Import quiz questions lazily to avoid circular deps
import { quizQuestions } from '@/data/quiz';
const quizQuestionsMap: Record<string, { options: QuizOption[] }> = {};
quizQuestions.forEach((q) => {
  quizQuestionsMap[q.id] = q;
});

export function getRecommendedUniversities(answers: QuizAnswer[]): University[] {
  const recs = calculateRecommendations(answers);
  return recs
    .map((r) => universities.find((u) => u.id === r.universityId))
    .filter((u): u is University => u !== undefined);
}
