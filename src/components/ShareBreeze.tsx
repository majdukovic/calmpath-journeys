import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const SHARE_URL = 'https://calm-breeze.lovable.app';
const SHARE_MESSAGES = [
  "This breathing app actually helped me calm down during a panic attack. It's free — try it 🌬️",
  "Found this anxiety app called Breeze. 3 minutes of breathing and I felt so much better 🌿",
  "If you struggle with anxiety, try Breeze. Science-backed breathing exercises + the cutest fox companion 🦊",
  "Someone recommended this app for anxiety and it actually works. Free, no account needed 💚",
];

const ShareBreeze = () => {
  const [copied, setCopied] = useState(false);
  const message = SHARE_MESSAGES[Math.floor(Math.random() * SHARE_MESSAGES.length)];
  const shareText = `${message}\n${SHARE_URL}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Breeze — Calm in Your Pocket', text: message, url: SHARE_URL });
        return;
      } catch {}
    }
    // Fallback: copy to clipboard
    handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center gap-grid-2 px-grid-2 py-grid-2 rounded-card bg-primary/5 border border-primary/10 text-sm text-foreground hover:bg-primary/10 transition-colors min-h-[56px]"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {copied ? <Check size={18} className="text-primary" /> : <Share2 size={18} className="text-primary" />}
      </div>
      <div className="text-left flex-1">
        <span className="font-semibold text-foreground text-sm">Share Breeze with a friend</span>
        <p className="text-[11px] text-muted-foreground">Help someone breathe easier today 💚</p>
      </div>
    </button>
  );
};

export default ShareBreeze;
