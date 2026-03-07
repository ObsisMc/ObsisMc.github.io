# iBlog-astro — CLAUDE.md

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
Alias:     Ruihao (Ray) Zhang
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

Frontmatter:
```yaml
title: string
date: Date
tags: string[]
excerpt: string   # optional, falls back to first 200 chars
```

Existing posts to migrate from: `../iBlog/source/_posts/`

## Implementation Phases

Work through these phases in order. Do not start the next phase until the current one is done and verified.

### Phase 1 — Get the blog running

Goal: Astro dev server runs, all existing Chinese posts are readable.

- Initialize Astro project in this directory
- Migrate all posts from `../iBlog/source/_posts/` into `src/content/blog/zh/`
- Clean up Hexo-specific frontmatter fields, keep `title`, `date`, `tags`
- Implement all pages (home, post, archives, tags, about) with basic unstyled or default Astro styling
- GitHub Actions deploy workflow to GitHub Pages must be in place

Done when: `npm run dev` works, all posts are accessible, `npm run build` succeeds.

### Phase 2 — Match shiro visual style

Goal: The site looks identical to the Hexo shiro theme.

- Port all CSS from `../iBlog/themes/shiro/source/css/_tailwind.css` — color tokens, fonts, component classes
- Replicate layout structure from shiro's `_layout.njk`: fog background, paper card, max-width container
- Replicate every component from shiro source: header, seal, nav, footer, post card, divider, tag pill, archive list, TOC, lang switcher, to-top button, about page
- Use the shiro source files as pixel-level reference — read them before implementing any component

Done when: a side-by-side comparison with the Hexo shiro site shows no visible differences.

### Phase 3 — Bilingual support

Goal: Every page exists in both Chinese and English with a working language switcher.

- Chinese at `/` (default, no prefix), English at `/en/`
- Posts in `src/content/blog/zh/` and `src/content/blog/en/`, same slug = translation pair
- Language switcher links between the zh and en versions of the current page
- If a translation does not exist, link to the other language's home instead
- All UI strings (nav labels, "read more", "tags", etc.) translated in both languages
- RSS feed for each language

Done when: switching language on any page navigates to the correct translated page.
