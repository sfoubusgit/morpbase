import type { PoolHubEntry } from '../types';

const now = Date.parse('2026-03-16T12:00:00Z');
const day = 24 * 60 * 60 * 1000;

const buildPool = (
  id: string,
  name: string,
  createdAt: number,
  updatedAt: number,
  items: Array<{ text: string; section: string; tags?: string[]; note?: string }>
) => ({
  id,
  name,
  createdAt,
  updatedAt,
  items: items.map((item, index) => ({
    id: `${id}_item_${index + 1}`,
    text: item.text,
    section: item.section,
    tags: item.tags,
    note: item.note,
  })),
});

export const poolHubMock: PoolHubEntry[] = [
  {
    id: 'hub_creatine_cyberspace_gym',
    creator: 'MorpBase',
    title: 'Creatine Cyberspace Gym',
    summary: 'Chrome muscle culture, neon training chambers, and hyper-stylized cyber-athletic energy.',
    description:
      'An official MorpBase pool for cybernetic bodybuilding scenes, futuristic gym environments, glowing supplements, brutal lighting, and techno-performance atmosphere. Built for prompts that blend gym obsession, digital excess, and cinematic sci-fi intensity.',
    tags: ['cyberpunk', 'gym', 'bodybuilding', 'neon', 'futuristic', 'performance'],
    category: 'Illustration',
    languages: ['en'],
    license: 'CC-BY',
    heroImageUrl: '/cyber_creatine_gym.png',
    ratingAvg: 0,
    ratingCount: 0,
    downloads: 0,
    createdAt: now - day,
    updatedAt: now,
    payload: buildPool(
      'creatine_cyberspace_gym_pool',
      'Creatine Cyberspace Gym',
      now - day,
      now,
      [
        { text: 'cybernetic bodybuilder with chrome-veined musculature', section: 'Subjects', tags: ['subject', 'bodybuilder', 'cybernetic'] },
        { text: 'augmented athlete with glowing implants and vascular definition', section: 'Subjects', tags: ['subject', 'athlete', 'implants'] },
        { text: 'futuristic powerlifter in a high-tech posing stance', section: 'Subjects', tags: ['subject', 'powerlifting', 'pose'] },

        { text: 'neon-lit cyberspace gym with reflective black floors', section: 'Environment', tags: ['environment', 'gym', 'neon'] },
        { text: 'brutalist training chamber with holographic mirrors', section: 'Environment', tags: ['environment', 'interior', 'holographic'] },
        { text: 'industrial fitness lab with vapor haze and LED strips', section: 'Environment', tags: ['environment', 'industrial', 'lab'] },

        { text: 'transparent creatine canister glowing electric blue', section: 'Props', tags: ['props', 'supplement', 'glow'] },
        { text: 'smart dumbbells with illuminated weight markers', section: 'Props', tags: ['props', 'weights', 'tech'] },
        { text: 'holographic rep counter and biometric interface', section: 'Props', tags: ['props', 'ui', 'biometric'] },

        { text: 'hard rim lighting with magenta and cyan contrast', section: 'Lighting', tags: ['lighting', 'rim', 'contrast'] },
        { text: 'overhead strip lights cutting sharp highlights across muscle definition', section: 'Lighting', tags: ['lighting', 'highlights', 'muscle'] },
        { text: 'glowing underlight from floor panels and supplement tanks', section: 'Lighting', tags: ['lighting', 'underlight', 'glow'] },

        { text: 'obsessive performance-driven intensity', section: 'Mood', tags: ['mood', 'intense', 'performance'] },
        { text: 'sleek techno-dystopian discipline', section: 'Mood', tags: ['mood', 'dystopian', 'discipline'] },
        { text: 'adrenalized futuristic gym-culture energy', section: 'Mood', tags: ['mood', 'energy', 'gym'] },

        { text: 'sweat-slick skin with metallic sheen', section: 'Materials', tags: ['materials', 'skin', 'metallic'] },
        { text: 'carbon fiber equipment surfaces with glossy reflections', section: 'Materials', tags: ['materials', 'carbon-fiber', 'reflections'] },
        { text: 'translucent polymer supplement pods and illuminated tubing', section: 'Materials', tags: ['materials', 'polymer', 'tubing'] },

        { text: 'cyberpunk athletic editorial', section: 'Style', tags: ['style', 'cyberpunk', 'editorial'] },
        { text: 'hyper-detailed sci-fi fitness illustration', section: 'Style', tags: ['style', 'sci-fi', 'illustration'] },
        { text: 'luxury techno-gym visual design language', section: 'Style', tags: ['style', 'luxury', 'design'] },

        { text: 'low-angle hero framing emphasizing scale and physique', section: 'Composition', tags: ['composition', 'hero', 'low-angle'] },
        { text: 'three-quarter cinematic pose with layered gym depth', section: 'Composition', tags: ['composition', 'cinematic', 'depth'] },
        { text: 'symmetrical machine-lined framing with central subject focus', section: 'Composition', tags: ['composition', 'symmetry', 'focus'] },

        { text: 'subtle vapor plumes around the training floor', section: 'Effects', tags: ['effects', 'vapor', 'atmosphere'] },
        { text: 'neon bloom reflecting across polished surfaces', section: 'Effects', tags: ['effects', 'bloom', 'reflection'] },
        { text: 'glitching biometric overlays and energy pulse traces', section: 'Effects', tags: ['effects', 'glitch', 'overlay'] },
      ]
    ),
  },
  {
    id: 'hub_volcano_island_wizards',
    creator: 'MorpBase',
    title: 'Volcano Island Wizards',
    summary: 'Arcane sorcerers, black rock temples, and molten island ritual energy.',
    description:
      'An official MorpBase pool for volcanic fantasy worlds filled with fire mages, ash storms, obsidian sanctuaries, lava-lit ceremonies, and high-drama magical confrontation.',
    tags: ['fantasy', 'wizard', 'volcano', 'lava', 'ritual', 'obsidian'],
    category: 'Illustration',
    languages: ['en'],
    license: 'CC-BY',
    heroImageUrl: '/volcano_wizard.png',
    ratingAvg: 0,
    ratingCount: 0,
    downloads: 0,
    createdAt: now - day,
    updatedAt: now,
    payload: buildPool(
      'volcano_island_wizards_pool',
      'Volcano Island Wizards',
      now - day,
      now,
      [
        { text: 'volcanic archmage in layered ceremonial robes', section: 'Subjects', tags: ['subject', 'wizard', 'archmage'] },
        { text: 'fire sorcerer with rune-scorched staff and ember aura', section: 'Subjects', tags: ['subject', 'sorcerer', 'fire'] },
        { text: 'island coven leader with ash-marked face and glowing eyes', section: 'Subjects', tags: ['subject', 'coven', 'ritual'] },

        { text: 'volcano island ringed by black cliffs and lava channels', section: 'Environment', tags: ['environment', 'island', 'volcano'] },
        { text: 'obsidian temple terrace overlooking a molten caldera', section: 'Environment', tags: ['environment', 'temple', 'caldera'] },
        { text: 'ash-covered ritual plaza beneath smoke-choked skies', section: 'Environment', tags: ['environment', 'ash', 'ritual'] },

        { text: 'obsidian staff crowned with molten crystal', section: 'Props', tags: ['props', 'staff', 'crystal'] },
        { text: 'floating rune tablets and sacrificial braziers', section: 'Props', tags: ['props', 'runes', 'braziers'] },
        { text: 'lava-forged spell circle carved into volcanic stone', section: 'Props', tags: ['props', 'spell-circle', 'stone'] },

        { text: 'lava glow casting fierce orange underlight', section: 'Lighting', tags: ['lighting', 'lava', 'underlight'] },
        { text: 'storm-dark sky split by hot volcanic reflections', section: 'Lighting', tags: ['lighting', 'storm', 'reflections'] },
        { text: 'embers and ritual flames flickering across robes and stone', section: 'Lighting', tags: ['lighting', 'embers', 'flame'] },

        { text: 'apocalyptic magical intensity', section: 'Mood', tags: ['mood', 'apocalyptic', 'intense'] },
        { text: 'ancient ritual power on the edge of eruption', section: 'Mood', tags: ['mood', 'ritual', 'eruption'] },
        { text: 'mythic island-sorcery tension', section: 'Mood', tags: ['mood', 'mythic', 'tension'] },

        { text: 'obsidian surfaces with sharp volcanic gloss', section: 'Materials', tags: ['materials', 'obsidian', 'gloss'] },
        { text: 'charred fabric with ember-burnt edges', section: 'Materials', tags: ['materials', 'fabric', 'charred'] },
        { text: 'molten rock fissures glowing through cracked stone', section: 'Materials', tags: ['materials', 'molten', 'stone'] },

        { text: 'epic dark-fantasy illustration', section: 'Style', tags: ['style', 'dark-fantasy', 'illustration'] },
        { text: 'high-detail volcanic magic concept art', section: 'Style', tags: ['style', 'concept-art', 'volcanic'] },
        { text: 'mythic fire-and-obsidian visual language', section: 'Style', tags: ['style', 'mythic', 'obsidian'] },

        { text: 'wide ritual tableau with the wizard at the caldera edge', section: 'Composition', tags: ['composition', 'wide', 'tableau'] },
        { text: 'low-angle hero shot against the volcano plume', section: 'Composition', tags: ['composition', 'hero', 'low-angle'] },
        { text: 'symmetrical temple framing with central spell focus', section: 'Composition', tags: ['composition', 'symmetry', 'focus'] },

        { text: 'embers drifting through heavy ash haze', section: 'Effects', tags: ['effects', 'embers', 'ash'] },
        { text: 'heat distortion shimmering above lava flows', section: 'Effects', tags: ['effects', 'heat', 'distortion'] },
        { text: 'glowing rune particles spiraling around the ritual circle', section: 'Effects', tags: ['effects', 'runes', 'particles'] },
      ]
    ),
  },
  {
    id: 'hub_cathedral_starship_monks',
    creator: 'MorpBase',
    title: 'Cathedral Starship Monks',
    summary: 'Monastic sci-fi processions, sacred engines, and gothic star-vessel ritual atmosphere.',
    description:
      'An official MorpBase pool for solemn space-monastery worlds: hooded cosmic monks, cathedral-like starships, incense-filled reactor halls, sacred machinery, and austere ceremonial grandeur.',
    tags: ['sci-fi', 'gothic', 'monk', 'starship', 'cathedral', 'ritual'],
    category: 'Illustration',
    languages: ['en'],
    license: 'CC-BY',
    heroImageUrl: null,
    ratingAvg: 0,
    ratingCount: 0,
    downloads: 0,
    createdAt: now - day,
    updatedAt: now,
    payload: buildPool(
      'cathedral_starship_monks_pool',
      'Cathedral Starship Monks',
      now - day,
      now,
      [
        { text: 'hooded starship monk with an illuminated reliquary staff', section: 'Subjects', tags: ['subject', 'monk', 'staff'] },
        { text: 'cyber-monastic elder with ritual implants and solemn gaze', section: 'Subjects', tags: ['subject', 'elder', 'cybernetic'] },
        { text: 'processional order of silent space acolytes', section: 'Subjects', tags: ['subject', 'acolytes', 'procession'] },

        { text: 'cathedral-like starship nave with vaulted steel arches', section: 'Environment', tags: ['environment', 'starship', 'nave'] },
        { text: 'sacred reactor chamber glowing beneath gothic buttresses', section: 'Environment', tags: ['environment', 'reactor', 'gothic'] },
        { text: 'orbital monastery cloister open to the starfield', section: 'Environment', tags: ['environment', 'monastery', 'orbital'] },

        { text: 'floating censor emitting silver incense vapor', section: 'Props', tags: ['props', 'incense', 'censor'] },
        { text: 'relic engine core housed in a ceremonial shrine frame', section: 'Props', tags: ['props', 'relic', 'engine'] },
        { text: 'holographic scripture panels and machine-lit prayer seals', section: 'Props', tags: ['props', 'scripture', 'holographic'] },

        { text: 'cold stained-glass light mixed with reactor glow', section: 'Lighting', tags: ['lighting', 'stained-glass', 'reactor'] },
        { text: 'soft shafts of sacred white light through drifting vapor', section: 'Lighting', tags: ['lighting', 'shafts', 'vapor'] },
        { text: 'deep shadowed aisles broken by gold ritual highlights', section: 'Lighting', tags: ['lighting', 'shadow', 'gold'] },

        { text: 'solemn cosmic devotion', section: 'Mood', tags: ['mood', 'solemn', 'devotion'] },
        { text: 'austere sacred technology reverence', section: 'Mood', tags: ['mood', 'technology', 'reverence'] },
        { text: 'quiet interstellar ritual gravity', section: 'Mood', tags: ['mood', 'ritual', 'gravity'] },

        { text: 'brushed metal robes with ceremonial gold thread', section: 'Materials', tags: ['materials', 'metal', 'fabric'] },
        { text: 'aged steel, oxidized brass, and polished relic glass', section: 'Materials', tags: ['materials', 'steel', 'brass'] },
        { text: 'stone-like ship surfaces with sacred engraved filigree', section: 'Materials', tags: ['materials', 'engraving', 'stone-like'] },

        { text: 'gothic sci-fi religious concept art', section: 'Style', tags: ['style', 'gothic', 'concept-art'] },
        { text: 'monastic space opera illustration', section: 'Style', tags: ['style', 'space-opera', 'illustration'] },
        { text: 'sacred machinery visual language', section: 'Style', tags: ['style', 'sacred', 'machinery'] },

        { text: 'symmetrical aisle composition leading to the reactor altar', section: 'Composition', tags: ['composition', 'symmetry', 'altar'] },
        { text: 'low-angle reverent framing beneath massive arches', section: 'Composition', tags: ['composition', 'low-angle', 'arches'] },
        { text: 'processional depth with layered figures and luminous vanishing point', section: 'Composition', tags: ['composition', 'depth', 'procession'] },

        { text: 'incense vapor drifting through the ship sanctuary', section: 'Effects', tags: ['effects', 'vapor', 'incense'] },
        { text: 'subtle dust motes and star-glitter in cathedral light', section: 'Effects', tags: ['effects', 'dust', 'glitter'] },
        { text: 'faint holographic glyphs orbiting sacred machinery', section: 'Effects', tags: ['effects', 'glyphs', 'holographic'] },
      ]
    ),
  },
];
