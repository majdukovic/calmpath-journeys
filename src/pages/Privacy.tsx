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
        <p className="text-xs text-muted-foreground mb-grid-3">Last updated: March 8, 2026</p>

        <div className="space-y-grid-3 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">1. What We Collect</h2>
            <p>Breeze stores your journal entries, mood logs, gratitude entries, breathing session history, and app preferences. When you sign in, we also store your email address for authentication purposes.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">2. How We Store Your Data</h2>
            <p>Your data is stored locally on your device by default. If you sign in with an account, your data may be synced to our secure cloud infrastructure. All data in transit is encrypted using industry-standard TLS encryption.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">3. What We Don't Do</h2>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>We do not sell your personal data to third parties</li>
              <li>We do not use your journal entries or mood data for advertising</li>
              <li>We do not share your data with data brokers</li>
              <li>We do not track you across other apps or websites</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">4. AI Features</h2>
            <p>If you use Breeze Plus AI insights, your mood and gratitude data may be sent to an AI model to generate personalized insights. This data is not stored by the AI provider and is used solely to generate your insights in real time.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">5. Third-Party Services</h2>
            <p>We use Stripe for payment processing. Stripe handles your payment information directly — we never see or store your credit card details. Please review <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe's Privacy Policy</a> for details.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">6. Data Deletion</h2>
            <p>You can delete all your data at any time from Settings → Delete all my data. This action is permanent and cannot be undone. You can also export your data as CSV before deleting.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">7. Contact</h2>
            <p>For privacy questions or data requests, contact us at <a href="mailto:hello@breezeapp.co" className="text-primary underline">hello@breezeapp.co</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
