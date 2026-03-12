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
            <p>Breeze is a wellness and self-care application that provides breathing exercises, journaling tools, mood tracking, community features, and educational content about anxiety and mental well-being.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">3. Not Medical Advice</h2>
            <p>
              <strong>Breeze is not a medical device and does not provide medical advice, diagnosis, or treatment.</strong> The content, exercises, and features in this app are for educational and informational purposes only. They are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical or mental health condition.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">4. Subscriptions & Payments</h2>
            <p>Breeze offers optional premium features ("Breeze Pro") available through paid subscriptions. Subscriptions automatically renew unless cancelled before the end of the current billing period. You can manage or cancel your subscription at any time through your account settings.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">5. User Content</h2>
            <p>Any journal entries, mood logs, or other personal data you create within the App remains yours. We do not sell, share, or use your personal content for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">6. Community Guidelines</h2>
            <p>The Breeze Circle community is a safe, supportive, and anonymous space. By participating, you agree to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Be respectful and supportive of other community members</li>
              <li>Not post content containing self-harm threats, bullying, harassment, or hateful language</li>
              <li>Not share personal identifying information (phone numbers, addresses, full names)</li>
              <li>Not post spam, advertising, or links to external sites</li>
              <li>Not present medical advice as fact</li>
              <li>Not promote dangerous or harmful behaviors</li>
            </ul>
            <p className="mt-2">All posts are reviewed by AI moderation. Posts that violate these guidelines will be rejected. We reserve the right to remove content and suspend accounts that repeatedly violate community guidelines.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">7. Account Deletion</h2>
            <p>You may delete your account and all associated data at any time from Settings. Account deletion is permanent and removes all server-side data including community posts, reactions, and authentication credentials.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">8. Limitation of Liability</h2>
            <p>Breeze and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App. The App is provided "as is" without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">9. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the App after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-grid">10. Contact</h2>
            <p>If you have questions about these Terms, please contact us at <a href="mailto:hello@breezeapp.co" className="text-primary underline">hello@breezeapp.co</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
