import { execSync } from 'child_process';
import { resolve } from 'path';

function gitLog(path: string): Date | null {
  try {
    const out = execSync(
      `git log -1 --format=%aI -- "${path}"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    return out ? new Date(out) : null;
  } catch {
    return null;
  }
}

/** Returns the date of the last git commit touching this post file, or null. */
export function getGitLastModified(postId: string): Date | null {
  return gitLog(resolve(process.cwd(), 'src/content/blog', postId));
}

/** Returns the date of the most recent git commit across all blog content. */
export function getGitLastModifiedAll(): Date | null {
  return gitLog(resolve(process.cwd(), 'src/content/blog'));
}
