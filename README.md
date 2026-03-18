# iBlog-astro

Personal bilingual blog (zh/en) built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com), styled after [hexo-theme-shiro](https://github.com/Acris/hexo-theme-shiro). Deployed to GitHub Pages via GitHub Actions.

Live at: [ruihaozhang.com](https://ruihaozhang.com)

**Stack:** Astro 5 · Tailwind CSS v4 · Markdown · GitHub Pages · VSCode

---

## Local Development

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # production build → dist/
npm run preview  # preview the build locally
```

---

## Writing Posts

### VSCode Extension

Install **Front Matter CMS** (`eliostruyf.vscode-front-matter`) via the VSCode Extensions panel (search "Front Matter CMS").

### Creating a new post with Front Matter CMS

1. Open the **Front Matter** panel in the VSCode sidebar
2. Click **Create content** and select a content type:
   - `Blog (ZH)` → `src/content/blog/zh/`
   - `Blog (EN)` → `src/content/blog/en/`
   - `Notes` → `src/content/notes/`
3. Enter the title — `date` and `path_name` (URL slug) are auto-generated
4. Edit tags / categories / excerpt in the right panel
5. Write content below the frontmatter divider

### Frontmatter reference

```yaml
---
title: "Post Title"
date: 2026-03-08
path_name: "url-slug"   # optional, falls back to filename
excerpt: "..."          # optional
tags:
  - TagName
categories:
  - CategoryName
---
```

### Bilingual posts

Chinese and English posts with the **same filename** are treated as a translation pair and linked via the language switcher.

```
src/content/blog/zh/git-common-commands.md   ← 中文
src/content/blog/en/git-common-commands.md   ← English
```

---

## Pages & Routes

| Page | zh route | en route |
| :--- | :------- | :------- |
| Home (post list) | `/` | `/en/` |
| Post detail | `/blog/[slug]` | `/en/blog/[slug]` |
| Archives | `/archives` | `/en/archives` |
| Tags | `/tags` | `/en/tags` |
| Tag detail | `/tags/[tag]` | `/en/tags/[tag]` |
| Categories | `/categories` | `/en/categories` |
| Category detail | `/categories/[category]` | `/en/categories/[category]` |
| Notes | `/notes` | `/en/notes` |
| About | `/about` | `/en/about` |

---

## Project Structure

```
src/
  content/
    blog/
      zh/          # Chinese posts
      en/          # English posts (same filename = translation pair)
    notes/
      zh/          # Chinese notes
      en/          # English notes
    config.ts      # Content collection schema
  layouts/
    Base.astro     # Full shiro layout: fog-bg, paper card, SVG filters, lang switcher
  components/
    Header.astro   # Site title + seal, nav, RSS/GitHub pills
    Footer.astro   # Copyright
    Divider.astro  # Three-dot SVG divider
  pages/
    index.astro                      # Home (zh)
    blog/[slug].astro                # Post detail (zh)
    archives.astro                   # Archives (zh)
    tags/                            # Tags (zh)
    categories/                      # Categories (zh)
    notes/index.astro                # Notes (zh)
    about.astro                      # About (zh)
    en/                              # All English equivalents
  styles/
    global.css     # Full shiro CSS: Tailwind v4 + all component classes
  utils/
    slug.ts        # getPostSlug() — path_name > filename fallback
.github/
  workflows/
    deploy.yml     # Push to main → build → deploy to GitHub Pages
public/
  CNAME            # ruihaozhang.com
  favicon.svg
```

---

## External Services

| Service | Purpose |
| :------ | :------ |
| [Giscus](https://giscus.app) | Comments via GitHub Discussions |
| [Google Analytics](https://analytics.google.com) | Analytics (GA4 ID: `G-VWVSG2MS4Y`) |
| [GitHub Pages](https://pages.github.com) | Hosting — push to `main` to deploy |

### CDN resources (auto-loaded)

| Resource | Purpose |
| :------- | :------ |
| [KaTeX](https://katex.org) 0.16.22 | Math formula rendering |
| [LightGallery](https://www.lightgalleryjs.com) 2.8.3 | Image lightbox |

---

## Deployment

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.
See [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Custom domain configured via `public/CNAME` (`ruihaozhang.com`).
