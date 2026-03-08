import { useNavigate, Link } from 'react-router-dom';
import { Wind, Brain, BookOpen, Heart, Shield, Sparkles, Star, ChevronRight, Smartphone } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.jpg';
import appIcon from '/app-icon.png';

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
                <a
                  href="#download"
                  className="bg-foreground text-background px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Download for iOS
                </a>
                <a
                  href="#download"
                  className="bg-card text-foreground border border-border px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.5 1.45a1 1 0 0 1 0 1.486l-2.5 1.45-2.537-2.536 2.537-2.85zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  Get on Android
                </a>
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

      {/* Value props bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">3 min</p>
            <p className="text-xs text-muted-foreground">To Feel Calmer</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Science-Backed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">Free</p>
            <p className="text-xs text-muted-foreground">No Account Needed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">Private</p>
            <p className="text-xs text-muted-foreground">Your Data Stays Local</p>
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
            {/* App Store badge placeholder — replace with actual link */}
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] opacity-80 leading-none">Download on the</p>
                <p className="text-lg font-semibold leading-tight">App Store</p>
              </div>
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.5 1.45a1 1 0 0 1 0 1.486l-2.5 1.45-2.537-2.536 2.537-2.85zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] opacity-80 leading-none">Get it on</p>
                <p className="text-lg font-semibold leading-tight">Google Play</p>
              </div>
            </a>
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
