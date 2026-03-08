import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/contexts/PremiumContext';
import { Check, Sparkles, Brain, Wind, Crown, ArrowLeft, BarChart3, Mic, Moon } from 'lucide-react';
import mascotProud from '@/assets/mascot-proud.png';

const features = [
  {
    icon: Brain,
    title: 'AI Mood Insights',
    description: 'Weekly personalized analysis of your mood patterns, triggers, and progress — powered by AI.',
  },
  {
    icon: Wind,
    title: 'Extended Breathing Library',
    description: '5 additional breathing techniques for sleep, energy, beginners, and deep relaxation.',
  },
  {
    icon: BarChart3,
    title: 'Breeze Circle Community',
    description: 'An anonymous, AI-moderated peer support space. Share wins, ask questions, and connect with people who get it.',
  },
  {
    icon: Mic,
    title: 'Premium Ambient Sounds',
    description: 'Forest, wind, and night soundscapes to complement your breathing sessions.',
  },
  {
    icon: Moon,
    title: 'Unlimited Journal History',
    description: 'Access your complete freewrite journal — look back on your full journey anytime.',
  },
];

const UpgradePage = () => {
  const navigate = useNavigate();
  const { startCheckout, isPremium } = usePremium();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await startCheckout(selectedPlan);
    } catch (e) {
      console.error('Checkout error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-grid-3 gap-grid-3">
        <img src={mascotProud} alt="Breeze mascot" className="w-24 h-24 object-contain" />
        <div className="flex items-center gap-2 text-primary">
          <Crown size={24} />
          <h1 className="text-2xl font-bold text-foreground">You're on Breeze Plus!</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-[300px]">
          All premium features are unlocked. Thank you for supporting Breeze 💚
        </p>
        <button
          onClick={() => navigate('/settings')}
          className="mt-grid-2 px-grid-4 py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[48px]"
        >
          Back to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[480px] mx-auto px-grid-3 py-grid-4">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary mb-grid-3 min-h-[48px]">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Hero */}
        <div className="text-center mb-grid-4">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-grid-2">
            <Sparkles size={14} />
            Breeze Plus
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-grid">
            Unlock your full calm potential
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Personalized insights and more breathing techniques to support your journey.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-grid-2 mb-grid-4">
          {features.map((f, i) => (
            <div key={i} className="bg-card rounded-card p-grid-2 card-shadow flex gap-grid-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <f.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div className="space-y-grid-2 mb-grid-3">
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`w-full p-grid-2 rounded-card border-2 text-left transition-all ${
              selectedPlan === 'yearly'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Yearly</span>
                  <span className="bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    SAVE 37%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">$14.99/year ($1.25/month)</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'yearly' ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedPlan === 'yearly' && <Check size={12} className="text-primary-foreground" />}
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full p-grid-2 rounded-card border-2 text-left transition-all ${
              selectedPlan === 'monthly'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-foreground">Monthly</span>
                <p className="text-xs text-muted-foreground mt-0.5">$1.99/month</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'monthly' ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedPlan === 'monthly' && <Check size={12} className="text-primary-foreground" />}
              </div>
            </div>
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-bold min-h-[56px] text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
        >
          <Sparkles size={18} />
          {loading ? 'Opening checkout...' : `Start Breeze Plus`}
        </button>

        <p className="text-[11px] text-muted-foreground text-center mt-grid-2">
          Cancel anytime. Your calm journey data stays yours forever.
        </p>

        {/* What stays free */}
        <div className="mt-grid-4 bg-card rounded-card p-grid-2 card-shadow">
          <p className="text-xs font-semibold text-foreground mb-grid">Always free:</p>
          <div className="grid grid-cols-2 gap-1">
            {['SOS breathing', 'Daily Calm', 'Gratitude journal', 'Mood tracking', 'Growth garden', '3 breathing patterns'].map(f => (
              <div key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                <Check size={12} className="text-primary flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
