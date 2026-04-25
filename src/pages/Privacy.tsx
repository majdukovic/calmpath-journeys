import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[600px] mx-auto px-grid-2 py-grid-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-grid text-primary mb-grid-3 min-h-[48px]"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-2xl font-semibold text-foreground mb-grid-3">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mb-grid-3">Last updated: April 25, 2026</p>

        <div className="space-y-grid-3 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">1. What We Collect</h2>
            <p>Breeze stores your journal entries, gratitude entries, mood logs, thought records, urge entries, SOS/crisis session notes, meditation history, breathing session history, self-care task completion, streak data, onboarding goals, and app preferences (theme, language, reminder time, voice style). If you add an emergency contact, we store the name and phone number you provide. If you sign in, we also store your email address (from Google sign-in or the magic-link you request). A per-device identifier is generated locally to coordinate multi-device sync.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">2. How We Store Your Data</h2>
            <p>Your data is stored locally on your device. When you sign in, your data is also synced to our cloud backend (hosted on Supabase) so you can restore it on another device. All data in transit is encrypted using industry-standard TLS. Sync happens automatically on sign-in and when the app opens; signing out stops further sync from that device.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">3. What We Don't Do</h2>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>We do not sell your personal data to third parties</li>
              <li>We do not use your journal entries, mood data, or crisis notes for advertising</li>
              <li>We do not share your data with data brokers</li>
              <li>We do not track you across other apps or websites</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">4. Third-Party Services</h2>
            <p>Breeze uses a small number of third-party providers to run the service. Your data is handled according to each provider's own privacy policy.</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Supabase</strong> — authentication (Google sign-in or magic-link email) and encrypted cloud storage of your synced data. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Supabase Privacy</a>.</li>
              <li><strong>Apple App Store / Google Play</strong> — payment processing for mobile subscriptions. We never see your payment details.</li>
              <li><strong>Stripe</strong> — payment processing for web subscriptions. Stripe handles card details directly; we never see or store them. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe Privacy</a>.</li>
              <li><strong>RevenueCat</strong> — tracks your subscription status across devices. Receives purchase tokens and entitlement state from the stores. See <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">RevenueCat Privacy</a>.</li>
              <li><strong>PostHog</strong> — product analytics. We send pseudonymized event data (e.g. "a meditation was started," paywall interactions, feature usage) so we can improve the app. We do not send journal text, mood notes, or any free-text you write. See <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">PostHog Privacy</a>.</li>
              <li><strong>Cloudflare R2</strong> — content delivery network that hosts the meditation and ambient audio files streamed to the app.</li>
              <li><strong>Tawk.to</strong> — optional live chat available to Breeze Pro users. If you open a chat, Tawk.to receives the messages you send. See <a href="https://www.tawk.to/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Tawk.to Privacy</a>.</li>
            </ul>
            <p className="mt-2">If this list changes, we will update this policy.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">5. Data Deletion</h2>
            <p>You can delete your data at any time from Settings → Delete all my data. This permanently deletes your local data and, if you're signed in, also deletes your cloud data and authentication account. This action cannot be undone.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">6. Children's Privacy</h2>
            <p>Breeze is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">7. Contact</h2>
            <p>For privacy questions or data requests, contact us at <a href="mailto:breezeapphelp@gmail.com" className="text-primary underline">breezeapphelp@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
