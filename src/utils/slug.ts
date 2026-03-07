/**
 * Get URL slug for a post.
 * Uses `path_name` frontmatter if present, otherwise falls back to
 * the filename (stripped of zh/ prefix and .md extension).
 */
export function getPostSlug(post: any): string {
  const pathName = (post.data as any).path_name;
  if (pathName && typeof pathName === 'string') {
    return pathName.trim();
  }
  // Fallback: filename without prefix/extension
  return post.id.replace(/^zh\//, '').replace(/^en\//, '').replace(/\.md$/, '');
}
