import { useState } from 'react';
import { getData, updateSettings, exportDataAsCSV, deleteAllData } from '@/lib/storage';
import { breathingPatterns } from '@/lib/data';
import { useTheme } from '@/hooks/use-theme';

const Settings = () => {
  const [settings, setSettings] = useState(getData().settings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { theme, setTheme } = useTheme();

  const update = (partial: Partial<typeof settings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    updateSettings(partial);
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

      {/* Account */}
      <Section title="Account">
        <div className="bg-card rounded-card p-grid-2 card-shadow">
          <p className="text-sm text-muted-foreground mb-grid">Create an account to back up your data (optional)</p>
          <div className="flex flex-col gap-grid">
            <button className="w-full py-grid-2 rounded-button bg-muted text-foreground font-medium min-h-[48px] text-sm">
              Continue with Email
            </button>
            <button className="w-full py-grid-2 rounded-button bg-muted text-foreground font-medium min-h-[48px] text-sm">
              Continue with Google
            </button>
            <button className="w-full py-grid-2 rounded-button bg-muted text-foreground font-medium min-h-[48px] text-sm">
              Continue with Apple
            </button>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <div className="bg-card rounded-card p-grid-2 card-shadow">
          <span className="text-sm text-foreground block mb-grid font-medium">Theme</span>
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
        </div>
      </Section>

      {/* Home Screen */}
      <Section title="Home Screen">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <ToggleRow
            label="Show SOS card on Home"
            value={settings.showSOSCard}
            onChange={v => update({ showSOSCard: v })}
          />
          <p className="text-xs text-muted-foreground italic">
            The SOS button is always available in the bottom navigation bar
          </p>
        </div>
      </Section>


      <Section title="Notifications">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <div className="flex items-center justify-between min-h-[48px]">
            <span className="text-sm text-foreground">Daily reminder</span>
            <button
              onClick={() => update({ reminderEnabled: !settings.reminderEnabled })}
              className={`w-12 h-7 rounded-full transition-colors relative ${settings.reminderEnabled ? 'bg-primary' : 'bg-border'}`}
              aria-label="Toggle daily reminder"
            >
              <div className={`w-5 h-5 bg-card rounded-full absolute top-1 transition-transform ${settings.reminderEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {settings.reminderEnabled && (
            <div className="flex items-center justify-between min-h-[48px]">
              <span className="text-sm text-muted-foreground">Reminder time</span>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={e => update({ reminderTime: e.target.value })}
                className="text-sm bg-muted rounded-md px-2 py-1 text-foreground"
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground italic">
            "Your Daily Calm is ready whenever you are"
          </p>
        </div>
      </Section>

      {/* SOS Preferences */}
      <Section title="SOS Preferences">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <div>
            <span className="text-sm text-foreground block mb-grid">Default breathing pattern</span>
            <div className="flex flex-col gap-1">
              {breathingPatterns.map(p => (
                <button
                  key={p.id}
                  onClick={() => update({ defaultBreathingPattern: p.id })}
                  className={`text-left text-sm px-grid-2 py-grid rounded-md min-h-[40px] transition-colors ${
                    settings.defaultBreathingPattern === p.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <ToggleRow
            label="Haptics"
            value={settings.hapticsEnabled}
            onChange={v => update({ hapticsEnabled: v })}
          />
          <ToggleRow
            label="Audio"
            value={settings.audioEnabled}
            onChange={v => update({ audioEnabled: v })}
          />
        </div>
      </Section>

      {/* Data & Privacy */}
      <Section title="Data & Privacy">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <button
            onClick={handleExport}
            className="w-full py-grid-2 rounded-button bg-muted text-foreground font-medium min-h-[48px] text-sm"
          >
            Export my data (CSV)
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-grid-2 rounded-button bg-destructive/10 text-destructive font-medium min-h-[48px] text-sm"
          >
            Delete all my data
          </button>
        </div>
      </Section>

      {/* About */}
      <Section title="About">
        <div className="bg-card rounded-card p-grid-2 card-shadow space-y-grid-2">
          <div className="flex justify-between text-sm min-h-[40px] items-center">
            <span className="text-foreground">Version</span>
            <span className="text-muted-foreground">1.0.0</span>
          </div>
          <a
            href="mailto:feedback@breathly.app"
            className="block text-sm text-primary py-grid min-h-[48px] flex items-center"
          >
            Send feedback
          </a>
        </div>
      </Section>

      {/* Crisis resources */}
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

const ToggleRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between min-h-[48px]">
    <span className="text-sm text-foreground">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-border'}`}
      aria-label={`Toggle ${label}`}
    >
      <div className={`w-5 h-5 bg-card rounded-full absolute top-1 transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default Settings;
