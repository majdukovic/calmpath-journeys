import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, updateSettings, exportDataAsCSV, deleteAllData } from '@/lib/storage';
import { breathingPatterns } from '@/lib/data';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Mail, LogOut, Bell, BellOff, Download, Trash2, ExternalLink, Smartphone, MessageCircle, Shield, ChevronRight, Sparkles, Crown, Lock } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import type { User } from '@supabase/supabase-js';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  startNotificationScheduler,
  stopNotificationScheduler,
  rescheduleNotification,
} from '@/lib/notifications';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const patternDescriptions: Record<string, string> = {
  '4-7-8': 'Calming technique for sleep & anxiety',
  'box': 'Balanced breathing used by Navy SEALs',
  'sigh': 'Fastest way to calm down (Stanford research)',
  '2-4-6': 'Gentle intro for beginners',
  'calm': 'Simple equal breathing for calm',
  'energize': 'Short inhale, long exhale for energy',
  'sleep': 'Extended exhale to ease into sleep',
  'resonance': 'Heart-rate coherence technique',
};

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getData().settings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { isPremium, openPortal } = usePremium();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const update = (partial: Partial<typeof settings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    updateSettings(partial);
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    const { error } = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (error) setAuthError(error.message || 'Google sign-in failed');
    setAuthLoading(false);
  };

  const handleAppleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    const { error } = await lovable.auth.signInWithOAuth('apple', {
      redirect_uri: window.location.origin,
    });
    if (error) setAuthError(error.message || 'Apple sign-in failed');
    setAuthLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email.trim()) return;
    setAuthLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setMagicLinkSent(true);
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleExport = () => {
    const csv = exportDataAsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'breathly-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    deleteAllData();
    setShowDeleteConfirm(false);
    window.location.reload();
  };

  return (
    <div className="py-grid-4">
      <h1 className="text-2xl font-semibold text-foreground mb-grid-3">Settings</h1>

      {/* ── Notifications & Reminders (most used — top) ── */}
      <Section title="Notifications">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          {isNotificationSupported() && getNotificationPermission() === 'denied' && (
            <div className="bg-destructive/10 rounded-2xl px-grid-2 py-grid text-xs text-destructive">
              <BellOff size={14} className="inline mr-1" />
              Notifications are blocked. Please enable them in your device settings.
            </div>
          )}

          <div className="flex items-center justify-between min-h-[48px]">
            <div>
              <span className="text-sm text-foreground">Daily reminder</span>
              <p className="text-xs text-muted-foreground">A gentle nudge to breathe</p>
            </div>
            <ToggleSwitch
              value={settings.reminderEnabled}
              onChange={async () => {
                const enabling = !settings.reminderEnabled;
                if (enabling) {
                  const granted = await requestNotificationPermission();
                  if (!granted) return;
                  update({ reminderEnabled: true });
                  startNotificationScheduler();
                } else {
                  update({ reminderEnabled: false });
                  stopNotificationScheduler();
                }
              }}
              label="Toggle daily reminder"
            />
          </div>

          {settings.reminderEnabled && (
            <>
              <div className="flex items-center justify-between min-h-[48px]">
                <span className="text-sm text-muted-foreground">Reminder time</span>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={e => {
                    update({ reminderTime: e.target.value });
                    rescheduleNotification();
                  }}
                  className="text-sm bg-muted rounded-md px-2 py-1 text-foreground"
                />
              </div>
              {getNotificationPermission() === 'granted' && (
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <Bell size={13} />
                  <span>We'll nudge you at {settings.reminderTime}</span>
                </div>
              )}
            </>
          )}
        </div>
      </Section>

      {/* ── Session Preferences ── */}
      <Section title="Session">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <div>
            <span className="text-sm text-foreground block mb-grid font-medium">Breathing pattern</span>
            <div className="flex flex-col gap-1">
              {breathingPatterns.map(p => {
                const isLocked = p.premium && !isPremium;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (isLocked) {
                        navigate('/upgrade');
                        return;
                      }
                      update({ defaultBreathingPattern: p.id });
                    }}
                    className={`text-left px-grid-2 py-grid rounded-md min-h-[44px] transition-colors ${
                      settings.defaultBreathingPattern === p.id
                        ? 'bg-primary/10 border border-primary/20'
                        : isLocked ? 'opacity-60 hover:bg-muted' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm ${settings.defaultBreathingPattern === p.id ? 'text-primary font-medium' : 'text-foreground'}`}>
                        {p.label}
                      </span>
                      {isLocked && <Lock size={12} className="text-muted-foreground" />}
                      {p.premium && isPremium && <Sparkles size={12} className="text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{patternDescriptions[p.id]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-grid-2 space-y-grid">
            <ToggleRow
              label="Voice guide"
              description="Spoken instructions during breathing"
              value={settings.voiceGuideEnabled}
              onChange={v => update({ voiceGuideEnabled: v })}
            />
            <ToggleRow
              label="Haptics"
              description="Vibration feedback on inhale/exhale"
              value={settings.hapticsEnabled}
              onChange={v => update({ hapticsEnabled: v })}
            />
            <ToggleRow
              label="Sound"
              description="Ambient audio during sessions"
              value={settings.audioEnabled}
              onChange={v => update({ audioEnabled: v })}
            />
          </div>
        </div>
      </Section>

      {/* ── Appearance ── */}
      <Section title="Appearance">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <span className="text-sm text-foreground block font-medium">Theme</span>
          <div className="flex gap-1 bg-muted rounded-button p-1">
            {([
              { value: 'light' as const, label: '☀️ Light' },
              { value: 'dark' as const, label: '🌙 Dark' },
              { value: 'system' as const, label: '⚙️ System' },
            ]).map(t => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`flex-1 text-sm px-grid py-grid-2 rounded-button min-h-[40px] transition-all font-medium ${
                  theme === t.value
                    ? 'bg-card text-primary card-shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-grid-2">
            <ToggleRow
              label="Show SOS card on Home"
              description="Quick access from the home screen"
              value={settings.showSOSCard}
              onChange={v => update({ showSOSCard: v })}
            />
          </div>
        </div>
      </Section>

      {/* ── Emergency Contact ── */}
      <Section title="Emergency Contact">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <p className="text-xs text-muted-foreground">
            Save a trusted person to quick-call from the SOS screen
          </p>
          <div className="space-y-grid">
            <input
              type="text"
              placeholder="Contact name"
              value={settings.emergencyContact?.name || ''}
              onChange={e => update({ emergencyContact: { ...settings.emergencyContact, name: e.target.value, phone: settings.emergencyContact?.phone || '' } })}
              className="w-full text-sm bg-muted rounded-md px-grid-2 py-grid-2 text-foreground placeholder:text-muted-foreground min-h-[44px]"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={settings.emergencyContact?.phone || ''}
              onChange={e => update({ emergencyContact: { ...settings.emergencyContact, phone: e.target.value, name: settings.emergencyContact?.name || '' } })}
              className="w-full text-sm bg-muted rounded-md px-grid-2 py-grid-2 text-foreground placeholder:text-muted-foreground min-h-[44px]"
            />
          </div>
          {settings.emergencyContact?.phone ? (
            <div className="flex items-center justify-between">
              <p className="text-xs text-primary">✓ Available in your SOS flow</p>
              <button
                onClick={() => update({ emergencyContact: { name: '', phone: '' } })}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear
              </button>
            </div>
          ) : null}
        </div>
      </Section>

      {/* ── Breathly Plus ── */}
      <Section title="Breathly Plus">
        <div className="bg-card rounded-card p-grid-2 card-shadow">
          {isPremium ? (
            <div className="space-y-grid-2">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">Active subscriber</span>
              </div>
              <button
                onClick={openPortal}
                className="w-full flex items-center justify-center gap-2 py-grid-2 rounded-button bg-muted text-foreground font-medium min-h-[48px] text-sm hover:bg-muted/80 transition-colors"
              >
                Manage subscription
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/upgrade')}
              className="w-full flex items-center gap-grid-2 px-grid-2 py-grid-2 rounded-md text-sm min-h-[48px] transition-colors hover:bg-primary/5"
            >
              <Sparkles size={18} className="text-primary" />
              <div className="text-left flex-1">
                <span className="text-sm font-semibold text-foreground">Upgrade to Plus</span>
                <p className="text-[11px] text-muted-foreground">AI insights, voice sessions, sleep routines & more</p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </Section>

      {/* ── Account ── */}
      <Section title="Account">
        <div className="bg-card rounded-card p-grid-3 card-shadow">
          {user ? (
            <div className="flex flex-col gap-grid-2">
              <div className="flex items-center gap-grid-2">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-lg">
                  {(user.email?.[0] || '?').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Signed in</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-grid-2 rounded-button bg-muted text-foreground font-medium min-h-[48px] text-sm flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-grid-2">
              <p className="text-sm text-muted-foreground mb-grid">
                Sign in to back up your data (optional)
              </p>

              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full py-grid-2 rounded-button border border-border bg-card text-foreground font-medium min-h-[48px] text-sm flex items-center justify-center gap-3 transition-colors hover:bg-muted disabled:opacity-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <button
                onClick={handleAppleSignIn}
                disabled={authLoading}
                className="w-full py-grid-2 rounded-button bg-foreground text-background font-medium min-h-[48px] text-sm flex items-center justify-center gap-3 transition-colors hover:opacity-90 disabled:opacity-50"
              >
                <AppleIcon />
                Continue with Apple
              </button>

              <div className="flex items-center gap-grid-2 my-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {magicLinkSent ? (
                <div className="bg-primary/10 rounded-2xl p-grid-2 text-center">
                  <p className="text-sm text-primary font-medium">✉️ Check your inbox!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We sent a magic link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <button
                    onClick={() => setMagicLinkSent(false)}
                    className="text-xs text-primary mt-2 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="flex gap-grid">
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3 py-grid-2 rounded-button bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[48px]"
                    />
                  </div>
                  <button
                    onClick={handleMagicLink}
                    disabled={authLoading || !email.trim()}
                    className="px-grid-3 py-grid-2 rounded-button bg-primary text-primary-foreground font-medium text-sm min-h-[48px] transition-all hover:opacity-90 disabled:opacity-40"
                  >
                    Send link
                  </button>
                </div>
              )}

              {authError && (
                <p className="text-xs text-destructive mt-1">{authError}</p>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* ── Data & Privacy ── */}
      <Section title="Data & Privacy">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-1">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-grid-2 px-grid-2 py-grid-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors min-h-[48px]"
          >
            <Download size={16} className="text-muted-foreground" />
            <span>Export my data (CSV)</span>
          </button>
          <button
            onClick={() => navigate('/install')}
            className="w-full flex items-center gap-grid-2 px-grid-2 py-grid-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors min-h-[48px]"
          >
            <Smartphone size={16} className="text-muted-foreground" />
            <span>Install app</span>
            <ChevronRight size={14} className="text-muted-foreground ml-auto" />
          </button>
        </div>
      </Section>

      {/* ── Medical Disclaimer ── */}
      <Section title="Important">
        <div className="bg-card rounded-card p-grid-2 card-shadow">
          <div className="flex gap-grid-2 items-start">
            <Shield size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Breathly is <strong className="text-foreground">not a medical device</strong> and does not provide medical advice, diagnosis, or treatment. The content and exercises are for educational and wellness purposes only. If you are experiencing a mental health crisis, please contact a professional or call emergency services.
            </p>
          </div>
        </div>
      </Section>

      {/* ── About ── */}
      <Section title="About">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-1">
          <div className="flex justify-between text-sm min-h-[40px] items-center px-grid-2">
            <span className="text-foreground">Version</span>
            <span className="text-muted-foreground">1.0.0</span>
          </div>
          <a
            href="mailto:feedback@breathly.app"
            className="w-full flex items-center gap-grid-2 px-grid-2 py-grid-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors min-h-[48px]"
          >
            <MessageCircle size={16} className="text-muted-foreground" />
            <span>Send feedback</span>
            <ExternalLink size={12} className="text-muted-foreground ml-auto" />
          </a>
          <button
            onClick={() => navigate('/terms')}
            className="w-full flex items-center gap-grid-2 px-grid-2 py-grid-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors min-h-[48px]"
          >
            <Shield size={16} className="text-muted-foreground" />
            <span>Terms of Service</span>
            <ChevronRight size={12} className="text-muted-foreground ml-auto" />
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="w-full flex items-center gap-grid-2 px-grid-2 py-grid-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors min-h-[48px]"
          >
            <Shield size={16} className="text-muted-foreground" />
            <span>Privacy Policy</span>
            <ChevronRight size={12} className="text-muted-foreground ml-auto" />
          </button>
        </div>
      </Section>

      {/* ── Crisis Resources ── */}
      <Section title="Need more help?">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <div className="text-sm">
            <p className="font-medium text-foreground">Emergency</p>
            <a href="tel:911" className="text-primary min-h-[48px] flex items-center">Call 911</a>
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">Crisis Text Line</p>
            <p className="text-muted-foreground">Text HOME to 741741</p>
          </div>
          <div className="text-sm">
            <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer" className="text-primary min-h-[48px] flex items-center">
              Find a therapist →
            </a>
          </div>
        </div>
      </Section>

      {/* ── Danger zone — visually separated at bottom ── */}
      <div className="mt-grid-4 mb-grid-4">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-grid-2 rounded-button text-destructive font-medium min-h-[48px] text-sm hover:bg-destructive/5 transition-colors"
        >
          <Trash2 size={16} />
          Delete all my data
        </button>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] bg-foreground/50 flex items-center justify-center p-grid-3">
          <div className="bg-card rounded-card p-grid-3 card-shadow max-w-[360px] w-full">
            <h3 className="text-lg font-semibold text-foreground mb-grid">Delete all data?</h3>
            <p className="text-sm text-muted-foreground mb-grid-3">
              This will permanently delete all your journal entries, mood logs, and session history. This cannot be undone.
            </p>
            <div className="flex gap-grid-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-grid-2 rounded-button bg-muted text-foreground font-medium min-h-[48px] text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-grid-2 rounded-button bg-destructive text-destructive-foreground font-medium min-h-[48px] text-sm"
              >
                Delete everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-grid-3">
    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-grid-2">{title}</h2>
    {children}
  </div>
);

const ToggleSwitch = ({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) => (
  <button
    onClick={onChange}
    className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-primary' : 'bg-border'}`}
    aria-label={label}
  >
    <div className={`w-5 h-5 bg-card rounded-full absolute top-1 transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const ToggleRow = ({ label, description, value, onChange }: { label: string; description?: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between min-h-[48px]">
    <div>
      <span className="text-sm text-foreground">{label}</span>
      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
    </div>
    <ToggleSwitch value={value} onChange={() => onChange(!value)} label={`Toggle ${label}`} />
  </div>
);

export default Settings;
