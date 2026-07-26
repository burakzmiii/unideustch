import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Trophy, MapPin, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { quizQuestions, type QuizAnswer } from '@/data/quiz';
import { calculateRecommendations } from '@/lib/recommendation';
import { universities } from '@/data/universities';
import { navigate } from '@/lib/router';

interface QuizResultItem {
  universityId: string;
  score: number;
  reasons: string[];
}

function QuizResults({
  answers,
  onRestart,
}: {
  answers: QuizAnswer[];
  onRestart: () => void;
}) {
  const results = calculateRecommendations(answers);
  const topResults = results.slice(0, 5);
  const maxScore = topResults.length > 0 ? topResults[0].score : 1;

  return (
    <div className="animate-slide-up space-y-6">
      {/* Results Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <Trophy className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">
          Sonuçlarınız Hazır!
        </h2>
        <p className="text-slate-300 max-w-md mx-auto">
          Yanıtlarınıza göre size en uygun üniversiteler aşağıda listelenmiştir.
        </p>
      </div>

      {/* Result Cards */}
      <div className="space-y-4">
        {topResults.map((result: QuizResultItem, index: number) => {
          const university = universities.find(
            (u) => u.id === result.universityId
          );
          if (!university) return null;

          const matchPercentage = Math.round((result.score / maxScore) * 100);
          const clampedPercentage = Math.min(matchPercentage, 100);
          const uniqueReasons = [...new Set(result.reasons)].slice(0, 4);
          const hasWarnings = university.difficultyWarnings.length > 0;

          return (
            <div
              key={result.universityId}
              className="animate-slide-up bg-[#1E293B] border border-[#334155] rounded-xl p-5 hover:border-blue-600/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Rank & Name */}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 text-sm font-bold border border-blue-600/30">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-100">
                      {university.name}
                    </h3>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{university.city}, {university.state}</span>
                  </div>

                  {/* Reasoning Section */}
                  {uniqueReasons.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Neden Bu Okul?</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {uniqueReasons.map((reason, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Difficulty Warnings */}
                  {hasWarnings && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {university.difficultyWarnings.slice(0, 2).map((warning, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {warning}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* View Profile Link */}
                  <button
                    onClick={() => navigate(`/university/${result.universityId}`)}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                  >
                    Profili Görüntüle
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Match Badge */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative flex items-center justify-center w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-[#334155]"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${(clampedPercentage / 100) * 175.93} 175.93`}
                        strokeLinecap="round"
                        className="text-emerald-500"
                      />
                    </svg>
                    <span className="absolute text-sm font-bold text-emerald-400">
                      %{clampedPercentage}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">
                    Uyum
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Restart Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1E293B] border border-[#334155] text-slate-300 hover:text-slate-100 hover:border-blue-600/50 transition-all duration-200 font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Testi Tekrarla
        </button>
      </div>
    </div>
  );
}

export function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalQuestions = quizQuestions.length;
  const progress = ((currentStep) / totalQuestions) * 100;
  const currentQuestion = quizQuestions[currentStep];

  const handleSelectOption = (questionId: string, optionId: string) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(
      (a) => a.questionId === questionId
    );

    const answer: QuizAnswer = { questionId, optionId };

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }

    setAnswers(newAnswers);

    // Auto-advance with delay
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsCompleted(true);
      }
      setIsTransitioning(false);
    }, 250);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <QuizResults answers={answers} onRestart={handleRestart} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-blue-400">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Üniversite Eşleştirme Testi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            Size En Uygun Üniversiteyi Bulalım
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300 font-medium">
              Soru {currentStep + 1} / {totalQuestions}
            </span>
            <span className="text-slate-400">%{Math.round(progress)}</span>
          </div>
          <div className="h-2 bg-[#1E293B] rounded-full border border-[#334155] overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div
            key={currentQuestion.id}
            className="animate-slide-up bg-[#1E293B] border border-[#334155] rounded-xl p-6 space-y-5"
          >
            {/* Question Text */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-100">
                {currentQuestion.question}
              </h2>
              {currentQuestion.description && (
                <p className="text-slate-400 text-sm">
                  {currentQuestion.description}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer?.optionId === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleSelectOption(currentQuestion.id, option.id)
                    }
                    disabled={isTransitioning}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 group ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-600/50 text-slate-100'
                        : 'bg-slate-800/50 border-[#334155] text-slate-400 hover:border-blue-600/30 hover:text-slate-200 hover:bg-slate-800'
                    } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-500 group-hover:border-blue-400'
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:text-slate-100 bg-[#1E293B] border border-[#334155] hover:border-blue-600/50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </button>

          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !currentAnswer
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'
            }`}
          >
            {currentStep === totalQuestions - 1 ? 'Sonuçları Gör' : 'İleri'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
