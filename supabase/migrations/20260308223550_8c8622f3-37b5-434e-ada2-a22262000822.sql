
-- Community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  content TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'general',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community reactions table
CREATE TABLE public.community_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('hug', 'relate', 'strength')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, reaction_type)
);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;

-- Posts RLS: anyone authenticated can read approved posts
CREATE POLICY "Authenticated users can read approved posts"
  ON public.community_posts FOR SELECT TO authenticated
  USING (is_approved = true);

-- Posts RLS: users can insert their own posts
CREATE POLICY "Users can insert own posts"
  ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Posts RLS: users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON public.community_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Reactions RLS: anyone authenticated can read reactions
CREATE POLICY "Authenticated users can read reactions"
  ON public.community_reactions FOR SELECT TO authenticated
  USING (true);

-- Reactions RLS: users can insert own reactions
CREATE POLICY "Users can insert own reactions"
  ON public.community_reactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Reactions RLS: users can delete own reactions
CREATE POLICY "Users can delete own reactions"
  ON public.community_reactions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_reactions;

-- Index for fast feed queries
CREATE INDEX idx_community_posts_approved_created ON public.community_posts (is_approved, created_at DESC);
CREATE INDEX idx_community_reactions_post_id ON public.community_reactions (post_id);
