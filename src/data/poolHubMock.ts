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
    heroImageUrl: null,
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
];
