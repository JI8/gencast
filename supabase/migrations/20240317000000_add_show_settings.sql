-- Add settings column to shows table
ALTER TABLE shows
ADD COLUMN settings JSONB DEFAULT '{"duration": "30", "tone": "Casual", "format": "Discussion"}';
