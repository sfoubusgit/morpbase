/**
 * Static legal / info pages reached from the footer. Rendered inside the v3
 * shell (no router needed). The legal copy is a sensible starting template
 * tailored to MorpBase — NOT legal advice; have it reviewed before relying on it.
 */
export type LegalKey = 'terms' | 'privacy' | 'content' | 'contact';

const SUPPORT = 'support@morpbase.com';
const LEGAL = 'legal@morpbase.com';

type Section = { h: string; p?: string[]; ul?: string[] };
type Doc = { title: string; updated?: string; draft?: boolean; intro?: string; sections: Section[] };

const DOCS: Record<LegalKey, Doc> = {
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: July 2026',
    draft: true,
    intro: 'These terms govern your use of MorpBase — a tool for building reusable characters and scene prompts and generating images from them.',
    sections: [
      { h: '1. Acceptance', p: ['By creating an account or using MorpBase, you agree to these Terms and to the Content Policy and Privacy Policy, which are part of them. If you do not agree, do not use the service.'] },
      { h: '2. Eligibility & age', p: ['MorpBase is intended for users 16 and over. Public content is safe-for-work only. Any future age-gated adult section will require separate 18+ verification and is not part of the general service.'] },
      { h: '3. Your account', p: ['You are responsible for activity on your account and for keeping your login secure. Provide accurate information and don’t impersonate others.'] },
      { h: '4. Your content & license', p: ['You keep ownership of the characters, objects, prompts, and images you create. By publishing content publicly on MorpBase, you grant us a non-exclusive, worldwide license to host, store, display, and distribute it within the service so it can be browsed, favorited, and reused as intended.', 'You are responsible for having the rights to anything you upload (including cover images), and for ensuring it complies with the Content Policy.'] },
      { h: '5. Generated images', p: ['Images are produced by an AI model from the prompts you assemble. They are provided “as is.” You are responsible for how you use outputs. AI outputs can resemble existing works, styles, or people — do not use them for unlawful, infringing, deceptive, or harmful purposes.'] },
      { h: '6. Acceptable use', p: ['You agree not to misuse the service — including uploading illegal or infringing content, harassing others, scraping at scale, or interfering with the platform’s operation. Prohibited content is described in the Content Policy.'] },
      { h: '7. Payments', p: ['Core features are currently free. If paid features are introduced, the applicable pricing, billing, and refund terms will be presented to you before purchase.'] },
      { h: '8. Suspension & termination', p: ['We may remove content or suspend accounts that violate these Terms or the Content Policy. You may stop using the service and delete your content or account at any time.'] },
      { h: '9. Disclaimers & liability', p: ['The service is provided “as is,” without warranties of any kind. To the extent permitted by law, MorpBase is not liable for indirect or consequential damages arising from your use of the service or of generated content.'] },
      { h: '10. Changes', p: ['We may update these Terms; material changes will be reflected by the “last updated” date. Continued use after changes means you accept them.'] },
      { h: '11. Contact', p: [`Questions about these Terms: ${LEGAL}.`] },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: July 2026',
    draft: true,
    intro: 'This explains what MorpBase collects, why, and the choices you have.',
    sections: [
      { h: 'What we collect', ul: [
        'Account data — your email and display name.',
        'Content you create — characters, lane objects, prompts, scenes, comments, ratings, and any cover or generated images you save.',
        'Basic usage & log data needed to run and secure the service.',
        'Cookies / local storage used to keep you signed in and remember your workspace.',
      ] },
      { h: 'How we use it', ul: [
        'To provide the service: authenticate you, store and display your creations, and let others browse and reuse public content.',
        'To operate, secure, and improve the product.',
        'To communicate with you about your account or important changes.',
      ] },
      { h: 'Service providers', p: ['We rely on trusted processors to run MorpBase:'], ul: [
        'Supabase — authentication, database, and image storage.',
        'Hosting/CDN — to serve the application.',
        'AI providers — when you synthesize a prompt, the scene text is sent to a language-model provider to compose it; prompts are sent to an image-generation service to render images.',
      ] },
      { h: 'Public content', p: ['Content you publish (characters, lane objects, your profile name and avatar) is public and visible to other users. Don’t put private information in public content.'] },
      { h: 'Your rights', p: ['You can view, edit, and delete the content you create, and request deletion of your account and associated data by contacting us. Some minimal records may be retained where required for legal or security reasons.'] },
      { h: 'Security & retention', p: ['We use reasonable safeguards to protect your data and retain it only as long as needed to provide the service or meet legal obligations. No system is perfectly secure.'] },
      { h: 'Children', p: ['MorpBase is not directed to children under 16. If you believe a child has provided us data, contact us and we will remove it.'] },
      { h: 'Contact', p: [`Privacy questions or deletion requests: ${LEGAL}.`] },
    ],
  },
  content: {
    title: 'Content Policy',
    updated: 'Last updated: July 2026',
    intro: 'MorpBase is a shared, safe-for-work creative space. This policy sets what’s allowed on public surfaces and what is never allowed anywhere.',
    sections: [
      { h: 'Safe-for-work by default', p: ['All public, ungated content — characters, lane objects, covers, comments, profiles — must be safe for work. Sexually explicit or adult content is not permitted on public surfaces. A future age-gated 18+ section, if launched, would be separate and require verification.'] },
      { h: 'Never allowed, anywhere', ul: [
        'Any sexual content involving minors, or that sexualizes minors — zero tolerance; such content is removed and reported to the authorities.',
        'Non-consensual, intimate, or sexual depictions of real, identifiable people.',
        'Content that promotes violence, terrorism, self-harm, or illegal acts.',
        'Hateful content that attacks people based on protected characteristics.',
        'Personal or private information about others (doxxing).',
      ] },
      { h: 'Real people & likeness', p: ['Do not create deceptive, defamatory, or harmful depictions of real people, and do not impersonate others. Public figures may be referenced within the law, but not in misleading or harmful ways.'] },
      { h: 'Intellectual property', p: ['Don’t upload or generate content that infringes someone else’s copyright or trademark. Only upload cover images you have the right to use.'] },
      { h: 'Moderation & enforcement', p: ['We may remove content and suspend or terminate accounts that violate this policy, using a mix of automated detection and human review. Our SFW filter may hide flagged content from public view.'] },
      { h: 'Reporting & copyright', p: [`To report content that breaks this policy, use the report option where available or email ${SUPPORT}. Copyright owners can request a takedown by emailing ${LEGAL} with the work, the infringing URL, and a good-faith statement.`] },
    ],
  },
  contact: {
    title: 'Contact',
    intro: 'We’d love to hear from you — here’s how to reach MorpBase.',
    sections: [
      { h: 'Support & general', p: [`Questions, bugs, or feedback: ${SUPPORT}. We read everything, though we can’t always reply to each message individually.`] },
      { h: 'Legal, privacy & copyright', p: [`Terms, privacy requests, and copyright takedowns: ${LEGAL}.`] },
      { h: 'Community', p: ['Our Discord and X are coming soon — links will appear in the footer once they’re live.'] },
      { h: 'Reporting content', p: [`Something that breaks the Content Policy? Use the report option where available, or email ${SUPPORT} with a link.`] },
    ],
  },
};

const mailtoify = (text: string) =>
  text.split(/(\S+@\S+\.\S+)/g).map((part, i) =>
    /\S+@\S+\.\S+/.test(part)
      ? <a key={i} href={`mailto:${part}`}>{part}</a>
      : <span key={i}>{part}</span>);

export function V3LegalPage({ page, onBack }: { page: LegalKey; onBack: () => void }) {
  const doc = DOCS[page];
  return (
    <div className="v3-legal">
      <button type="button" className="v3-chan-back" onClick={onBack}>← Back to MorpBase</button>
      <h1>{doc.title}</h1>
      {doc.updated && <div className="v3-legal-meta">{doc.updated}</div>}
      {doc.draft && (
        <div className="v3-legal-note">This is a starting template tailored to MorpBase — it is not legal advice. Have it reviewed before relying on it.</div>
      )}
      {doc.intro && <p className="v3-legal-intro">{doc.intro}</p>}
      {doc.sections.map((s, i) => (
        <section key={i} className="v3-legal-sec">
          <h3>{s.h}</h3>
          {s.p?.map((para, j) => <p key={j}>{mailtoify(para)}</p>)}
          {s.ul && <ul>{s.ul.map((li, j) => <li key={j}>{mailtoify(li)}</li>)}</ul>}
        </section>
      ))}
    </div>
  );
}
