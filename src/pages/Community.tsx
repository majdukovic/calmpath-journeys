import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePremium } from '@/contexts/PremiumContext';
import { generateDisplayName } from '@/lib/displayNames';
import { ArrowLeft, Send, Heart, Leaf, Zap, Lock, Sparkles, Phone, Trash2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface CommunityPost {
  id: string;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
  reactions?: { hug: number; relate: number; strength: number };
  userReactions?: string[];
}

const reactionConfig = [
  { type: 'hug', emoji: '❤️', label: 'Hug', icon: Heart },
  { type: 'relate', emoji: '🌿', label: 'Relate', icon: Leaf },
  { type: 'strength', emoji: '💪', label: 'Strength', icon: Zap },
];

const CRISIS_BANNER = {
  text: 'If you\'re in crisis, please call 988 (Suicide & Crisis Lifeline) or text HOME to 741741',
  url: 'tel:988',
};

const promptSuggestions = [
  '🌿 Share a breathing technique that helped you today',
  '💭 What\'s one thing you learned about your anxiety?',
  '🙏 Share something you\'re grateful for right now',
  '💪 Celebrate a small win — no matter how tiny',
  '❓ Ask the community anything about managing anxiety',
];

const Community = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPrompts, setShowPrompts] = useState(false);

  // Auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    const { data: postsData, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      setLoading(false);
      return;
    }

    if (!postsData || postsData.length === 0) {
      setPosts([]);
      setLoading(false);
      return;
    }

    // Fetch reactions for all posts
    const postIds = postsData.map(p => p.id);
    const { data: reactionsData } = await supabase
      .from('community_reactions')
      .select('*')
      .in('post_id', postIds);

    const enriched: CommunityPost[] = postsData.map(post => {
      const postReactions = (reactionsData || []).filter(r => r.post_id === post.id);
      return {
        ...post,
        reactions: {
          hug: postReactions.filter(r => r.reaction_type === 'hug').length,
          relate: postReactions.filter(r => r.reaction_type === 'relate').length,
          strength: postReactions.filter(r => r.reaction_type === 'strength').length,
        },
        userReactions: postReactions
          .filter(r => r.user_id === user?.id)
          .map(r => r.reaction_type),
      };
    });

    setPosts(enriched);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user, fetchPosts]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('community-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_reactions' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const handlePost = async () => {
    if (!newPost.trim() || posting || !user) return;
    setPosting(true);
    setError(null);

    try {
      const displayName = generateDisplayName(user.id);
      const { data, error: fnError } = await supabase.functions.invoke('community-post', {
        body: { content: newPost.trim(), display_name: displayName },
      });

      if (fnError) throw fnError;
      if (data?.rejected) {
        setError(data.reason || 'Post was not approved. Please try different wording.');
        setPosting(false);
        return;
      }

      setNewPost('');
      setShowPrompts(false);
      fetchPosts();
    } catch (e: any) {
      setError(e.message || 'Failed to post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    const hasReacted = post?.userReactions?.includes(reactionType);

    if (hasReacted) {
      await supabase
        .from('community_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType);
    } else {
      await supabase
        .from('community_reactions')
        .insert({ post_id: postId, user_id: user.id, reaction_type: reactionType });
    }
    fetchPosts();
  };

  const handleDeletePost = async (postId: string) => {
    await supabase.from('community_posts').delete().eq('id', postId);
    fetchPosts();
  };

  // Premium gate
  if (!isPremium) {
    return (
      <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
        <div className="max-w-[600px] mx-auto px-grid-3 py-grid-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary mb-grid-3 min-h-[48px]">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex flex-col items-center text-center gap-grid-3 py-grid-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Breeze Circle</h1>
            <p className="text-muted-foreground text-sm max-w-[300px] leading-relaxed">
              A warm, anonymous community of people who understand what you're going through. Share wins, ask questions, and support each other.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-grid">
              {['❤️ Supportive reactions', '🌿 Anonymous & safe', '🤖 AI-moderated', '💬 Real people'].map(f => (
                <span key={f} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{f}</span>
              ))}
            </div>
            <button
              onClick={() => navigate('/upgrade')}
              className="mt-grid-3 px-grid-4 py-grid-2 rounded-button bg-primary text-primary-foreground font-bold min-h-[56px] text-base flex items-center gap-2"
            >
              <Sparkles size={18} />
              Unlock with Breeze Plus
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auth gate — must be signed in
  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
        <div className="max-w-[600px] mx-auto px-grid-3 py-grid-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary mb-grid-3 min-h-[48px]">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex flex-col items-center text-center gap-grid-3 py-grid-6">
            <div className="text-5xl">🌿</div>
            <h1 className="text-2xl font-bold text-foreground">Sign in to join</h1>
            <p className="text-muted-foreground text-sm max-w-[280px]">
              Sign in via Settings to join the Breeze Circle community.
            </p>
            <button
              onClick={() => navigate('/settings')}
              className="px-grid-4 py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[48px]"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = generateDisplayName(user.id);

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
      <div className="max-w-[600px] mx-auto px-grid-3 py-grid-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 200px)' }}>
        {/* Header */}
        <div className="flex items-center gap-grid-2 mb-grid-2">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary min-h-[48px]">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-1.5">
              🌿 Breeze Circle
              <Sparkles size={14} className="text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">You're <span className="font-semibold text-primary">{displayName}</span></p>
          </div>
        </div>

        {/* Crisis banner */}
        <a
          href={CRISIS_BANNER.url}
          className="block bg-accent/10 border border-accent/20 rounded-card px-grid-2 py-grid text-xs text-muted-foreground mb-grid-3 hover:bg-accent/15 transition-colors"
        >
          <Phone size={12} className="inline mr-1" />
          {CRISIS_BANNER.text}
        </a>

        {/* Compose */}
        <div className="bg-card rounded-card p-grid-2 card-shadow mb-grid-3">
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value.slice(0, 500))}
            placeholder="Share something with the community..."
            className="w-full min-h-[80px] bg-transparent border-none resize-none text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60"
            onFocus={() => setShowPrompts(true)}
          />

          {/* Prompt suggestions */}
          {showPrompts && !newPost && (
            <div className="flex flex-wrap gap-1 mb-grid-2">
              {promptSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setNewPost(prompt.replace(/^[^\s]+\s/, ''))}
                  className="text-[11px] bg-primary/5 text-primary px-2 py-1 rounded-full hover:bg-primary/10 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{newPost.length}/500</span>
            <button
              onClick={handlePost}
              disabled={posting || newPost.trim().length < 2}
              className="flex items-center gap-1 px-grid-2 py-1 bg-primary text-primary-foreground rounded-button text-sm font-medium min-h-[36px] disabled:opacity-40 transition-opacity"
            >
              <Send size={14} />
              {posting ? 'Posting...' : 'Share'}
            </button>
          </div>
          {error && (
            <p className="text-xs text-destructive mt-grid">{error}</p>
          )}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-grid-6">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-grid-6 text-muted-foreground">
            <p className="text-3xl mb-grid-2">🌱</p>
            <p className="text-sm font-medium">Be the first to share!</p>
            <p className="text-xs mt-grid max-w-[260px] mx-auto">
              This is a safe, anonymous space. Share a win, ask a question, or just say hi.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-grid-2">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                isOwn={post.user_id === user.id}
                onReact={handleReaction}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── POST CARD ───
const PostCard = ({
  post,
  isOwn,
  onReact,
  onDelete,
}: {
  post: CommunityPost;
  isOwn: boolean;
  onReact: (postId: string, type: string) => void;
  onDelete: (postId: string) => void;
}) => {
  const timeAgo = getTimeAgo(post.created_at);

  return (
    <div className="bg-card rounded-card p-grid-2 card-shadow">
      <div className="flex items-start justify-between mb-grid">
        <div>
          <span className="text-sm font-semibold text-foreground">{post.display_name}</span>
          <span className="text-[10px] text-muted-foreground ml-2">{timeAgo}</span>
        </div>
        {isOwn && (
          <button
            onClick={() => onDelete(post.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Delete post"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-grid-2 whitespace-pre-wrap">{post.content}</p>

      {/* Reactions */}
      <div className="flex gap-1">
        {reactionConfig.map(r => {
          const count = (post.reactions as any)?.[r.type] || 0;
          const isActive = post.userReactions?.includes(r.type);
          return (
            <button
              key={r.type}
              onClick={() => onReact(post.id, r.type)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all min-h-[30px] ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{r.emoji}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default Community;
