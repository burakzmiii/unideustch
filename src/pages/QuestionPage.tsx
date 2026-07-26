import { useEffect, useState } from 'react';
import { ArrowLeft, Send, User, MessageSquare, Trash2, ThumbsUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUniversityById } from '@/data/universities';
import { navigate } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';

interface Answer {
  id: string;
  body: string;
  user_name: string;
  user_id: string;
  created_at: string;
}

interface Question {
  id: string;
  university_id: string;
  title: string;
  body: string;
  user_name: string;
  user_id: string;
  created_at: string;
  topic: string;
  upvotes: number;
}

export function QuestionPage({ id }: { id: string }) {
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userUpvoted, setUserUpvoted] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    const { data: qData } = await supabase
      .from('questions')
      .select('id, university_id, title, body, user_name, user_id, created_at, topic, upvotes')
      .eq('id', id)
      .maybeSingle();

    if (!qData) { setLoading(false); return; }
    setQuestion(qData as Question);

    if (user) {
      const { data: uv } = await supabase
        .from('question_upvotes')
        .select('id')
        .eq('question_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      setUserUpvoted(!!uv);
    }

    const { data: aData } = await supabase
      .from('answers')
      .select('id, body, user_name, user_id, created_at')
      .eq('question_id', id)
      .order('created_at', { ascending: true });

    setAnswers((aData as Answer[]) || []);
    setLoading(false);
  }

  async function handleUpvote() {
    if (!user || !question) { navigate('/login'); return; }
    if (userUpvoted) {
      await supabase.from('question_upvotes').delete().eq('question_id', question.id).eq('user_id', user.id);
      await supabase.from('questions').update({ upvotes: Math.max(0, question.upvotes - 1) }).eq('id', question.id);
      setQuestion({ ...question, upvotes: Math.max(0, question.upvotes - 1) });
      setUserUpvoted(false);
    } else {
      await supabase.from('question_upvotes').insert({ question_id: question.id });
      await supabase.from('questions').update({ upvotes: question.upvotes + 1 }).eq('id', question.id);
      setQuestion({ ...question, upvotes: question.upvotes + 1 });
      setUserUpvoted(true);
    }
  }

  async function handleAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!answerBody.trim()) return;

    setSubmitting(true);
    setError(null);
    const userName = user.user_metadata?.name || user.email || 'Anonim';

    const { error: insertError } = await supabase.from('answers').insert({
      question_id: id,
      body: answerBody.trim(),
      user_name: userName,
    });

    if (insertError) {
      setError('Cevap gönderilirken bir hata oluştu.');
      setSubmitting(false);
      return;
    }

    setAnswerBody('');
    setSubmitting(false);
    loadData();
  }

  async function handleDeleteAnswer(answerId: string) {
    await supabase.from('answers').delete().eq('id', answerId);
    setAnswers(answers.filter((a) => a.id !== answerId));
  }

  async function handleDeleteQuestion() {
    if (!question || !user || question.user_id !== user.id) return;
    await supabase.from('questions').delete().eq('id', question.id);
    navigate(`/forum/${question.university_id}`);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg mb-4">Soru bulunamadı.</p>
        <button onClick={() => navigate('/forum')} className="text-blue-400 font-medium hover:underline">Forum'a dön</button>
      </div>
    );
  }

  const university = getUniversityById(question.university_id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        onClick={() => navigate(`/forum/${question.university_id}`)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {university ? university.name : 'Forum'}
      </button>

      {/* Question */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {university?.name || 'Üniversite'}
          </span>
          {question.topic !== 'Genel' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {question.topic}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-3">{question.title}</h1>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap mb-4">{question.body}</p>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-300">{question.user_name}</span>
            <span>{formatDate(question.created_at)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                userUpvoted
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-card border border-border text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${userUpvoted ? 'fill-emerald-400' : ''}`} />
              {question.upvotes}
            </button>
            {user && question.user_id === user.id && (
              <button
                onClick={handleDeleteQuestion}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          {answers.length} Cevap
        </h2>
      </div>

      {answers.length === 0 ? (
        <div className="text-center py-8 bg-card rounded-2xl border border-border mb-6">
          <p className="text-slate-400 mb-1">Henüz cevap yok</p>
          <p className="text-sm text-slate-500">İlk cevabı veren siz olun!</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {answers.map((a) => (
            <div key={a.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200 text-sm">{a.user_name}</span>
                      <span className="text-xs text-slate-500">{formatDate(a.created_at)}</span>
                    </div>
                    {user && a.user_id === user.id && (
                      <button
                        onClick={() => handleDeleteAnswer(a.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{a.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Answer form */}
      {user ? (
        <form onSubmit={handleAnswer} className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-slate-200 mb-3">Cevap Yaz</h3>
          {error && <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <textarea
            placeholder="Cevabınızı yazın..."
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            rows={4}
            maxLength={2000}
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-200 placeholder:text-slate-500 resize-none mb-3"
            required
          />
          <button
            type="submit"
            disabled={submitting || !answerBody.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Gönderiliyor...' : 'Cevap Gönder'}
          </button>
        </form>
      ) : (
        <div className="bg-card/50 border border-blue-500/20 rounded-2xl p-4 text-sm text-slate-300">
          Cevap vermek için{' '}
          <button onClick={() => navigate('/login')} className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2">giriş yapın</button>{' '}
          veya{' '}
          <button onClick={() => navigate('/signup')} className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2">kayıt olun</button>.
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return 'az önce';
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
