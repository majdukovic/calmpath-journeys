
-- Create roadmap status enum
CREATE TYPE public.roadmap_status AS ENUM ('under_consideration', 'planned', 'in_progress', 'released');

-- Create roadmap items table
CREATE TABLE public.roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status roadmap_status NOT NULL DEFAULT 'under_consideration',
  emoji TEXT NOT NULL DEFAULT '💡',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roadmap votes table
CREATE TABLE public.roadmap_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.roadmap_items(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (item_id, user_id)
);

-- Enable RLS
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_votes ENABLE ROW LEVEL SECURITY;

-- Roadmap items: anyone can read
CREATE POLICY "Anyone can read roadmap items"
ON public.roadmap_items FOR SELECT
USING (true);

-- Roadmap votes: anyone can read (for counts)
CREATE POLICY "Anyone can read votes"
ON public.roadmap_votes FOR SELECT
USING (true);

-- Roadmap votes: authenticated users can insert their own vote
CREATE POLICY "Authenticated users can vote"
ON public.roadmap_votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Roadmap votes: users can remove their own vote
CREATE POLICY "Users can remove own vote"
ON public.roadmap_votes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
