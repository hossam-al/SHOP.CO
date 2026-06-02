# Nordic Cart - Next.js E-commerce Mini Site

A small multilingual e-commerce mini site built with Next.js App Router, TypeScript, Tailwind CSS, next-intl, Zustand, React Hook Form, and Zod.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The middleware redirects `/` to `/en`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run preview
```

## Tech Choices & Tradeoffs

- Next.js App Router for layouts, dynamic routes, route handlers, metadata, sitemap, robots, and OG image generation.
- `next-intl` for EN/AR routing, translations, localized metadata, and RTL handling.
- Zustand persisted store for cart, wishlist, mock auth, and theme toggle.
- React Hook Form + Zod for checkout, auth, and contact validation.
- Local mock product JSON served through route handlers.
- Frontend-only mock auth and checkout to keep the assignment focused and timeboxed.
- SHOP.CO design tokens applied from the professional design system: 1280px container, `#000000`, `#FFFFFF`, `#F2F0F1`, `#E5E5E5`, `#666666`, `#FFC633`, `#FF3333`, `#01AB31`.

## Route Map

- `/en`, `/ar`
- `/en/category/[slug]`, `/ar/category/[slug]`
- `/en/product/[id]`, `/ar/product/[id]`
- `/en/cart`, `/ar/cart`
- `/en/checkout`, `/ar/checkout`
- `/en/login`, `/ar/login`
- `/en/signup`, `/ar/signup`
- `/en/about`, `/ar/about`
- `/en/contact`, `/ar/contact`
- `/api/products`
- `/api/products/[id]`
- `/api/categories`
- `/sitemap.xml`
- `/robots.txt`

## SEO Checklist

- [x] Metadata API for localized titles/descriptions
- [x] Localized canonical URLs
- [x] EN/AR hreflang alternates
- [x] Localized OG/Twitter metadata
- [x] Product JSON-LD with offers
- [x] BreadcrumbList JSON-LD
- [x] Localized sitemap
- [x] Robots.txt
- [x] Dynamic OG image route
- [x] `<html lang>` and `dir` per locale

## Lighthouse Screenshots

Add screenshots after running Lighthouse:

- [ ] EN desktop
- [ ] EN mobile
- [ ] AR desktop
- [ ] AR mobile

Target: SEO score >= 90 for desktop and mobile in both languages.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL.
4. Deploy with the default Next.js settings.

## Notes

The site uses local SVG product art in `public/images` and local JSON data in `data/products.json`. Checkout and authentication are mock client-side flows.
