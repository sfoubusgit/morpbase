import './LexiconPage.css';

type Entry = {
  term: string;
  body: string;
};

type Section = {
  title: string;
  entries: Entry[];
};

const SECTIONS: Section[] = [
  {
    title: 'The Workspace',
    entries: [
      {
        term: 'Workspace',
        body: 'The main creative surface. Everything you build lives here — your starting points, your identity lanes, and the assembled prompt that results from combining them.',
      },
      {
        term: 'Starting Points',
        body: 'Clickable phrase fragments in the center column. Click one to activate it — it becomes part of your assembled prompt. Click it again to deactivate. You can have as many active at once as you want.',
      },
      {
        term: 'Assembled Prompt',
        body: 'The prompt that builds itself from your active starting points and identity lanes. It updates live as you make selections. Copy it directly into your image generation tool.',
      },
      {
        term: 'Negative Prompt',
        body: 'A separate output that lists what the model should avoid. Populated by activating a Negative preset from the identity panel. Copy it into the negative prompt field of your generation tool.',
      },
      {
        term: 'Capture',
        body: 'Saves a snapshot of the current assembled prompt into a temporary batch. Capture several variations in a session, then save the whole batch as a named set. Each capture is independent — changing lanes afterwards does not affect what you already captured.',
      },
      {
        term: 'Combo',
        body: 'A single (Universe × Style) pair, treated as one validated unit. Combos let you remember what worked, what failed, and what you have not tried yet — without re-typing the underlying material. Marked from the workspace via the ★ Mark Combo button or browsed from the ▦ Combos matrix.',
      },
      {
        term: 'Combo Matrix',
        body: 'The grid view of every Universe × Style pair. Rows are universes, columns are styles. Each cell shows a status glyph: · untried, ○ sampled, ✓ won, ✗ failed. Click any cell to set a status, add a note about what happened, or activate that universe + style live in the workspace.',
      },
      {
        term: 'Mark Combo',
        body: 'A workspace toolbar action that opens the Combo Matrix pre-focused on whatever Universe + Style you currently have active. Use it after you have just confirmed a render works (or does not) — annotate in one click, no navigation required.',
      },
    ],
  },
  {
    title: 'Identity Lanes',
    entries: [
      {
        term: 'Identity Lane',
        body: 'A named slot in the right panel that contributes a specific type of phrase to your assembled prompt. Activating a lane injects its phrases into the prompt. Each lane covers a different dimension of the image.',
      },
      {
        term: 'Character',
        body: 'A named person or figure with defined visual traits — appearance, expression, presence. Activating a character anchors the prompt around a consistent identity.',
      },
      {
        term: 'Dynamics',
        body: 'An interaction phrase between two or more active characters. Only available when two or more characters are selected. Describes how they relate or what they are doing together. Can be rolled randomly or browsed.',
      },
      {
        term: 'Environment',
        body: 'A defined location or setting — interior, exterior, natural, urban. Sets the spatial context the character or subject exists within.',
      },
      {
        term: 'Wardrobe',
        body: 'An outfit or clothing definition. Controls what the character is wearing without needing to repeat those details in every prompt.',
      },
      {
        term: 'Style',
        body: 'The visual aesthetic or artistic language of the image — photographic, painterly, cinematic, illustrative. Frames how everything else is rendered.',
      },
      {
        term: 'Lighting',
        body: 'The light quality, direction, and source in the scene. Lighting has a stronger effect on mood than most other elements.',
      },
      {
        term: 'Composition',
        body: 'The framing, angle, and spatial arrangement of the image — close-up, wide shot, overhead, rule of thirds. Controls how the viewer sees the subject.',
      },
      {
        term: 'Mood',
        body: 'The emotional tone or atmosphere of the image. Adds a layer of feeling that sits across everything else in the prompt.',
      },
      {
        term: 'Objects',
        body: 'Specific props or items to include in the scene. Unlike other lanes, Objects is additive — you can select multiple items at once and they all contribute to the prompt.',
      },
      {
        term: 'Negative',
        body: 'A reusable preset of exclusion phrases. One negative preset can be active at a time. Its phrases populate the negative prompt output.',
      },
      {
        term: 'Aura',
        body: 'A named phrase collection that reshapes the Starting Points field. When an Aura is active, its phrases replace the default inspiration pool. Changing auras clears your active starting points.',
      },
    ],
  },
  {
    title: 'Configuration',
    entries: [
      {
        term: 'Lane Sets',
        body: 'Named snapshots of your current lane configuration. Save a combination of character, environment, wardrobe, style, and other active lanes as a set, then restore it in one click. Useful for switching between recurring setups.',
      },
      {
        term: 'Universes',
        body: 'Creative worlds that scope the entire workspace to a curated pool of items per lane. When a Universe is active, every picker and the randomizer only draws from the items you assigned to that universe. Deactivating returns the workspace to the full library.',
      },
      {
        term: 'Randomize',
        body: 'Fills all unlocked identity lanes with random items drawn from your library — or from the active Universe\'s pools if one is active. Locked lanes are left untouched.',
      },
      {
        term: 'Lock',
        body: 'Click any identity lane to lock it. Locked lanes are skipped by the randomizer, so their content is preserved across rolls. Click again to unlock. Locked lanes glow to indicate their state.',
      },
    ],
  },
  {
    title: 'Identity Systems',
    entries: [
      {
        term: 'Identity Systems',
        body: 'The framework for building and managing the identities that power the identity lanes. Characters, environments, outfits, styles, lighting setups, compositions, and moods are all managed here.',
      },
      {
        term: 'Character Identity',
        body: 'A complete, named definition of a character — their appearance, traits, and visual language. Built once, reused across any number of prompts without repetition.',
      },
    ],
  },
  {
    title: 'Your Content',
    entries: [
      {
        term: 'Worlds',
        body: 'Named phrase collections you build yourself. Each world is a list of text phrases. Activating a world as an Aura in the workspace reshapes the starting points field with those phrases.',
      },
      {
        term: 'Prompt Library',
        body: 'A personal archive of prompts you have saved. Prompts can be named, tagged, and retrieved. Save any assembled prompt to memory directly from the workspace.',
      },
    ],
  },
  {
    title: 'Community',
    entries: [
      {
        term: 'Pool Hub',
        body: 'A shared library of phrase collections made by MorpBase and the community. Browse, preview, and bring pools into your own Worlds. Requires a Pro account to add or rate.',
      },
    ],
  },
];

export function LexiconPage() {
  return (
    <div className="lexicon-page">
      <div className="lexicon-inner">
        <div className="lexicon-header">
          <h1 className="lexicon-title">Lexicon</h1>
          <p className="lexicon-subtitle">
            Every concept in MorpBase, defined plainly.
          </p>
        </div>
        <div className="lexicon-sections">
          {SECTIONS.map(section => (
            <section key={section.title} className="lexicon-section">
              <h2 className="lexicon-section-title">{section.title}</h2>
              <div className="lexicon-entries">
                {section.entries.map(entry => (
                  <div key={entry.term} className="lexicon-entry">
                    <dt className="lexicon-term">{entry.term}</dt>
                    <dd className="lexicon-body">{entry.body}</dd>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
