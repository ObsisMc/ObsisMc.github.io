# iBlog-astro — AGENTS.md

## Project

Personal bilingual blog (zh/en) built with Astro, migrated from Hexo + shiro theme.
Source Hexo blog: `../iBlog/` — shiro theme source: `../iBlog/themes/shiro/`

## Core Requirements

- Bilingual (Chinese / English), Chinese is default (no URL prefix), English at `/en/`
- Deploy to GitHub Pages via GitHub Actions
- **Visual style must match hexo-theme-shiro exactly** — treat the shiro source as ground truth

## Shiro Design Reference

All design decisions defer to the original shiro source files:

- CSS tokens & component styles: `../iBlog/themes/shiro/source/css/_tailwind.css`
- Layout structure: `../iBlog/themes/shiro/layout/_layout.njk`
- Header/nav: `../iBlog/themes/shiro/layout/_partial/common/header.njk`
- Footer: `../iBlog/themes/shiro/layout/_partial/common/footer.njk`
- Post card: `../iBlog/themes/shiro/layout/_partial/components/post-card.njk`
- Post page: `../iBlog/themes/shiro/layout/post.njk`
- Archive page: `../iBlog/themes/shiro/layout/archive.njk`
- About page: `../iBlog/themes/shiro/layout/about.njk`
- UI macros (seal, divider, icons): `../iBlog/themes/shiro/layout/_macro/ui.njk`

When in doubt about any visual detail, read the shiro source — do not guess.

## Site Configuration

```
Owner:     张睿豪
Alias:     Ray Zhang
Tagline:   Systems, Data, Code, and Ideas
Seal char: 豪
Slogan font: yuji-boku

Social:
  GitHub:   https://github.com/ObsisMc
  LinkedIn: https://www.linkedin.com/in/ruihao-zhang/
  Medium:   https://medium.com/@r9644360
  Zhihu:    https://www.zhihu.com/people/0000-26-60
  Substack: https://substack.com/@rayzhang675112
  Email:    r9644360@gmail.com

Analytics:    Google Analytics 4, ID: G-VWVSG2MS4Y
Contact form: https://formsubmit.co/f97d0a44c26199a38bf41eaec175931d
Comments:     Giscus
```

## Pages

| Page | zh route | en route |
|---|---|---|
| Home (post list) | `/` | `/en/` |
| Post detail | `/blog/[slug]` | `/en/blog/[slug]` |
| Archives | `/archives` | `/en/archives` |
| Tags | `/tags` | `/en/tags` |
| Tag detail | `/tags/[tag]` | `/en/tags/[tag]` |
| About | `/about` | `/en/about` |

## Content

Posts live in `src/content/blog/zh/` and `src/content/blog/en/`.
Same filename = translation pair (e.g. `git-commands.md` in both folders).

Frontmatter schema (`src/content/config.ts`):
```yaml
title: string
date: Date
tags: string[]           # optional
excerpt: string          # optional, falls back to first 200 chars of body
path_name: string        # optional — used as URL slug; falls back to filename
# Hexo legacy fields kept to avoid schema errors:
categories: any          # ignored
tag: any                 # ignored (Hexo sometimes uses singular form)
```

**Slug resolution** (`src/utils/slug.ts`): use `path_name` if present, else filename minus prefix/extension.
All migrated zh posts already have `path_name` set to clean English slugs.

## Translation Workflow

English posts are generated from the Chinese source by `tools/md_translator`
(git submodule). **Important timing constraint:** `increment-trans` finds work
via `git diff` / `git diff --cached` / `git ls-files --others` — it reads the
*working tree*, so it only sees **uncommitted** changes. Run it after writing
the Chinese post and *before* committing; once committed, it finds nothing.

```bash
npm run translate        # sync src/content/blog/zh/ -> src/content/blog/en/
npm run excerpt <file>   # fill an empty `excerpt` front matter field
npm run hooks:install    # one-time per clone, see below
```

A `.githooks/pre-commit` hook guards the invariants. It is pure bash + git
(no Python, no network, ~0.1s) and **exits immediately unless the commit
stages a file under `src/content/blog/zh/`** — commits that only touch code
are unaffected. When Chinese posts are staged it blocks on:

- `path_name` empty → the URL slug would fall back to the Chinese filename
- no English counterpart in `src/content/blog/en/`
- English counterpart exists but is not staged alongside → stale translation

and warns (non-blocking) on empty `tags`.

Bypass with `SKIP_BLOG_CHECKS=1 git commit ...`.

The hook lives in `.githooks/` (versioned) rather than `.git/hooks/`
(not versioned, lost on re-clone). Each clone needs `npm run hooks:install`
once. `.gitattributes` pins `.githooks/**` to LF because `core.autocrlf=true`
would otherwise break the shebang under Git Bash.

## Current File Structure

```
src/
  content/
    blog/
      zh/          # 7 Chinese posts (migrated from ../iBlog/source/_posts/)
      en/          # empty — Phase 3
    config.ts      # Content collection schema
  layouts/
    Base.astro     # Full shiro layout: fog-bg, paper card, SVG filters, lang switcher, to-top
  components/
    Header.astro   # Site title + seal (豪), RSS/GitHub pills, desktop+mobile nav
    Footer.astro   # Copyright, Cormorant Garamond font
    Divider.astro  # Three-dot SVG divider with gradient lines
  pages/
    index.astro          # Home (post cards with excerpt + btn-ink)
    blog/[slug].astro    # Post detail (prose, tags, prev/next nav, floating TOC)
    archives.astro       # Timeline grouped by year
    tags/index.astro     # All tags with pill + count
    tags/[tag].astro     # Posts by tag (archive list style)
    about.astro          # About page (avatar, social icons, contact form)
  styles/
    global.css     # Full shiro CSS: Tailwind v4.2.1 + all component/utility classes
  utils/
    slug.ts        # getPostSlug() — path_name > filename fallback
.github/
  workflows/
    deploy.yml     # INERT here (Actions disabled on iBlog-astro) — the live
                   # copy of this workflow runs in the ObsisMc.github.io repo
public/
  favicon.svg
  # Post image asset folders (copied from Hexo)
astro.config.mjs   # site: https://ruihaozhang.com, output: static, image: noop, tailwindcss vite plugin
package.json
```

## Publishing

Two GitHub repos share one history; `iBlog-astro` is for authoring,
`ObsisMc.github.io` is what actually goes live. Keep them as two steps —
pushing to `origin` must NOT publish, so that unfinished work can be pushed
freely.

| Remote | Repo | Role |
| --- | --- | --- |
| `origin` | `ObsisMc/iBlog-astro` | Authoring. GitHub Actions is **disabled**, Pages is **not enabled** — pushing here publishes nothing. |
| `githubio` | `ObsisMc/ObsisMc.github.io` | Publishing. Its own copy of `deploy.yml` builds on every push to `main` and serves `https://ruihaozhang.com` (custom domain, HTTPS enforced). |

```bash
git push origin main   # save work — does not publish
npm run publish        # git push githubio main -> builds, live in ~40s
```

`.github/workflows/deploy.yml` in this repo is therefore inert. Do not
"fix" it by enabling Actions here without first deciding which repo owns
the deploy — running both would race two builds onto the same domain.

## Known Decisions & Gotchas

- **No `base` in astro.config** — not needed: the site is served from the root of a custom domain (`ruihaozhang.com`). Only a project-page deploy (`ObsisMc.github.io/iBlog-astro`) would need `base: '/iBlog-astro'`.
- **Image service: noop** — Astro's image optimizer is disabled (`astro/assets/services/noop`) because migrated posts use relative image paths that Astro can't resolve at build time. Post images are served from `public/`.
- **Relative image paths fixed** — All `./FolderName/img` references in zh posts were rewritten to `/FolderName/img` (absolute) in the copies under `src/content/blog/zh/`. The originals in `../iBlog/` are untouched.
- **Astro 5 content schema** — `passthrough()` does not reliably expose extra fields at runtime. Extra Hexo frontmatter fields must be explicitly declared in the schema (even as `z.any()`) to be accessible.
- **Cache issues** — Astro 5 aggressively caches the content store. When schema or slug logic changes, always delete `.astro/` and `dist/` before rebuilding.

## Implementation Phases

Work through these phases in order. Do not start the next phase until the current one is done and verified.

### Phase 1 — Get the blog running ✓ DONE

Goal: Astro dev server runs, all existing Chinese posts are readable.

Done: `npm run dev` works, all 7 posts accessible at clean English slugs, `npm run build` succeeds (15 pages).

### Phase 2 — Match shiro visual style ✓ DONE

Goal: The site looks identical to the Hexo shiro theme.

Done: `npm run build` succeeds (15 pages), full shiro CSS ported, all components match.

#### What was implemented

**`src/styles/global.css`** — Full port of shiro's `_tailwind.css`:
- Tailwind v4.2.1 (`@tailwindcss/vite` plugin, NOT postcss)
- `@theme` block: color tokens (`--color-paper`, `--color-ink`, `--color-seal=#b0171a`), font stacks (`--font-serif`, `--font-title: Yuji Syuku/Boku`, `--font-eng: Cormorant Garamond`, `--font-code`), shadows, easing
- `@layer base`: scrollbar styles, body font-serif antialiased
- `@layer components`: `.fog-bg`, `.paper` (with paper-texture `::before`), `.btn-ink`, `.menu-panel`, `.site-title`, `.card-title`, `.tag-pill`, `.section-divider`, `.archive-item`, `.post-nav-link`, `.link-muted`, etc.
- `@layer utilities`: `.focus-elegant`, `.prose-shiro` (manual prose styles — typography plugin NOT used, see gotchas)
- Outside layers: lang switcher, to-top button, about page, floating post TOC CSS

**`src/layouts/Base.astro`** — Full shiro layout:
- `<body class="h-full fog-bg">`, paper card `div`, max-width container
- SVG filters: `#seal-roughness` (feTurbulence + feDisplacementMap), `#text-erosion`
- Fixed lang switcher (top-right), to-top button, tagline note below footer
- Client scripts: to-top scroll listener, lang switcher dropdown toggle, mobile menu toggle

**`src/components/Header.astro`** — Site title with seal SVG (豪, #b0171a), last-updated subtitle, RSS + GitHub pills, desktop nav with `/` separators, mobile toggle + `.menu-panel`

**`src/components/Footer.astro`** — Copyright, Cormorant Garamond font, muted links

**`src/components/Divider.astro`** — Three-dot SVG with gradient lines (accepts `class` prop)

**Pages:**
- `index.astro` — Post cards: `.card-title`, clock icon meta, `.prose-shiro` excerpt, `.btn-ink` read-more, `<Divider>` between posts
- `blog/[slug].astro` — `.prose-shiro` content, tag pills, prev/next `.post-nav-link`, floating TOC aside (desktop ≥1200px) with collapse toggle + IntersectionObserver active link
- `archives.astro` — `.section-shell`, `.archive-item` list grouped by year
- `tags/index.astro` — tag pills with dot + count
- `tags/[tag].astro` — archive list style
- `about.astro` — `.about-avatar`, `.about-name-primary/secondary`, `.about-slogan`, `.about-social` (5 SVG icons), contact form (formsubmit.co)

#### Phase 2 Gotchas

- **Tailwind v4.0.0 crash** — `Cannot convert undefined or null to object` in `B.generate`. Fixed by upgrading to `tailwindcss@4.2.1` + `@tailwindcss/vite@4.2.1`.
- **`@tailwindcss/typography` incompatible** — `@plugin "@tailwindcss/typography"` syntax requires a v4-native typography plugin (doesn't exist yet). Prose styles are inlined manually in `.prose-shiro` instead.
- **Tailwind v4 HMR bug** — Dev server (`npm run dev`) throws `Cannot convert undefined or null to object` on hot reload. Initial page load and `npm run build` work correctly. This is an upstream Tailwind v4 bug and doesn't affect the deployed site.

### Phase 3 — Bilingual support

Goal: Every page exists in both Chinese and English with a working language switcher.

- Chinese at `/` (default, no prefix), English at `/en/`
- Posts in `src/content/blog/zh/` and `src/content/blog/en/`, same slug = translation pair
- Language switcher links between the zh and en versions of the current page
- If a translation does not exist, link to the other language's home instead
- All UI strings (nav labels, "read more", "tags", etc.) translated in both languages
- RSS feed for each language

Done when: switching language on any page navigates to the correct translated page.
