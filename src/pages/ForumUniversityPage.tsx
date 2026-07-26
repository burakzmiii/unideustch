import { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, Send, ChevronRight, User, ThumbsUp, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUniversityById } from '@/data/universities';
import { navigate } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';

const TOPICS = ['Genel', 'Konaklama', 'Vize', 'Staj', 'Dersler', 'Burs'] as const;

interface Question {
  id: string;
  title: string;
  body: string;
  user_name: string;
  created_at: string;
  topic: string;
  upvotes: number;
  answer_count?: number;
  user_upvoted?: boolean;
}

export function ForumUniversityPage({ id }: { id: string }) {
  const university = getUniversityById(id);
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState<string>('Genel');
  const [topicFilter, setTopicFilter] = useState<string>('Tümü');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [id]);

  async function loadQuestions() {
    setLoading(true);
    const { data } = await supabase
      .from('questions')
      .select('id, title, body, user_name, created_at, topic, upvotes')
      .eq('university_id', id)
      .order('created_at', { ascending: false });

    if (data) {
      const questionsEnriched = await Promise.all(
        (data as Question[]).map(async (q) => {
          const { count } = await supabase
            .from('answers')
            .select('*', { count: 'exact', head: true })
            .eq('question_id', q.id);

          let userUpvoted = false;
          if (user) {
            const { data: uv } = await supabase
              .from('question_upvotes')
              .select('id')
              .eq('question_id', q.id)
              .eq('user_id', user.id)
              .maybeSingle();
            userUpvoted = !!uv;
          }

          return { ...q, answer_count: count || 0, user_upvoted: userUpvoted };
        })
      );
      setQuestions(questionsEnriched);
    }
    setLoading(false);
  }

  async function handleUpvote(questionId: string) {
    if (!user) {
      navigate('/login');
      return;
    }
    const q = questions.find((x) => x.id === questionId);
    if (!q) return;

    if (q.user_upvoted) {
      await supabase.from('question_upvotes').delete().eq('question_id', questionId).eq('user_id', user.id);
      await supabase.from('questions').update({ upvotes: Math.max(0, q.upvotes - 1) }).eq('id', questionId);
      setQuestions(questions.map((x) => x.id === questionId ? { ...x, upvotes: Math.max(0, x.upvotes - 1), user_upvoted: false } : x));
    } else {
      await supabase.from('question_upvotes').insert({ question_id: questionId });
      await supabase.from('questions').update({ upvotes: q.upvotes + 1 }).eq('id', questionId);
      setQuestions(questions.map((x) => x.id === questionId ? { ...x, upvotes: x.upvotes + 1, user_upvoted: true } : x));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!title.trim() || !body.trim()) return;

    setSubmitting(true);
    setError(null);
    const userName = user.user_metadata?.name || user.email || 'Anonim';

    const { error: insertError } = await supabase.from('questions').insert({
      university_id: id,
      title: title.trim(),
      body: body.trim(),
      topic,
      user_name: userName,
    });

    if (insertError) {
      setError('Soru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      setSubmitting(false);
      return;
    }

    setTitle('');
    setBody('');
    setTopic('Genel');
    setShowForm(false);
    setSubmitting(false);
    loadQuestions();
  }

  if (!university) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg mb-4">Üniversite bulunamadı.</p>
        <button onClick={() => navigate('/forum')} className="text-blue-400 font-medium hover:underline">Forum'a dön</button>
      </div>
    );
  }

  const filteredQuestions = topicFilter === 'Tümü'
    ? questions
    : questions.filter((q) => q.topic === topicFilter);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        onClick={() => navigate('/forum')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Forum
      </button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1">{university.name}</h1>
        <p className="text-slate-400">{university.city}, {university.state} — Soru-Cevap Bölümü</p>
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['Tümü', ...TOPICS].filter((v, i, a) => a.indexOf(v) === i).map((t) => (
          <button
            key={t}
            onClick={() => setTopicFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              topicFilter === t
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-card border border-border text-slate-400 hover:border-blue-500/40 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Ask question */}
      {!user ? (
        <div className="bg-card/50 border border-blue-500/20 rounded-2xl p-4 mb-6 text-sm text-slate-300">
          Soru sormak için{' '}
          <button onClick={() => navigate('/login')} className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2">giriş yapın</button>{' '}
          veya{' '}
          <button onClick={() => navigate('/signup')} className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2">kayıt olun</button>.
        </div>
      ) : !showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 mb-6"
        >
          <MessageSquare className="w-5 h-5" />
          Yeni Soru Sor
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-5 mb-6 animate-slide-up">
          <h3 className="font-bold text-slate-100 mb-4">Yeni Soru</h3>
          {error && <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Soru başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-200 placeholder:text-slate-500"
              required
            />
            <textarea
              placeholder="Sorunuzun detayını yazın..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-200 placeholder:text-slate-500 resize-none"
              required
            />
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Konu</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="px-3 py-2 rounded-lg bg-surface border border-border text-slate-200 text-sm outline-none focus:border-blue-500"
              >
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setTitle(''); setBody(''); setError(null); }}
                className="px-4 py-2.5 rounded-xl text-slate-400 font-medium hover:bg-surface transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Questions */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 mb-1">Henüz soru yok</p>
            <p className="text-sm text-slate-500">İlk soruyu soran siz olun!</p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-card rounded-xl border border-border hover:border-blue-500/30 transition-all p-4 group"
            >
              <div className="flex items-start gap-3">
                {/* Upvote */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleUpvote(q.id); }}
                  className={`flex flex-col items-center gap-0.5 pt-1 ${
                    q.user_upvoted ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'
                  } transition-colors`}
                >
                  <ThumbsUp className={`w-4 h-4 ${q.user_upvoted ? 'fill-emerald-400' : ''}`} />
                  <span className="text-xs font-medium">{q.upvotes}</span>
                </button>

                <button
                  onClick={() => navigate(`/forum/question/${q.id}`)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {q.topic !== 'Genel' && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        <Tag className="w-3 h-3" />
                        {q.topic}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-200 mb-1 group-hover:text-blue-300 transition-colors">
                    {q.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-2">{q.body}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{q.user_name}</span>
                    <span>{formatDate(q.created_at)}</span>
                    {q.answer_count && q.answer_count > 0 ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <MessageSquare className="w-3 h-3" />
                        {q.answer_count} cevap
                      </span>
                    ) : null}
                  </div>
                </button>

                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 flex-shrink-0 mt-2" />
              </div>
            </div>
          ))
        )}
      </div>
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
