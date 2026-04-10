/** Turn URL segments into a readable heading (stub pages). */
export function humanizeSlugSegment(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function titleFromSlugSegments(slug: string[]): string {
  return slug.map(humanizeSlugSegment).join(" · ");
}
