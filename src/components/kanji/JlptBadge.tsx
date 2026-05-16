const CLASSES: Record<string, string> = {
  N5: 'badge-n5',
  N4: 'badge-n4',
  N3: 'badge-n3',
  N2: 'badge-n2',
  N1: 'badge-n1',
};

interface Props {
  level: string | null;
}

export function JlptBadge({ level }: Props) {
  if (!level) return <span className="badge-jlpt badge-none">—</span>;
  return <span className={`badge-jlpt ${CLASSES[level] ?? 'badge-none'}`}>{level}</span>;
}
