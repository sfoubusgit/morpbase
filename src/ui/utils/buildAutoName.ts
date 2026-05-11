export function buildAutoName(
  characterName: string | null,
  environmentName: string | null,
  moodName: string | null,
  styleName: string | null,
): string {
  const parts = [characterName, environmentName, moodName, styleName]
    .filter((p): p is string => Boolean(p))
    .slice(0, 3);

  if (parts.length === 0) {
    const d = new Date();
    const day = d.getDate();
    const month = d.toLocaleString('en', { month: 'short' });
    const year = String(d.getFullYear()).slice(2);
    return `Session — ${day} ${month} '${year}`;
  }

  return parts.join(' / ');
}
