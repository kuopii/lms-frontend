export function getInitialsFromName(name?: string): string {
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
