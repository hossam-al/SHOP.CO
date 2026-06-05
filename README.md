# Nordic Cart - Next.js E-commerce Mini Site

A small multilingual e-commerce mini site built with Next.js App Router, TypeScript, Tailwind CSS, next-intl, Zustand, React Hook Form, and Zod.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000/en/home` or `http://localhost:3000/ar/home`.

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
- React Hook Form + Zod for checkout and auth validation.
- Local mock product JSON served through route handlers.
- Frontend-only mock auth and checkout to keep the assignment focused and timeboxed.
- SHOP.CO design tokens applied from the professional design system: 1280px container, `#000000`, `#FFFFFF`, `#F2F0F1`, `#E5E5E5`, `#666666`, `#FFC633`, `#FF3333`, `#01AB31`.

## Route Map

- `/en/home`, `/ar/home`
- `/en/PLP`, `/ar/PLP`
- `/en/PDP/[id]`, `/ar/PDP/[id]`
- `/en/CHEKOUT`, `/ar/CHEKOUT`
- `/en/CART`, `/ar/CART`
- `/en/WISHLIST`, `/ar/WISHLIST`
- `/en/LOGIN`, `/ar/LOGIN`
- `/en/SINUP`, `/ar/SINUP`
- `/en/ACCOUNT`, `/ar/ACCOUNT`
- `/en/ACCOUNT/MY-ORDERS`, `/ar/ACCOUNT/MY-ORDERS`
- `/api/products`
- `/api/products/[id]`
- `/api/categories`
- `/sitemap.xml`
- `/robots.txt`

## Project Structure

- `app/` - App Router pages, layouts, route handlers, sitemap, robots, and OG route.
- `components/layout/` - shared shell components such as header, footer, and theme sync.
- `components/product/` - product cards, PDP experience, and product quick actions.
- `components/category/` - category filters and sorting controls.
- `components/commerce/` - cart and checkout client flows.
- `components/feedback/` - reviews slider and toast UI.
- `components/forms/` - auth forms.
- `data/` - local mock product catalog.
- `lib/`, `types/`, `schemas/`, `store/`, `seo/`, `i18n/` - shared domain logic, typing, validation, state, metadata, and localization.
- `public/images/products/` - product images used by the catalog and PDP.
- `public/images/styles/` - homepage style category imagery.

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

The site uses local product imagery in `public/images` and local JSON data in `data/products.json`. Checkout and authentication are mock client-side flows.
