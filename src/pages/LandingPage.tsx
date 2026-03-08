import { useNavigate, Link } from 'react-router-dom';
import { Wind, Brain, BookOpen, Heart, Shield, Sparkles, Star, ChevronRight, Smartphone } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.jpg';
import appIcon from '/app-icon.png';
import { AppStoreBadge, GooglePlayBadge } from '@/components/StoreBadges';

const features = [
  {
    icon: Wind,
    title: 'Guided Breathing',
    description: 'Science-backed techniques like 4-7-8, Box Breathing, and Physiological Sigh to calm your nervous system in under 3 minutes.',
  },
  {
    icon: Shield,
    title: 'SOS Panic Relief',
    description: 'Instant 2-tap access to guided breathing when anxiety strikes. No login required — just open and breathe.',
  },
  {
    icon: BookOpen,
    title: 'Journal & Reflect',
    description: 'Freewrite to clear your head, track gratitude, and log your mood. See patterns over time with zero pressure.',
  },
  {
    icon: Heart,
    title: 'Daily Calm Ritual',
    description: 'A 3-minute daily routine combining breathing, gratitude, and mood check-in. Build calm habits, not streaks.',
  },
  {
    icon: Brain,
    title: 'Learn the Science',
    description: 'Understand anxiety through friendly, research-backed articles. Every claim linked to peer-reviewed sources.',
  },
  {
    icon: Sparkles,
    title: 'AI Mood Insights',
    description: 'Premium: Get personalized weekly analysis of your mood patterns, triggers, and progress powered by AI.',
  },
];

const testimonials = [
  { text: "Finally an anxiety app that doesn't feel clinical. Breeze feels like a friend.", name: 'Sarah K.', stars: 5 },
  { text: "The SOS button has helped me through 3 panic attacks. Life-changing.", name: 'Marcus T.', stars: 5 },
  { text: "I love that it doesn't guilt-trip me for missing days. Just gentle encouragement.", name: 'Priya M.', stars: 5 },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={appIcon} alt="Breeze" className="w-8 h-8 rounded-xl" />
            <span className="text-lg font-bold text-foreground">Breeze</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#reviews" className="hover:text-foreground transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <a
            href="#download"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Download Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-8 md:pt-24 md:pb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-6">
                <Star size={12} className="fill-current" />
                Calm in Your Pocket
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Anxiety relief that fits in your{' '}
                <span className="text-primary">pocket</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Breeze helps you manage anxiety with guided breathing, journaling, and your fox companion — all backed by science, designed with warmth.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <AppStoreBadge variant="hero" />
                <GooglePlayBadge variant="hero" />
              </div>
              <p className="text-xs text-muted-foreground mt-4">Free to use. No account required. Premium optional.</p>
            </div>
            <div className="relative">
              <img
                src={heroIllustration}
                alt="Breeze fox companion in a peaceful meadow"
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">4.9★</p>
            <p className="text-xs text-muted-foreground">App Store Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">100K+</p>
            <p className="text-xs text-muted-foreground">Breathing Sessions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">3 min</p>
            <p className="text-xs text-muted-foreground">To Feel Calmer</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Science-Backed</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to find calm
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with therapist-informed principles. No guilt, no streaks — just tools that work when you need them.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card rounded-3xl p-8 card-shadow hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-card/50 border-y border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
            Calm in 3 simple steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', emoji: '📱', title: 'Open Breeze', desc: 'No sign-up needed. Your calm companion is ready the moment you open the app.' },
              { step: '2', emoji: '🌬️', title: 'Breathe', desc: 'Follow the guided animation. 3 minutes of science-backed breathing calms your nervous system.' },
              { step: '3', emoji: '🌱', title: 'Grow', desc: 'Track your mood, journal your thoughts, and watch your garden grow with each calm day.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{s.emoji}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
            What people are saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card rounded-3xl p-8 card-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="text-xs text-muted-foreground font-medium">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-card/50 border-y border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            Free forever. Premium when you're ready.
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Everything you need to manage anxiety is free. Upgrade to Breeze Plus for AI insights and more.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-background rounded-3xl p-8 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-1">Free</h3>
              <p className="text-3xl font-bold text-foreground mb-4">$0 <span className="text-sm font-normal text-muted-foreground">forever</span></p>
              <ul className="space-y-3 mb-8">
                {['SOS panic relief', '3 breathing patterns', 'Daily Calm ritual', 'Gratitude journal', 'Mood tracking', 'Growth garden', 'Learn articles'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#download" className="w-full py-3.5 rounded-2xl bg-muted text-foreground font-semibold text-sm flex items-center justify-center hover:bg-muted/80 transition-colors">
                Download Free
              </a>
            </div>
            {/* Plus */}
            <div className="bg-background rounded-3xl p-8 border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                Breeze Plus
              </h3>
              <p className="text-3xl font-bold text-foreground mb-4">$1.99 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'AI mood insights', '8 breathing patterns', 'Advanced analytics', 'Guided voice sessions', 'Sleep wind-down routine', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#download" className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center hover:opacity-90 transition-opacity">
                Start Free, Upgrade Anytime
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Download */}
      <section id="download" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <img src={appIcon} alt="Breeze" className="w-20 h-20 rounded-3xl mx-auto mb-6 shadow-lg" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start breathing. Start healing.
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Download Breeze for free and take your first step toward calm. No account needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AppStoreBadge variant="cta" />
            <GooglePlayBadge variant="cta" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img src={appIcon} alt="Breeze" className="w-6 h-6 rounded-lg" />
              <span className="text-sm font-semibold text-foreground">Breeze</span>
              <span className="text-xs text-muted-foreground">— Calm in Your Pocket</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <a href="mailto:hello@breezeapp.co" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Breeze is not a medical device and does not provide medical advice. For emergencies, contact your local emergency services.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © {new Date().getFullYear()} Breeze. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
