-- Create characters table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  role TEXT,
  avatar TEXT,
  traits TEXT[] DEFAULT '{}',
  show_count INTEGER DEFAULT 0,
  episode_count INTEGER DEFAULT 0,
  voice_settings JSONB DEFAULT '{"pitch": 1.0, "speed": 1.0, "style": "Natural"}',
  user_id UUID NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create topics table
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  sources TEXT[] DEFAULT '{}',
  show_count INTEGER DEFAULT 0,
  episode_count INTEGER DEFAULT 0,
  user_id UUID NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create shows table
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  character_ids UUID[] DEFAULT '{}',
  topic_ids UUID[] DEFAULT '{}',
  episode_count INTEGER DEFAULT 0,
  duration TEXT DEFAULT '30',
  tone TEXT DEFAULT 'Casual',
  format TEXT DEFAULT 'Discussion',
  user_id UUID NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create episodes table
CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  show_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  duration INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  user_id UUID NOT NULL,
  CONSTRAINT fk_show
    FOREIGN KEY(show_id)
    REFERENCES shows(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create RLS policies
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Characters policies
CREATE POLICY "Users can view their own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters"
  ON characters FOR DELETE
  USING (auth.uid() = user_id);

-- Topics policies
CREATE POLICY "Users can view their own topics"
  ON topics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own topics"
  ON topics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topics"
  ON topics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topics"
  ON topics FOR DELETE
  USING (auth.uid() = user_id);

-- Shows policies
CREATE POLICY "Users can view their own shows"
  ON shows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shows"
  ON shows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shows"
  ON shows FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shows"
  ON shows FOR DELETE
  USING (auth.uid() = user_id);

-- Episodes policies
CREATE POLICY "Users can view their own episodes"
  ON episodes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own episodes"
  ON episodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own episodes"
  ON episodes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own episodes"
  ON episodes FOR DELETE
  USING (auth.uid() = user_id);
