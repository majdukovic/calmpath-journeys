import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
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

        <h1 className="text-2xl font-semibold text-foreground mb-grid-3">Terms of Service</h1>
        <p className="text-xs text-muted-foreground mb-grid-3">Last updated: March 8, 2026</p>

        <div className="space-y-grid-3 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">1. Acceptance of Terms</h2>
            <p>By using Breeze ("the App"), you agree to these Terms of Service. If you do not agree, please do not use the App.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">2. Description of Service</h2>
            <p>Breeze is a wellness and self-care application that provides breathing exercises, journaling tools, mood tracking, and educational content about anxiety and mental well-being.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">3. Not Medical Advice</h2>
            <p>
              <strong>Breeze is not a medical device and does not provide medical advice, diagnosis, or treatment.</strong> The content, exercises, and features in this app are for educational and informational purposes only. They are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical or mental health condition. Never disregard professional medical advice or delay seeking it because of something you read or experienced in this app.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">4. Subscriptions & Payments</h2>
            <p>Breeze offers optional premium features ("Breeze Plus") available through paid subscriptions. Subscriptions automatically renew unless cancelled before the end of the current billing period. You can manage or cancel your subscription at any time through your account settings.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">5. User Content</h2>
            <p>Any journal entries, mood logs, or other personal data you create within the App remains yours. We do not sell, share, or use your personal content for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">6. Limitation of Liability</h2>
            <p>Breeze and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App. The App is provided "as is" without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">7. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the App after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">8. Contact</h2>
            <p>If you have questions about these Terms, please contact us at <a href="mailto:hello@breezeapp.co" className="text-primary underline">hello@breezeapp.co</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
