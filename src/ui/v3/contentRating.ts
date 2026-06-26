/**
 * v3 content rating — the SFW/NSFW seam.
 *
 * MorpBase is SFW-monetizable: every public, ungated surface shows SFW content
 * only. NSFW content isn't deleted — it's quarantined until a future age-gated
 * "red section" flips SHOW_NSFW (behind 18+ verification). Designing this seam
 * now means the red section is later just a filter flip + an age wall, with no
 * retrofit.
 *
 * Rather than hand-listing which seeds are explicit, we DETECT explicit content
 * from its text, so it catches every seed batch and any user-created content.
 */
export type ContentRating = 'sfw' | 'nsfw';

/** The gate. Flipped on (per-session, post-verification) only inside the red section. */
export const SHOW_NSFW = false;

// Conservative explicit-content detector over an item's own descriptive text.
const NSFW_TERMS = /\b(nude|nudity|naked|topless|bottomless|breasts?|areolas?|nipples?|cleavage|genital\w*|vulva|vagina|penis|erect\w*|cum|cumshot|sex|sexual|intercourse|orgasm|masturbat\w*|fellatio|blowjob|hentai|pornographic|porn|explicit|nsfw|lewd)\b/i;

export function ratingForText(text: string): ContentRating {
  return NSFW_TERMS.test(text) ? 'nsfw' : 'sfw';
}

/** Visible under the current gate? (SFW always; NSFW only when the gate is open.) */
export const ratingVisible = (rating: ContentRating): boolean => SHOW_NSFW || rating === 'sfw';
