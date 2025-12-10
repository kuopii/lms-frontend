/**
 * Convert test name to URL-friendly slug
 * Example: "Can you hear me" -> "can-you-hear-me"
 */
export const slugifyTestName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Decode slug back to original name format (for display)
 * Note: Since we're using slugify, we can't perfectly reconstruct the original
 * but this is mainly for finding test by matching slugified name
 */
export const unslugifyTestName = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Find test by slugified name
 */
export const findTestBySlug = <T extends { name: string }>(
  tests: T[],
  slug: string,
): T | undefined => {
  // Normalize both the slug and test names for reliable matching
  const normalizedSlug = slugifyTestName(slug);
  return tests.find((test) => slugifyTestName(test.name) === normalizedSlug);
};
