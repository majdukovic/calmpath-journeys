import { useRef } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketingStrategy = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #strategy-content, #strategy-content * { visibility: visible; }
          #strategy-content { position: absolute; left: 0; top: 0; width: 100%; padding: 24px; font-size: 11px; }
          #strategy-content h1 { font-size: 22px; }
          #strategy-content h2 { font-size: 16px; }
          #strategy-content h3 { font-size: 13px; }
          #strategy-content table { font-size: 10px; }
          .no-print { display: none !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      <div className="min-h-screen bg-background">
        {/* Header - hidden in print */}
        <div className="no-print sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>

        {/* Content */}
        <div id="strategy-content" ref={contentRef} className="max-w-3xl mx-auto px-4 py-8 text-foreground">
          <h1 className="text-3xl font-bold mb-1">Breeze — 360° Marketing Strategy</h1>
          <p className="text-muted-foreground mb-8 text-sm">Prepared March 2026 · Confidential</p>

          {/* ---- Section 1 ---- */}
          <Section title="1. Positioning & Core Message">
            <p><strong>Tagline:</strong> "The anxiety app that doesn't add to your anxiety."</p>
            <p><strong>Positioning:</strong> Breeze is a <em>painkiller</em>, not a vitamin. It delivers instant anxiety relief in 3 minutes — no 30-day courses, no guilt trips, no upsells mid-panic-attack.</p>
            <p><strong>Target audience:</strong> 18-35 year olds experiencing anxiety, panic attacks, or sleep difficulty. Digitally native, meme-literate, skeptical of "wellness" brands.</p>
          </Section>

          {/* ---- Section 2 ---- */}
          <Section title="2. Competitor Analysis">
            <h3 className="text-lg font-semibold mt-4 mb-2">🌱 Rootd — The Solo Founder Blueprint</h3>
            <p className="mb-2">Ania Wysocka, solo founder, no coding experience, bootstrapped to <strong>4M+ downloads</strong> and <strong>$83K/month</strong> with zero employees.</p>
            <Table headers={['Strategy', 'Details', 'Result']} rows={[
              ['App Store Optimization', 'Keywords: "panic attack", "anxiety relief". High-intent searches by people in crisis.', 'Primary growth driver — most downloads from organic App Store search'],
              ['Apple Features', 'Featured 100+ times. Apple promotes well-designed wellness apps.', 'Massive download spikes with each feature'],
              ['Personal Story', 'Shared panic attack story on Indie Hackers, podcasts, Reddit.', 'Built trust & press coverage organically'],
              ['Revenue Tweak', 'One paywall change increased revenue 5x.', 'Positioning > features'],
            ]} />

            <h3 className="text-lg font-semibold mt-6 mb-2">🧘 Calm — The Content Marketing Machine ($2B)</h3>
            <p className="mb-2">Grew to <strong>7M downloads before spending a dollar on marketing</strong>. 100M+ downloads, 4M paying users.</p>
            <Table headers={['Strategy', 'Details', 'Result']} rows={[
              ['"Painkiller" Pivot', 'Pivoted from meditation to sleep. "8 billion people sleep every night."', 'Sleep Stories became killer feature'],
              ['YouTube SEO Empire', '8-12 hour videos: rain sounds, ocean waves, calming music.', '133M+ views. Videos rank forever.'],
              ['Celebrity Sleep Stories', 'Matthew McConaughey, Harry Styles, LeBron James.', 'Massive PR + social buzz'],
              ['Product First', '"Marketing is gasoline on a fire that\'s already burning."', '7M organic downloads proved PMF'],
            ]} />

            <h3 className="text-lg font-semibold mt-6 mb-2">🧠 Headspace — The Brand-First Playbook ($3B)</h3>
            <p className="mb-2">Andy Puddicombe (former monk) + Rich Pierson. 3.3M subscribers.</p>
            <Table headers={['Strategy', 'Details', 'Result']} rows={[
              ['Founder as Brand', 'Andy = meditation authority. TED talk: 13M+ views.', 'Instant credibility'],
              ['Illustration-First Design', 'Distinctive cartoon style made meditation approachable.', 'Instantly recognizable brand'],
              ['Netflix Series', '"Headspace Guide to Meditation" — each episode a mini-course.', 'Millions of impressions, Netflix paid for it'],
              ['B2B Partnerships', 'Delta Airlines, healthcare providers, corporations.', 'Distribution through captive audiences'],
            ]} />
          </Section>

          {/* ---- Section 3 ---- */}
          <Section title="3. Growth Channels (Ranked by Solo-Founder Impact)">
            <h3 className="text-lg font-semibold mt-4 mb-2">🔥 Tier 1: Highest Impact, Lowest Effort</h3>
            <Table headers={['Channel', 'Why', 'Action', 'Frequency']} rows={[
              ['App Store Optimization', 'Rootd\'s #1 growth driver. High-intent users.', 'Optimize keywords: "anxiety relief", "panic attack app", "breathing exercises"', 'Once + monthly tweaks'],
              ['TikTok / Reels', 'Highest organic reach in 2026. Anxiety content goes viral.', 'POV memes, "breathe with me" videos, fox mascot animations', '3-4 videos/week'],
              ['Reddit', 'r/Anxiety (900K+), r/selfimprovement. Trust-based.', 'Share founder story, help people, mention app naturally.', '2-3 posts/week'],
            ]} />

            <h3 className="text-lg font-semibold mt-6 mb-2">🌊 Tier 2: Medium Effort, High Credibility</h3>
            <Table headers={['Channel', 'Why', 'Action', 'Frequency']} rows={[
              ['Build in Public (X/Twitter)', 'Dev community + early adopters. Compounds over time.', 'Daily updates: revenue, user feedback, dev decisions.', 'Daily tweets, weekly threads'],
              ['ProductHunt Launch', 'One-time burst + credibility badge. "Featured on PH."', 'Prep 2 weeks ahead. Launch on Tuesday. Rally community.', 'Once (plan for Month 1)'],
              ['YouTube Long-Form', 'Calm\'s secret weapon. Videos rank forever.', '"3-hour calming breathing" / "rain sounds for anxiety"', '2 videos/month'],
            ]} />

            <h3 className="text-lg font-semibold mt-6 mb-2">🌱 Tier 3: Long-Term, High Value</h3>
            <Table headers={['Channel', 'Why', 'Action', 'Frequency']} rows={[
              ['Indie Hackers', 'Solo founder community. Revenue transparency.', 'Post monthly updates with real numbers.', 'Monthly'],
              ['Therapist Partnerships', 'Headspace model. Therapists recommend to clients.', 'Create "clinician info" page. Reach out to therapists.', 'Month 3+'],
              ['SEO / Blog', 'Headspace owns "how to meditate" searches.', 'Own "how to stop a panic attack", "breathing for anxiety"', 'Ongoing'],
            ]} />
          </Section>

          {/* ---- Section 4 ---- */}
          <Section title="4. Content Strategy">
            <h3 className="text-lg font-semibold mt-4 mb-2">TikTok Content Pillars</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li><strong>Anxiety Memes (40%)</strong> — "POV: your brain at 3am", "me explaining to my therapist why I googled symptoms again." Relatable → shareable → awareness.</li>
              <li><strong>Breathe With Me (30%)</strong> — 60-second guided breathing with the fox mascot. Calm-inspired but short-form native.</li>
              <li><strong>Build in Public (20%)</strong> — "Day X of building an anxiety app as someone with anxiety." Meta, authentic, developer audience.</li>
              <li><strong>User Stories (10%)</strong> — Testimonials, community wins, "this app helped me" moments.</li>
            </ol>

            <h3 className="text-lg font-semibold mt-6 mb-2">Reddit Playbook</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Never post "check out my app." Instead: "I struggled with anxiety and built something that helps me. Happy to share if anyone's interested."</li>
              <li>Answer questions in r/Anxiety genuinely. Add value first.</li>
              <li>Share your founder journey in r/SideProject, r/IndieHackers, r/startups.</li>
              <li>Post breathing techniques (with source) that happen to be in your app.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-2">X/Twitter Build in Public Formula</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Monday:</strong> Weekly update thread (downloads, revenue, learnings)</li>
              <li><strong>Tuesday-Thursday:</strong> Micro-updates (shipped feature, user feedback, design decision)</li>
              <li><strong>Friday:</strong> Reflection or meme ("Things I learned this week building solo")</li>
            </ul>
          </Section>

          {/* ---- Section 5 ---- */}
          <Section title="5. ProductHunt Launch Plan">
            <Table headers={['Timeline', 'Action']} rows={[
              ['2 weeks before', 'Create "Coming Soon" page. Share in Build in Public circles. Ask friends to follow.'],
              ['1 week before', 'Prepare: tagline, description, 5 screenshots, maker comment, first comment.'],
              ['Launch day (Tuesday)', 'Post at 12:01 AM PT. Share on X, Reddit, Discord. Respond to every comment.'],
              ['Day after', 'Thank everyone. Share results. "We hit #X on Product Hunt" thread.'],
              ['1 week after', 'Write retrospective blog post. Share learnings.'],
            ]} />
            <p className="mt-3 text-sm"><strong>Tagline options:</strong></p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>"The anxiety app that doesn't add to your anxiety"</li>
              <li>"3 minutes to calm. No courses, no guilt, no BS."</li>
              <li>"Built by someone with anxiety, for people with anxiety"</li>
            </ul>
          </Section>

          {/* ---- Section 6 ---- */}
          <Section title="6. Unfair Advantages">
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Authentic founder story</strong> — Rootd proved this is the most powerful asset for anxiety apps. Big companies can't fake it.</li>
              <li><strong>The fox mascot</strong> — Headspace proved illustration branding wins. The fox is more lovable than their blob characters.</li>
              <li><strong>Free core, paid community</strong> — Competitors gate content. Breeze gates community (higher perceived value, lower churn).</li>
              <li><strong>AI-native</strong> — AI moderation & insights from day one. Competitors are retrofitting.</li>
              <li><strong>Speed</strong> — Ship weekly while Calm takes quarters. Public roadmap proves this.</li>
            </ul>
          </Section>

          {/* ---- Section 7 ---- */}
          <Section title="7. Week 1 Action Items">
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li><strong>Optimize App Store listing</strong> — Keywords: "anxiety relief", "panic attack app", "breathing exercises for anxiety", "calm anxiety".</li>
              <li><strong>Record first TikTok</strong> — "POV: your brain won't shut up at 2am" → 60 seconds of Breeze breathing animation.</li>
              <li><strong>Write founder story on Reddit</strong> — Post in r/Anxiety: "I struggled with anxiety so I built an app. Here's what I learned."</li>
              <li><strong>Start X/Twitter thread</strong> — "I'm a solo dev building an anxiety app. Day 1. 🧵" with app screenshot.</li>
              <li><strong>Set ProductHunt launch date</strong> — Pick a Tuesday 3-4 weeks out. Create "Coming Soon" page.</li>
            </ol>
          </Section>

          {/* ---- Section 8 ---- */}
          <Section title="8. KPIs & Milestones">
            <Table headers={['Metric', 'Month 1 Target', 'Month 3 Target', 'Month 6 Target']} rows={[
              ['App Downloads', '500', '5,000', '25,000'],
              ['TikTok Followers', '500', '5,000', '20,000'],
              ['Daily Active Users', '50', '500', '2,500'],
              ['Paid Subscribers', '10', '100', '500'],
              ['Reddit Karma (niche)', '500', '2,000', '5,000'],
              ['X/Twitter Followers', '200', '1,000', '5,000'],
            ]} />
          </Section>

          <p className="text-xs text-muted-foreground mt-12 text-center">
            © 2026 Breeze App · This document is confidential and intended for internal use only.
          </p>
        </div>
      </div>
    </>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold mb-3 pb-1 border-b border-border">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed">{children}</div>
  </section>
);

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr>{headers.map((h, i) => <th key={i} className="text-left p-2 bg-muted/50 border border-border font-semibold text-xs">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j} className="p-2 border border-border text-xs">{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MarketingStrategy;
