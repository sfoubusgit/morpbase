/**
 * A creator's handle, rendered as a link to their profile — the ONE place you
 * follow or message someone. You don't follow a card; you follow the person who
 * made it. Seeded / authorless content (no real auth uid) stays plain text.
 */
type CreatorLinkProps = {
  authUid: string | null | undefined;
  name: string;
  onViewCreator?: (authUid: string, name: string) => void;
};

export function CreatorLink({ authUid, name, onViewCreator }: CreatorLinkProps) {
  const handle = name.toLowerCase().replace(/\s+/g, '');
  if (!authUid || !onViewCreator) return <b>@{handle}</b>;
  return (
    <button
      type="button"
      className="v3-creatorlink"
      onClick={() => onViewCreator(authUid, name)}
      title={`View @${handle}’s profile`}
    >
      @{handle}
    </button>
  );
}
