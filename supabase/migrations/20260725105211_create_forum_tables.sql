/*
# Almanya Üniversite Rehberi - Soru-Cevap Forumu

## Genel Açıklama
Uluslararası öğrenciler için Almanya'da eğitim rehberi platformunun topluluk forumu (soru-cevap) veritabanı yapısı. Kayıtlı kullanıcılar üniversiteye özel soru sorabilir ve diğer kullanıcılar cevap verebilir.

## Yeni Tablolar

### questions (Sorular)
- id: UUID, birincil anahtar
- university_id: text, hangi üniversiteye ait olduğu (universities.ts içindeki id ile eşleşir)
- title: text, soru başlığı
- body: text, soru detayı
- user_id: UUID, soruyu soran kullanıcı (auth.users'a referans)
- user_name: text, kullanıcının görünen adı
- created_at: timestamp, oluşturulma tarihi

### answers (Cevaplar)
- id: UUID, birincil anahtar
- question_id: UUID, hangi soruya cevap (questions.id'ye referans, cascade delete)
- body: text, cevap içeriği
- user_id: UUID, cevap yazan kullanıcı
- user_name: text, kullanıcının görünen adı
- created_at: timestamp, oluşturulma tarihi

## Güvenlik (RLS)
- Her iki tabloda da RLS etkin.
- questions: SELECT herkese açık (anon + authenticated); INSERT/UPDATE/DELETE sadece sahip kullanıcı.
- answers: SELECT herkese açık; INSERT sadece authenticated; UPDATE/DELETE sadece sahip kullanıcı.

## Önemli Notlar
1. user_id sütunu DEFAULT auth.uid() ile tanımlı; böylece frontend insert sırasında user_id göndermese bile otomatik doldurulur.
2. answers tablosu questions tablosuna ON DELETE CASCADE ile bağlı; bir soru silinince cevapları da silinir.
3. Tüm metin alanları Türkçe içerik barındırır.
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- questions: herkes okuyabilir
DROP POLICY IF EXISTS "read_questions" ON questions;
CREATE POLICY "read_questions" ON questions FOR SELECT
  TO anon, authenticated USING (true);

-- questions: sadece authenticated kullanıcılar soru ekleyebilir
DROP POLICY IF EXISTS "insert_own_questions" ON questions;
CREATE POLICY "insert_own_questions" ON questions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- questions: kullanıcı kendi sorusunu güncelleyebilir
DROP POLICY IF EXISTS "update_own_questions" ON questions;
CREATE POLICY "update_own_questions" ON questions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- questions: kullanıcı kendi sorusunu silebilir
DROP POLICY IF EXISTS "delete_own_questions" ON questions;
CREATE POLICY "delete_own_questions" ON questions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  body text NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- answers: herkes okuyabilir
DROP POLICY IF EXISTS "read_answers" ON answers;
CREATE POLICY "read_answers" ON answers FOR SELECT
  TO anon, authenticated USING (true);

-- answers: sadece authenticated kullanıcılar cevap ekleyebilir
DROP POLICY IF EXISTS "insert_own_answers" ON answers;
CREATE POLICY "insert_own_answers" ON answers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- answers: kullanıcı kendi cevabını güncelleyebilir
DROP POLICY IF EXISTS "update_own_answers" ON answers;
CREATE POLICY "update_own_answers" ON answers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- answers: kullanıcı kendi cevabını silebilir
DROP POLICY IF EXISTS "delete_own_answers" ON answers;
CREATE POLICY "delete_own_answers" ON answers FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_questions_university_id ON questions(university_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
