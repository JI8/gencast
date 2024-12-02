-- Add settings columns to shows table
ALTER TABLE shows
ADD COLUMN duration TEXT DEFAULT '30',
ADD COLUMN tone TEXT DEFAULT 'Casual',
ADD COLUMN format TEXT DEFAULT 'Discussion';
