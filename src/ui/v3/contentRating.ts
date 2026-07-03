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

// Explicit-content detector over an item's own descriptive text. Deliberately
// scoped to genuinely explicit terms — common fashion/anatomy words that merely
// *describe* a clothed character (cleavage, breasts, a "cutout") are SFW and must
// NOT be flagged, or ordinary character art gets wrongly hidden.
const NSFW_TERMS = /\b(nude|nudity|naked|topless|bottomless|areolas?|nipples?|genital\w*|vulva|vagina|penis|cum|cumshot|sex|sexual|intercourse|orgasm|masturbat\w*|fellatio|cunnilingus|blowjob|hentai|pornographic|porn|nsfw|lewd|erotic|erotica)\b/i;

export function ratingForText(text: string): ContentRating {
  return NSFW_TERMS.test(text) ? 'nsfw' : 'sfw';
}

/** The first explicit term found — so we can tell a creator WHY it's flagged. */
export function nsfwMatch(text: string): string | null {
  const m = text.match(NSFW_TERMS);
  return m ? m[0] : null;
}

/** Visible under the current gate? (SFW always; NSFW only when the gate is open.) */
export const ratingVisible = (rating: ContentRating): boolean => SHOW_NSFW || rating === 'sfw';
