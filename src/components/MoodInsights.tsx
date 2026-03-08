// AI Mood Insights — premium feature
import { useState } from 'react';
import { Brain, Sparkles, Lock, RefreshCw } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import { getData } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const MoodInsights = () => {
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = getData();
  const hasMoodData = data.moodEntries.length >= 3;

  const fetchInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('mood-insights', {
        body: {
          moodEntries: data.moodEntries.slice(0, 30),
          dailyCalmSessions: data.dailyCalmSessions.slice(0, 30),
          gratitudeEntries: data.gratitudeEntries.slice(0, 10),
        },
      });
      if (fnError) throw fnError;
      setInsight(result?.insight || 'Keep logging — insights are building!');
    } catch (e: any) {
      console.error('Mood insights error:', e);
      setError('Could not load insights right now. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Locked state for free users
  if (!isPremium) {
    return (
      <button
        onClick={() => navigate('/upgrade')}
        className="w-full bg-card rounded-card p-grid-3 card-shadow text-left transition-all hover:card-shadow-hover relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative flex items-start gap-grid-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Brain size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm font-semibold text-foreground">AI Mood Insights</span>
              <Lock size={12} className="text-muted-foreground" />
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">PLUS</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Get weekly personalized analysis of your mood patterns, triggers, and progress — powered by AI.
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-card rounded-card p-grid-3 card-shadow">
      <div className="flex items-center justify-between mb-grid-2">
        <div className="flex items-center gap-1.5">
          <Brain size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-foreground">AI Mood Insights</h2>
          <Sparkles size={12} className="text-primary" />
        </div>
        {insight && (
          <button
            onClick={fetchInsight}
            disabled={loading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Refresh insights"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      {!hasMoodData ? (
        <p className="text-sm text-muted-foreground">
          Log at least 3 moods to unlock your first AI insight 🌱
        </p>
      ) : !insight && !loading && !error ? (
        <button
          onClick={fetchInsight}
          className="w-full py-grid-2 rounded-button bg-primary/10 text-primary font-medium text-sm min-h-[44px] transition-all hover:bg-primary/15"
        >
          ✨ Generate my weekly insight
        </button>
      ) : loading ? (
        <div className="flex items-center gap-grid-2 py-grid-2">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Analyzing your patterns...</span>
        </div>
      ) : error ? (
        <div>
          <p className="text-sm text-destructive mb-grid">{error}</p>
          <button
            onClick={fetchInsight}
            className="text-xs text-primary font-medium underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <p className="text-sm text-foreground leading-relaxed">{insight}</p>
      )}
    </div>
  );
};

export default MoodInsights;
