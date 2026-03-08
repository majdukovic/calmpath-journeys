import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share, MoreVertical, Check } from 'lucide-react';
import mascotHappy from '@/assets/mascot-happy.png';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

    // Listen for install prompt (Android/Desktop Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-grid-3 gap-grid-3">
        <img src={mascotHappy} alt="Breeze mascot" className="w-24 h-24 object-contain" />
        <div className="flex items-center gap-2 text-primary">
          <Check size={24} />
          <h1 className="text-2xl font-bold text-foreground">Already installed!</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-[300px]">
          Breeze is on your home screen. Open it anytime for your daily calm.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-grid-2 px-grid-4 py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[48px]"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-grid-3 gap-grid-4">
      <img src={mascotHappy} alt="Breeze mascot" className="w-24 h-24 object-contain drop-shadow-lg" />
      <h1 className="text-2xl font-bold text-foreground text-center">Install Breeze</h1>
      <p className="text-muted-foreground text-center max-w-[320px] leading-relaxed">
        Add Breeze to your home screen for the best experience — instant access, offline support, and daily reminders.
      </p>

      {/* Features */}
      <div className="w-full max-w-[320px] space-y-grid">
        {[
          { emoji: '⚡', text: 'Opens instantly — like a real app' },
          { emoji: '📴', text: 'Works offline — breathe anywhere' },
          { emoji: '🔔', text: 'Daily reminders — even when closed' },
          { emoji: '🌱', text: 'Your garden grows on your home screen' },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-grid-2 bg-card rounded-2xl px-grid-2 py-grid card-shadow">
            <span className="text-xl">{f.emoji}</span>
            <span className="text-sm text-foreground">{f.text}</span>
          </div>
        ))}
      </div>

      {/* Install button (Android/Desktop) */}
      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className="w-full max-w-[320px] py-grid-2 rounded-button bg-primary text-primary-foreground font-bold min-h-[56px] text-base flex items-center justify-center gap-2 transition-all hover:opacity-90"
        >
          <Download size={20} />
          Install Breeze
        </button>
      )}

      {/* iOS instructions */}
      {isIOS && !deferredPrompt && (
        <div className="w-full max-w-[320px] bg-card rounded-card p-grid-3 card-shadow">
          <p className="text-sm font-semibold text-foreground mb-grid-2">How to install on iPhone/iPad:</p>
          <ol className="space-y-grid-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="bg-primary/15 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
              <span>Tap the <Share size={14} className="inline text-primary" /> <strong className="text-foreground">Share</strong> button in Safari</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/15 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
              <span>Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/15 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
              <span>Tap <strong className="text-foreground">"Add"</strong> — that's it!</span>
            </li>
          </ol>
        </div>
      )}

      {/* Generic instructions (desktop without prompt) */}
      {!isIOS && !deferredPrompt && (
        <div className="w-full max-w-[320px] bg-card rounded-card p-grid-3 card-shadow">
          <p className="text-sm font-semibold text-foreground mb-grid-2">How to install:</p>
          <p className="text-sm text-muted-foreground">
            Click the <MoreVertical size={14} className="inline text-primary" /> menu in your browser's address bar, then select <strong className="text-foreground">"Install app"</strong> or <strong className="text-foreground">"Add to Home Screen"</strong>.
          </p>
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="text-sm text-muted-foreground mt-grid"
      >
        Maybe later
      </button>
    </div>
  );
};

export default Install;
