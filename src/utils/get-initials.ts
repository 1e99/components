export function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  const selected = parts.length > 1 ? [parts[0], parts.at(-1)!] : parts;

  return (
    selected
        .map((part) => Array.from(part)[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '1'
  );
}
