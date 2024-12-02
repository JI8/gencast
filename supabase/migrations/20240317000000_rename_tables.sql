-- Rename tables
ALTER TABLE shows RENAME TO gencasts;
ALTER TABLE topics RENAME TO sources;

-- Update foreign key constraints
ALTER TABLE episodes
  DROP CONSTRAINT fk_show,
  ADD CONSTRAINT fk_gencast
    FOREIGN KEY (show_id)
    REFERENCES gencasts(id)
    ON DELETE CASCADE;

-- Rename columns
ALTER TABLE episodes RENAME COLUMN show_id TO gencast_id;

-- Update RLS policies for gencasts (formerly shows)
DROP POLICY IF EXISTS "Users can view their own shows" ON gencasts;
DROP POLICY IF EXISTS "Users can insert their own shows" ON gencasts;
DROP POLICY IF EXISTS "Users can update their own shows" ON gencasts;
DROP POLICY IF EXISTS "Users can delete their own shows" ON gencasts;

CREATE POLICY "Users can view their own gencasts"
  ON gencasts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gencasts"
  ON gencasts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gencasts"
  ON gencasts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gencasts"
  ON gencasts FOR DELETE
  USING (auth.uid() = user_id);

-- Update RLS policies for sources (formerly topics)
DROP POLICY IF EXISTS "Users can view their own topics" ON sources;
DROP POLICY IF EXISTS "Users can insert their own topics" ON sources;
DROP POLICY IF EXISTS "Users can update their own topics" ON sources;
DROP POLICY IF EXISTS "Users can delete their own topics" ON sources;

CREATE POLICY "Users can view their own sources"
  ON sources FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sources"
  ON sources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sources"
  ON sources FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sources"
  ON sources FOR DELETE
  USING (auth.uid() = user_id);
