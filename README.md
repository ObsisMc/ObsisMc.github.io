# iBlog-astro

Personal bilingual blog (zh/en) built with Astro, inspired by [hexo-theme-shiro](https://github.com/Acris/hexo-theme-shiro).

Live at: [ruihaozhang.com](https://ruihaozhang.com)

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start local dev server at `localhost:4321`  |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview build locally before deploying      |

## External Services & Dependencies

### Required Setup

| Service | Purpose | Setup |
| :------ | :------ | :---- |
| [EmailJS](https://emailjs.com) | Contact form email delivery | Create account, add Gmail service, create email template. Update `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` in `src/pages/about.astro` |
| [Giscus](https://giscus.app) | Blog post comments (GitHub Discussions) | Enable GitHub Discussions on target repo, configure at giscus.app. Update script attributes in `src/pages/blog/[slug].astro` and `src/pages/en/blog/[slug].astro` |
| [Google Analytics](https://analytics.google.com) | Site analytics | GA4 property ID configured in `src/layouts/Base.astro` (ID: `G-VWVSG2MS4Y`) |
| [GitHub Pages](https://pages.github.com) | Hosting | Push to `main` branch triggers auto-deploy via `.github/workflows/deploy.yml`. Set Pages source to "GitHub Actions" in repo Settings → Pages |

### EmailJS Template Variables

The contact form template (`src/pages/about.astro`) sends these variables:

| Variable | Content |
| :------- | :------ |
| `{{name}}` | Sender's name |
| `{{reply_to}}` | Sender's email |
| `{{message}}` | Message body |
| `{{subject}}` | Email subject |

Recommended template content:
```
From: {{name}} <{{reply_to}}>

{{message}}
```

### CDN Resources (loaded automatically)

| Resource | Version | Purpose |
| :------- | :------ | :------ |
| [KaTeX](https://katex.org) | 0.16.22 | Math formula rendering in posts |
| [LightGallery](https://www.lightgalleryjs.com) | 2.8.3 | Image lightbox in posts |

### Google Fonts (loaded automatically)

- **Liu Jian Mao Cao** — site title (calligraphy)
- **Zeyada** — English name display
- **ZCOOL XiaoWei** — Chinese font fallback
- **Cormorant Garamond** — footer font

## Deployment

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.

Custom domain is configured via `public/CNAME` (`ruihaozhang.com`).
