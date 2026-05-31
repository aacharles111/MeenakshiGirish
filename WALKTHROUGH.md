# Meenakshi Girish — Complete Project Walkthrough

> **Purpose:** This document is an exhaustive, line-by-line guide to every decision, file, component, style, animation, content string, and image asset in the Meenakshi Girish personal brand website. A developer reading this should be able to reconstruct the entire project from scratch.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Setup & Configuration](#3-project-setup--configuration)
4. [Folder Structure](#4-folder-structure)
5. [Design System](#5-design-system)
6. [Global Styles & CSS](#6-global-styles--css)
7. [Entry Points](#7-entry-points)
8. [Routing & App Shell](#8-routing--app-shell)
9. [Shared Components (31 total)](#9-shared-components-31-total)
10. [Pages (8 total)](#10-pages-8-total)
11. [Image Assets & Generation](#11-image-assets--generation)
12. [Third-Party Component Integrations](#12-third-party-component-integrations)
13. [Brand Guidelines & Content Rules](#13-brand-guidelines--content-rules)
14. [SEO & Accessibility](#14-seo--accessibility)
15. [Visual Audit & Bug Fixes](#15-visual-audit--bug-fixes)
16. [Running the Project](#16-running-the-project)

---

## 1. Project Overview

### What This Is
A personal brand website for **Meenakshi Girish** — a 26-year-old South Indian freelance content writer, author of "The Freelancer's Mindset", public speaker, podcaster (TFM Shortcast), and mentor. She has 7+ years of experience, has mentored 1,000+ students, delivered 350+ projects, and works across healthcare, e-commerce, B2B, and more.

### Design Aesthetic
- **"Pastel Luxe Editorial"** — cute, professional, warm
- Pastel teal + warm cream color palette
- Playfair Display italic headings (elegant, editorial)
- Poppins body text (clean, modern)
- Abstract botanical SVG decorations scattered throughout
- Fun, playful tone throughout all copy
- Each page has a unique "signature" interactive element

### Pages
| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Hero video, services overview, portfolio, testimonials |
| `/about` | About | Full bio, fun facts, what she does, industries |
| `/freelancing` | Freelancing | Services, portfolio gallery, process, niches, testimonials |
| `/the-book` | The Book | Book showcase, chapters, audience, excerpts, reviews |
| `/book` | The Book (alias) | Same as above — alias route |
| `/speaking` | Speaking & Mentoring | Topics, gallery, audience, mentoring, testimonials |
| `/contact` | Contact | CTA cards, contact form, social links |
| `/buy` | Buy the Book | Book details, order form, audiobook banner |

---

## 2. Tech Stack & Dependencies

### Core Framework
- **Vite 8.0.12** — Build tool and dev server
- **React 19.2.6** — UI library
- **React DOM 19.2.6** — DOM rendering
- **TypeScript ~6.0.2** — Type safety
- **React Router DOM 7.15.1** — Client-side routing (BrowserRouter)

### Styling
- **Tailwind CSS 4.3.0** — Utility-first CSS framework
- **@tailwindcss/vite 4.3.0** — Vite plugin for Tailwind
- Vanilla CSS files for custom components (BubbleMenu, CurvedLoop, CircularGallery, DomeGallery)

### Animation & Interaction
- **Framer Motion 12.40.0** — React animation library (FadeUp, AnimatePresence, motion components)
- **GSAP 3.15.0** — GreenSock Animation Platform (BubbleMenu item stagger)
- **@use-gesture/react 10.3.1** — Gesture handling (DomeGallery drag)

### 3D/WebGL
- **OGL 1.0.11** — Lightweight WebGL library (originally for CircularGallery, but current implementation is CSS-only 3D)

### Icons
- **Lucide React 0.546.0** — Icon library (Leaf, BookOpen, Mic2, Mail, Phone, etc.)

### Dev Dependencies
- **@eslint/js 10.0.1**, **eslint 10.3.0** — Linting
- **eslint-plugin-react-hooks 7.1.1** — React hooks linting
- **eslint-plugin-react-refresh 0.5.2** — HMR linting
- **typescript-eslint 8.59.2** — TypeScript linting
- **@vitejs/plugin-react 6.0.1** — React Vite plugin
- **@types/react 19.2.14**, **@types/react-dom 19.2.3**, **@types/node 24.12.3** — Type definitions
- **globals 17.6.0** — Global variable definitions for ESLint
- **Playwright 1.60.0** — Browser automation (for visual testing/screenshots)

### Full `package.json`
```json
{
  "name": "meenakshi-vite",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "@use-gesture/react": "^10.3.1",
    "framer-motion": "^12.40.0",
    "gsap": "^3.15.0",
    "lucide-react": "^0.546.0",
    "ogl": "^1.0.11",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1",
    "tailwindcss": "^4.3.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "playwright": "^1.60.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.59.2",
    "vite": "^8.0.12"
  }
}
```

---

## 3. Project Setup & Configuration

### Vite Configuration (`vite.config.ts`)
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```
- Two plugins: React (JSX transform, HMR) and Tailwind CSS v4 (CSS processing)
- No custom aliases, no proxy configuration
- Default port: Vite assigns automatically (typically 5173 or 5174)

### TypeScript Configuration
**`tsconfig.json`** — References two sub-configs:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**`tsconfig.app.json`** — Application code:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### ESLint Configuration (`eslint.config.js`)
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
```

---

## 4. Folder Structure

```
meenakshi-vite/
├── Abstract elements/           # SVG decoration source files
│   ├── Brown shape 1.svg        # Warm brown organic blob
│   ├── Brown shape 2.svg        # Second brown organic shape
│   ├── Leaf1.svg                # Botanical leaf illustration
│   ├── Leaf2.svg                # Second botanical leaf
│   ├── Teal shape 1.svg         # Large teal organic blob
│   └── Teal shape 2.svg         # Second teal organic shape
│
├── Logo.svg                     # MG monogram logo (root copy)
│
├── public/
│   ├── abstract/                # SVGs served as static assets
│   │   └── (same 6 SVGs as above, also accessible via /abstract/ URLs)
│   ├── favicon.svg              # Browser tab icon
│   ├── icons.svg                # SVG sprite sheet
│   ├── logo.svg                 # MG monogram logo (public copy)
│   ├── fonts/
│   │   ├── Anti Design Endeavour.ttf   # Display font for hero "MEENAKSHI"
│   │   ├── PlayfairDisplay-BoldItalic.ttf
│   │   ├── Poppins-Regular.ttf
│   │   └── README.md            # Font installation instructions
│   ├── images/
│   │   ├── meenakshi-hero.png   # Main portrait photo (~1.98MB)
│   │   ├── book-cover.png       # Generated book cover (~674KB)
│   │   ├── portfolio/           # 6 generated portfolio showcase images
│   │   │   ├── website.png      # Website copy showcase
│   │   │   ├── blog.png         # Blog writing showcase
│   │   │   ├── social.png       # Social media content
│   │   │   ├── newsletter.png   # Newsletter design
│   │   │   ├── seo.png          # SEO content
│   │   │   └── copywriting.png  # Copywriting showcase
│   │   └── mentoring/           # 6 generated event/mentoring photos
│   │       ├── event1.png       # College auditorium speaking
│   │       ├── event2.png       # Mentoring session
│   │       ├── event3.png       # Panel discussion
│   │       ├── event4.png       # Workshop session
│   │       ├── event5.png       # Toastmasters meeting
│   │       └── event6.png       # Group photo with mentees
│   └── video/
│       └── hero-landscape.mp4   # Homepage hero background video
│
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root component with routing
│   ├── index.css                # Global styles + Tailwind + design tokens
│   ├── components/              # 31 reusable components
│   │   ├── About.tsx            # Homepage about section
│   │   ├── AboutTeaser.tsx      # Homepage "who is Meenakshi" teaser
│   │   ├── AbstractDeco.tsx     # Reusable SVG decoration element
│   │   ├── BookBanner.tsx       # Homepage book promotion banner
│   │   ├── BubbleMenu.tsx       # Main navigation (floating bubbles)
│   │   ├── BubbleMenu.css       # BubbleMenu styles
│   │   ├── CircularGallery.tsx  # 3D rotating gallery
│   │   ├── CircularGallery.css  # CircularGallery styles
│   │   ├── CountUp.tsx          # Animated number counter
│   │   ├── CTABand.tsx          # Homepage call-to-action section
│   │   ├── CurvedLoop.tsx       # Curved text marquee
│   │   ├── CurvedLoop.css       # CurvedLoop styles
│   │   ├── DomeGallery.tsx      # 3D dome photo gallery
│   │   ├── DomeGallery.css      # DomeGallery styles
│   │   ├── ExpandableCard.tsx   # Click-to-expand accordion card
│   │   ├── FadeUp.tsx           # Scroll-triggered fade-in animation
│   │   ├── Footer.tsx           # Site-wide footer
│   │   ├── Header.tsx           # Legacy header (NOT used, replaced by BubbleMenu)
│   │   ├── Hero.tsx             # Homepage full-screen video hero
│   │   ├── LoadingScreen.tsx    # Initial loading animation
│   │   ├── Marquee.tsx          # Infinite horizontal scroll
│   │   ├── PageHero.tsx         # Reusable inner page hero section
│   │   ├── Podcast.tsx          # Homepage podcast section
│   │   ├── Portfolio.tsx        # Homepage portfolio grid
│   │   ├── RevealImage.tsx      # Image with curtain wipe reveal
│   │   ├── SectionHeader.tsx    # Reusable section title + eyebrow
│   │   ├── Services.tsx         # Homepage services cards
│   │   ├── TaglineBand.tsx      # Homepage tagline quote
│   │   ├── Testimonials.tsx     # Homepage testimonial carousel
│   │   ├── TextReveal.tsx       # Word-by-word text reveal animation
│   │   └── TiltCard.tsx         # Mouse-follow 3D tilt effect
│   ├── hooks/                   # (empty — no custom hooks used)
│   └── pages/                   # 6 page components
│       ├── AboutPage.tsx        # /about
│       ├── BookPage.tsx         # /the-book, /book
│       ├── BuyPage.tsx          # /buy
│       ├── ContactPage.tsx      # /contact
│       ├── FreelancingPage.tsx  # /freelancing
│       └── SpeakingPage.tsx     # /speaking
│
├── index.html                   # HTML entry point
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── .gitignore
```

---

## 5. Design System

### Color Palette

All colors are defined as CSS custom properties via Tailwind's `@theme` directive in `index.css`:

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--color-background` | `hsl(40 30% 97%)` | Page background — warm cream/off-white |
| `--color-foreground` | `hsl(210 25% 15%)` | Primary text — near-black with cool undertone |
| `--color-card` | `hsl(38 28% 95%)` | Card backgrounds — slightly warmer than page bg |
| `--color-card-foreground` | `hsl(210 25% 15%)` | Card text |
| `--color-primary` | `hsl(175 35% 60%)` | **Brand teal** — buttons, links, accents |
| `--color-primary-foreground` | `hsl(0 0% 100%)` | White text on primary backgrounds |
| `--color-secondary` | `hsl(30 25% 88%)` | Warm beige secondary |
| `--color-secondary-foreground` | `hsl(210 25% 15%)` | Text on secondary |
| `--color-muted` | `hsl(30 15% 94%)` | Muted/subtle backgrounds |
| `--color-muted-foreground` | `hsl(210 15% 40%)` | Subdued text |
| `--color-accent` | `hsl(20 40% 85%)` | Warm accent (peach) |
| `--color-accent-foreground` | `hsl(210 25% 15%)` | Text on accent |
| `--color-border` | `hsl(30 15% 85%)` | Border color |
| `--color-input` | `hsl(30 15% 90%)` | Input backgrounds |
| `--color-ring` | `hsl(175 35% 60%)` | Focus ring (matches primary) |

**Decorative accent colors:**

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--color-flower-pink` | `hsl(350 50% 85%)` | Decorative pink accent |
| `--color-flower-yellow` | `hsl(45 60% 82%)` | Decorative yellow accent |
| `--color-leaf-green` | `hsl(140 30% 78%)` | Decorative green accent |
| `--color-book-coral` | `hsl(15 55% 70%)` | Book/coral accent |

**Per-page accent colors** (used in CTA gradients, icon tints, hover states):

| Page | Accent Color | Usage |
|------|-------------|-------|
| About | `hsl(15 55% 70%)` warm coral | CTA gradient: coral→teal |
| Freelancing | `hsl(200 40% 55%)` rich blue | CTA gradient: blue→teal |
| Book | `hsl(45 60% 55%)` warm gold | Chapter icons, CTA gradient |
| Speaking | `hsl(320 45% 60%)` vibrant magenta | CTA gradient: magenta→teal |
| Contact | `hsl(140 35% 55%)` warm green | CTA accents |
| Buy | `hsl(15 55% 65%)` coral | Audiobook banner |

### Typography

Three font families are used:

1. **Anti Design Endeavour** — Display font for the hero "MEENAKSHI" text only
   - Source: [befonts.com](https://befonts.com/anti-design-endeavour-font.html) (manual download required)
   - Loaded via `@font-face` in `index.css`
   - Tailwind token: `--font-endeavour`
   - Fallback: serif stack
   - Used ONLY in `Hero.tsx` for the massive name display

2. **Playfair Display** — Heading font (italic, bold)
   - Loaded from Google Fonts via `@import` in `index.css`
   - Weights: 600, 700 (both normal and italic)
   - Tailwind token: `--font-playfair`
   - Used for: all `<h2>`, `<h3>` headings, testimonial quotes, section labels, stats numbers
   - **Always italic** when used as a heading
   - Typical class: `font-playfair font-bold italic`

3. **Poppins** — Body/UI font
   - Loaded from Google Fonts via `@import` in `index.css`
   - Weights: 300 (light), 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)
   - Tailwind token: `--font-sans` (set as default)
   - Used for: all body text, buttons, labels, navigation
   - Applied globally via `body { font-family: var(--font-sans); }`

### Typography Scale

| Element | Font | Size | Weight | Style |
|---------|------|------|--------|-------|
| Hero "MEENAKSHI" | Anti Design Endeavour | `text-[22vw]` mobile / `text-[15vw]` tablet / `text-[11rem]` desktop | 400 | normal |
| Hero greeting | Playfair Display | `text-[5.5vw]` → `text-[1.7rem]` | 400 | italic |
| Page H1 (PageHero) | Playfair Display | `clamp(1.8rem, 4.5vw, 3rem)` | 700 | italic |
| Section H2 (SectionHeader) | Playfair Display | `clamp(1.5rem, 3vw, 2.2rem)` | 700 | italic |
| Card H3 | Playfair Display | `1.05rem` – `1.2rem` | 700 | italic |
| Body text | Poppins | `clamp(0.9rem, 1.2vw, 1rem)` | 400 | normal |
| Section label (eyebrow) | Poppins | `text-xs` (12px) | 500 | uppercase, `tracking-[0.15em]` |
| Button text | Poppins | `text-[13px]` or `text-xs` | 600 | uppercase, `tracking-wider` |
| Small/meta text | Poppins | `text-xs` (12px) | 400 | normal |
| CountUp numbers | Playfair Display | `clamp(2rem, 4vw, 3rem)` | 700 | italic |
| Marquee tags | Poppins | `text-sm` (14px) | 500 | normal |

### Spacing & Layout

- **Max content width:** `max-w-[1200px]` (most sections) or `max-w-[1100px]`, `max-w-[900px]`, `max-w-[750px]`, `max-w-[700px]` for narrower sections
- **Section padding:** `py-24 lg:py-32` (96px / 128px vertical)
- **Horizontal padding:** `px-6 lg:px-10` (24px / 40px)
- **Grid gaps:** `gap-8` (32px) for card grids, `gap-16` (64px) for major 2-column layouts
- **Card padding:** `p-8` or `p-10` (32px / 40px)
- **Card border radius:** `rounded-2xl` (16px)
- **Button border radius:** `rounded-full` (pill shape)
- **Button padding:** `px-8 py-3.5` for primary, `px-7 py-3` for secondary

### Card System

Every card in the project follows this shadow/border system:
```
border border-border/50
shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]
hover:shadow-[0_12px_40px_hsl(30_15%_75%_/_0.2)]
hover:border-primary/30
hover:-translate-y-1.5
transition-all duration-300 ease-out
```

### Button System

Two button variants used throughout:

**Primary (filled):**
```
bg-primary text-primary-foreground font-semibold text-[13px]
uppercase tracking-wider rounded-full px-8 py-3.5
hover:bg-[hsl(175_35%_50%)] hover:-translate-y-0.5
hover:shadow-xl transition-all duration-250
```

**Secondary (outlined):**
```
border-2 border-primary text-primary font-semibold text-[13px]
uppercase tracking-wider rounded-full px-8 py-3.5
hover:bg-primary hover:text-primary-foreground
transition-all duration-250
```

---

## 6. Global Styles & CSS

### `index.css` — Complete Breakdown

**Line 1:** Google Fonts import — Playfair Display (600, 700, italic) + Poppins (300–700)
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Poppins:wght@300;400;500;600;700&display=swap');
```

**Line 2:** Tailwind CSS v4 import
```css
@import "tailwindcss";
```

**Lines 4–10:** Custom font face for Anti Design Endeavour (local .ttf file)

**Lines 12–37:** `@theme` block defining all CSS custom properties (color tokens, font tokens)

**Lines 39–41:** Universal box-sizing reset

**Lines 43–45:** Smooth scrolling on `<html>`

**Lines 47–56:** Body styles — font-family, colors, overflow-x hidden, font smoothing, zero margin/padding

**Lines 58–60:** `#root` minimum height 100vh

**Lines 62–66:** Selection/highlight color — teal at 25% opacity

**Lines 68–72:** Focus ring — 2px solid teal with 2px offset

**Lines 76–104:** Keyframe animations:
- `cloud-drift` — Horizontal cloud movement left-to-right
- `cloud-drift-reverse` — Right-to-left
- `cloud-float` — Gentle vertical bobbing
- `fade-out-up` — Fade and slide up (loading screen exit)
- `count-up` — Fade in from below (number animation)
- `gentle-float` — Subtle 6px float (book cover, loading leaf)

**Lines 107–123:** Custom scrollbar:
- Track: `var(--color-muted)` (warm gray)
- Thumb: `var(--color-border)` with 4px border-radius
- Thumb hover: `var(--color-primary)` (teal)

---

## 7. Entry Points

### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Meenakshi Girish — Freelance content writer,
      author of The Freelancer's Mindset, speaker, and mentor. Seven years of helping
      brands communicate with clarity and purpose." />
    <meta name="author" content="Meenakshi Girish" />
    <meta property="og:title" content="Meenakshi Girish — Writer, Author, Speaker" />
    <meta property="og:description" content="Freelance content writer, author of
      The Freelancer's Mindset, speaker, and mentor helping brands communicate
      with clarity." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <title>Meenakshi Girish — Writer, Author, Speaker & Mentor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `main.tsx`
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```
- Wraps app in `StrictMode` for development checks
- Wraps in `BrowserRouter` for client-side routing
- Imports global CSS before App component

---

## 8. Routing & App Shell

### `App.tsx` — The Root Component

**Loading State:** App starts with a loading screen (`isLoading = true`). The `LoadingScreen` component plays for ~2.5 seconds, then calls `onComplete` to set `isLoading = false`.

**Skip Link:** An accessible "Skip to content" link is the first element, hidden via `sr-only` but visible on focus.

**Navigation:** `<BubbleMenu />` is rendered at root level (outside Routes), so it appears on ALL pages. It's a fixed-position floating navigation.

**Routes:**
```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/freelancing" element={<FreelancingPage />} />
  <Route path="/the-book" element={<BookPage />} />
  <Route path="/book" element={<BookPage />} />        {/* alias */}
  <Route path="/speaking" element={<SpeakingPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/buy" element={<BuyPage />} />
</Routes>
```

> [!IMPORTANT]
> The `/book` route is an alias for `/the-book`. Both render `BookPage`. This was added as a fix because `BubbleMenu` links to "The Book" at `/the-book` but some other links used `/book`.

**Footer:** `<Footer />` is rendered outside Routes, appearing on every page.

**HomePage** is an inline function component that composes:
1. `<Hero />`
2. `<TaglineBand />`
3. `<About />`
4. `<Services />`
5. `<Portfolio />`
6. `<AboutTeaser />`
7. `<BookBanner />`
8. `<Podcast />`
9. `<Testimonials />`
10. `<CTABand />`

---

## 9. Shared Components (31 total)

### 9.1 `LoadingScreen.tsx` — Initial Loading Animation

**Purpose:** Shows a gentle sky/cloud animation while the site loads, lasting ~2.5 seconds before fading out.

**Visual:** A sky-blue gradient background (`hsl(195 60% 85%)` → `hsl(190 40% 95%)`) with 5 animated cloud shapes drifting across. Center shows a floating Leaf icon (from lucide-react) with "Meenakshi Girish" in Playfair italic below.

**Cloud Configuration:** 5 clouds with varying:
- Width: 130–200px
- Height: 50–70px
- Vertical position: 15%–60% from top
- Opacity: 0.7–0.9
- Drift speed: 8–14 seconds
- Direction: 4 left-to-right, 1 right-to-left
- Float bobbing: 4–5 second cycles

**Timing:**
- 2500ms: Begin fade (set `isVisible = false`)
- 3100ms: Unmount component, call `onComplete()`
- Exit animation: 600ms fade + slide up (`y: -30`)

**Props:** `onComplete?: () => void` — called when loading screen finishes

---

### 9.2 `BubbleMenu.tsx` + `BubbleMenu.css` — Main Navigation

**Purpose:** Replaces the traditional header with a fun, floating bubble navigation. Two fixed circles appear in the bottom-right: a logo bubble and a hamburger bubble.

**Elements:**
1. **Logo bubble** — 56×56px circle, contains `logo.svg`, positioned `bottom: 32px; right: 100px`. Clicking navigates to `/`.
2. **Hamburger bubble** — 56×56px circle, positioned `bottom: 32px; right: 32px`. Three animated `<span>` bars transform into an X when open.
3. **Overlay menu** — Full-screen overlay with `hsl(40 30% 97% / 0.96)` cream background + 16px backdrop blur. Contains pill-shaped nav items.

**Navigation Items:**
| Label | Route | Rotation | Hover Color |
|-------|-------|----------|-------------|
| Home | `/` | -3° | `hsl(175 35% 60%)` teal |
| About | `/about` | 2° | `hsl(35 55% 55%)` warm gold |
| Freelancing | `/freelancing` | -2° | `hsl(200 40% 55%)` blue |
| The Book | `/the-book` | 3° | `hsl(15 55% 70%)` coral |
| Speaking | `/speaking` | -1° | `hsl(320 30% 55%)` magenta |
| Contact | `/contact` | 2° | `hsl(140 35% 55%)` green |
| Buy the Book | `/buy` | -1° | (CTA style — teal filled) |

**GSAP Animation:** When menu opens, items animate in with stagger:
```js
gsap.to(items, {
  opacity: 1, y: 0, scale: 1,
  stagger: 0.05, duration: 0.4,
  ease: 'back.out(1.7)', delay: 0.1,
});
```

**Behaviors:**
- `document.body.style.overflow = 'hidden'` when open (prevents background scroll)
- Escape key closes menu
- Active page gets `is-active` class (teal border + tinted background)
- Uses `useNavigate` and `window.scrollTo({ top: 0 })` for navigation

**CSS Details:**
- Logo/toggle: `z-index: 99`, `box-shadow: 0 4px 20px rgba(0,0,0,0.1)`
- Hover: `transform: scale(1.06)`, `box-shadow: 0 6px 28px rgba(0,0,0,0.14)`
- Overlay: `z-index: 98`
- Nav items: pill-shaped (`border-radius: 999px`), `padding: 14px 36px`, uppercase, `letter-spacing: 0.08em`, `font-weight: 600`
- Mobile (≤480px): Bubbles shrink to 48×48px, nav items to `0.9rem`
- `prefers-reduced-motion`: All transitions disabled

---

### 9.3 `Hero.tsx` — Homepage Full-Screen Video Hero

**Layout:** Full viewport height section with a background video, text overlay centered top, and a gradient fog at the bottom.

**Video:** `/video/hero-landscape.mp4` — autoplays, muted, looping, `playsInline`, covers full section via `object-cover`.

**Content (centered, 22vh from top):**
1. Greeting: "Hey there! I am" — Playfair italic, white, responsive sizing
2. Name: "MEENAKSHI" — Anti Design Endeavour font, massive display size
   - Mobile: Splits as "MEEN" / "AKSHI" on two lines (`22vw` font-size)
   - Desktop: Single line "MEENAKSHI" (`11rem` max)
   - `line-height: 0.88` for tight leading
3. Subheading + CTA in a row on desktop, stacked on mobile:
   - Subheading: "Freelance writer, author, speaker..." — Playfair italic, `max-w-[380px]`
   - CTA button: "LET'S WORK TOGETHER" → `/contact` — outlined white pill

**Bottom gradient fog:**
```css
background: linear-gradient(
  to top,
  hsl(40 30% 97%) 0%,         /* cream - opaque */
  hsl(40 30% 97% / 0.85) 30%,
  hsl(40 30% 97% / 0.4) 60%,
  transparent 100%
);
height: 180px (mobile) / 220px (desktop)
```
This creates a smooth transition from the video into the cream page background.

**Framer Motion animations:**
- Greeting: 600ms fade + slide, 100ms delay
- Name: 800ms fade + slide + scale(0.96→1), 200ms delay
- Subheading + CTA: 600ms, 500ms delay

---

### 9.4 `TaglineBand.tsx` — Homepage Quote Strip

A narrow `bg-card` section with a centered quote, flanked by two small Leaf icons. Abstract decorations: Leaf1 top-left rotated -25°, Leaf2 bottom-right rotated 20°.

**Quote text:** "Seven years of freelancing, one book, a thousand conversations, and only a few minor typos along the way."

Font: Playfair Display, 600 weight, italic, `clamp(1rem, 2.5vw, 1.3rem)`.

---

### 9.5 `About.tsx` — Homepage About Section

**Layout:** Two-column grid `[380px_1fr]` on desktop, stacked on mobile.

**Left column:** Circular portrait (340×340px) with:
- `rounded-full` clipping
- 3px `border-primary/20` border
- Soft shadow
- Teal blob SVG behind it

**Right column:**
- Eyebrow: `HI, I'M MEENAKSHI` with Leaf icon
- Heading: "A writer at heart, a strategist in mind."
- Body paragraph about 7+ years experience
- Link: "More about me →" to `/about`
- Stats grid (2×3): 6 animated stat cards

**Stats data:**
| Icon | Number | Label |
|------|--------|-------|
| ScrollText | 7+ | Years of Experience |
| FolderOpen | 350+ | Projects Delivered |
| PenLine | 300,000+ | Words Written |
| IndianRupee | ₹2L+ | Monthly Income |
| BookOpen | 1,500+ | Books Hoarded |
| Users | 1,000+ | Students Mentored |

Stats animate in with stagger using Framer Motion `variants`.

---

### 9.6 `Services.tsx` — Homepage Services Cards

Three cards in a 3-column grid:

| Icon | Title | Body | Link Text | Link |
|------|-------|------|-----------|------|
| Monitor | Freelance Content Writing | "I write for brands, businesses..." | Stalk My Services → | /freelancing |
| BookHeart | The Freelancer's Mindset | "I wrote the book I desperately wished..." | Grab a Copy → | /the-book |
| Mic | Public Speaking & Mentoring | "I've spoken at colleges..." | Book My Brain → | /speaking |

Each card has:
- 64×64px icon container (`rounded-2xl bg-primary/10`)
- 36px icon in teal
- Hover lift + shadow animation
- Staggered FadeUp with `delay={index * 0.15}`

---

### 9.7 `Portfolio.tsx` — Homepage Portfolio Grid

Three project cards showing work samples:

| Image (Unsplash) | Title | Category | Overlay Text |
|-------------------|-------|----------|--------------|
| Health/medical photo | Website Overhaul for HealthTech Innovators | Website Copy | Turned complex medical jargon into clear authority — 40% traffic boost. |
| Laptop/writing photo | Future of Work Thought Leadership | Ghostwriting | 10-part series — 50K+ LinkedIn views, two major speaking gigs. |
| Email/marketing photo | E-Commerce Email Conversion Flow | Email Marketing | 35% open rates, 15% more monthly sales. |

**Hover effect:** Dark overlay (75% opacity) slides in revealing the overlay text.

"View More Work" link at the bottom (links to `/work` — currently a dead route).

---

### 9.8 `AboutTeaser.tsx` — Homepage "Who is Meenakshi?" Section

Centered text section (`max-w-[750px]`):
- Heading: "So, who exactly is Meenakshi?"
- Two paragraphs of personal bio
- CTA button: "READ THE WHOLE STORY" → `/about`

---

### 9.9 `BookBanner.tsx` — Homepage Book Promotion

Card with `rounded-3xl` containing:
- **Left:** A coral-colored book placeholder (220×320px) with gentle float animation, slightly rotated (-2°)
- **Right:** "FRESH OFF THE PRESS!" eyebrow, book title, description, "BUY YOUR COPY NOW" CTA → `/buy`
- Note about audiobook coming soon

---

### 9.10 `Podcast.tsx` — Homepage Podcast Section

Centered section with:
- Heading: "Conversations actually worth eavesdropping on."
- Description of TFM Shortcast podcast
- Two CTAs:
  - "WATCH ON YOUTUBE" (outlined) → YouTube channel
  - "LISTEN ON SPOTIFY" (filled) → Spotify show

**External links:**
- YouTube: `https://www.youtube.com/@TFMShortcast/videos`
- Spotify: `https://open.spotify.com/show/55C8g0qgxeROYP0X6m8inn`

---

### 9.11 `Testimonials.tsx` — Homepage Testimonial Carousel

**Auto-rotating carousel** cycling through 5 testimonials every 6 seconds:

| Quote | Author |
|-------|--------|
| "Working with Meenakshi was the best content decision..." | Rohan K., Marketing Director, TechFlow |
| "Her book genuinely changed how I approach freelancing..." | Ananya S., Freelance Designer |
| "Her mentoring session was worth every minute..." | Vikram P., Content Strategist |
| "I handed her a chaotic brief, and she returned..." | Sarah L., E-commerce Founder |
| "Meenakshi is rare. She writes with empathy..." | Dr. Arvind T., Healthcare Consultant |

**Behaviors:**
- Pauses on hover
- Dot pagination (5 dots)
- Framer Motion slide transition (fade + slide)
- Large Quote icon (120px) at 10% opacity behind text

**Chat message strip below:** Three tilted chat bubble mockups:
- "The draft looks amazing! 🔥" (rotated -2°)
- "Just closed a deal thanks to that landing page!" (0°)
- "You nailed our brand voice instantly ✨" (2°)

---

### 9.12 `CTABand.tsx` — Homepage CTA Section

Simple centered CTA:
- Heading: "Alright, let's do this."
- Body text about services
- Two buttons: "BUY THE BOOK" (filled) and "SLIDE INTO MY INBOX" (outlined)

---

### 9.13 `Footer.tsx` — Site-Wide Footer

Three-column layout on desktop:
- **Left:** Logo + tagline "Writer. Author. Speaker. Podcaster. Professional Book Hoarder."
- **Center:** Email (`meenakshigirish31@gmail.com`) + Phone (`8754416226`)
- **Right:** 5 social media circles:

| Icon | Platform | URL |
|------|----------|-----|
| Linkedin | LinkedIn | `https://www.linkedin.com/in/meenakshi-girish/` |
| Instagram | Instagram | `https://www.instagram.com/meenakshigirish31/` |
| BookOpen | Bookstagram | `https://www.instagram.com/meenugirish31/` |
| Youtube | YouTube | `https://www.youtube.com/@TFMShortcast/videos` |
| Music2 | Spotify | `https://open.spotify.com/show/55C8g0qgxeROYP0X6m8inn` |

> [!NOTE]
> The Bookstagram link uses a `BookOpen` icon (not Instagram) to differentiate it from the personal Instagram account. This was a bug fix — originally both used the Instagram icon.

Copyright: "© 2025 Meenakshi Girish. All rights reserved."

Abstract decorations use the `Abstract elements/` path (with space), while most other components use `/abstract/` (no space). This is because the Footer references the source folder while other components reference the public folder.

---

### 9.14 `FadeUp.tsx` — Scroll Animation Wrapper

A simple Framer Motion wrapper that fades and slides content up when it enters the viewport.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Content to animate |
| delay | number | 0 | Animation delay in seconds |
| duration | number | 0.7 | Animation duration |
| y | number | 30 | Starting Y offset in pixels |
| className | string | '' | Additional CSS classes |

**Behavior:** `whileInView` triggers once, with `-50px` margin (triggers slightly before element enters viewport). Easing: `[0.16, 1, 0.3, 1]` (custom ease-out).

---

### 9.15 `AbstractDeco.tsx` — SVG Decoration Element

Renders SVG images as positioned decorative elements. All are `pointer-events-none`, `select-none`, `aria-hidden="true"`, `role="presentation"`, `draggable={false}`.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| src | string | required |
| className | string | '' |
| style | CSSProperties | undefined |
| opacity | number | 0.9 |

---

### 9.16 `SectionHeader.tsx` — Section Title Component

Renders a consistent eyebrow label + heading combination.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| label | string | required |
| heading | string | required |
| align | 'center' \| 'left' | 'center' |

**Structure:**
1. Eyebrow: Leaf icon + uppercase label in `text-xs text-primary tracking-[0.15em]`
2. Heading: Playfair bold italic, responsive `clamp(1.5rem, 3vw, 2.2rem)`
3. Bottom margin: `mb-14` (56px)

---

### 9.17 `PageHero.tsx` — Inner Page Hero Section

Reusable hero section used on all inner pages (About, Freelancing, Book, Speaking, Contact, Buy).

**Background:** Gradient from teal-tinted cream to plain cream:
```css
linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 50%, hsl(40 30% 97%) 100%)
```

**Abstract decorations:** Three SVGs positioned uniquely (Leaf1 top-right, Teal shape 1 bottom-left, Brown shape 2 mid-right).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| eyebrow | string | required |
| title | string | required |
| subtitle | string | required |
| ctaText | string | optional |
| ctaLink | string | optional |

**Padding:** `pt-28 pb-20` mobile, `pt-36 pb-28` desktop (accounts for BubbleMenu overlap).

**Animations:** Staggered entry — eyebrow (100ms), title (200ms), subtitle (350ms), CTA (500ms).

---

### 9.18 `CountUp.tsx` — Animated Number Counter

Animates a number from 0 to `end` using `requestAnimationFrame` with cubic ease-out.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| end | number | required |
| suffix | string | '' |
| label | string | required |
| duration | number | 2 |

**Visual:** Number in teal Playfair `clamp(2rem, 4vw, 3rem)`, label in muted Poppins `0.85rem`. Triggers on scroll intersection (`margin: '-80px'`, `once: true`).

---

### 9.19 `TiltCard.tsx` — 3D Tilt Effect Card

Mouse-follow tilt effect using CSS `perspective(1000px) rotateX/Y()`.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| children | ReactNode | required |
| className | string | '' |
| tiltAmount | number | 10 |

**Behavior:**
- Only activates on hover-capable devices (`matchMedia('(hover: hover)')`)
- Tracks mouse position relative to card center
- Applies `perspective(1000px) rotateY(Xdeg) rotateX(Ydeg)` transform
- 100ms ease on movement, 400ms ease-out on mouse leave (snaps back)
- Max tilt: ±`tiltAmount` degrees (default ±10°)

---

### 9.20 `TextReveal.tsx` — Word-by-Word Text Animation

Splits text into words and animates each one in sequence with blur-to-clear + slide-up effect.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| text | string | required |
| className | string | '' |
| as | 'h1' \| 'h2' \| 'h3' \| 'p' | 'h2' |
| style | CSSProperties | undefined |

**Animation per word:**
- Start: `opacity: 0, y: 20, filter: blur(4px)`
- End: `opacity: 1, y: 0, filter: blur(0px)`
- Duration: 500ms per word
- Stagger: 40ms between words
- Triggers `whileInView` once

**Layout:** `display: flex, flexWrap: wrap, gap: 0 0.3em, justifyContent: center`

---

### 9.21 `Marquee.tsx` — Infinite Horizontal Scroll

CSS-only infinite scroll marquee that duplicates content for seamless looping.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| children | ReactNode | required |
| speed | number | 30 |
| direction | 'left' \| 'right' | 'left' |
| pauseOnHover | boolean | true |
| className | string | '' |

**Implementation:**
- Duplicates `children` (one visible, one `aria-hidden`) for seamless loop
- CSS `mask-image` gradient fades content at both edges (5%→95%)
- `@keyframes marquee-scroll` translates from `0` to `-50%`
- Duration calculated: `(100 / speed) * 10` seconds
- Pauses on hover via JS (`animationPlayState: 'paused'`)
- Respects `prefers-reduced-motion`

---

### 9.22 `ExpandableCard.tsx` — Accordion Card

Click-to-expand card with animated height transition.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| title | string | required |
| icon | ReactNode | optional |
| children | ReactNode | required |
| defaultOpen | boolean | false |

**Visual:**
- Card background: `var(--color-card)`
- 16px border-radius, 1px border
- Button row: icon (40×40px, teal background) + title (Playfair bold italic 1.05rem) + ChevronDown (rotates 180° on open)
- Content area: spring animation for height (`stiffness: 300, damping: 30`), 200ms opacity

---

### 9.23 `RevealImage.tsx` — Curtain Wipe Image Reveal

Image that reveals with a colored curtain wiping away from right to left.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| src | string | required |
| alt | string | required |
| className | string | '' |
| revealColor | string | `hsl(175 35% 60%)` |

**Animation:** Curtain `scaleX` from 1→0 with `transformOrigin: 'right center'`. Duration: 800ms, easing: custom ease-out, 100ms delay. Triggers on scroll intersection.

---

### 9.24 `CurvedLoop.tsx` + `CurvedLoop.css` — Curved Text Marquee

Animated text following a curved SVG path. Interactive (draggable).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| marqueeText | string | required |
| speed | number | 2 |
| curveAmount | number | 300 |
| direction | 'left' \| 'right' | 'left' |
| interactive | boolean | true |
| className | string | '' |

**SVG Path:** Creates a sinusoidal curve via `M -200 midY Q 500 top 1000 mid Q 1500 bottom 2200 midY` (approximate). ViewBox: `0 0 2000 H` where H depends on curveAmount.

**Text is repeated 6 times** to fill the path.

**CSS:**
- Text: Playfair 3rem bold italic, fill `hsl(175 35% 60%)`
- Container: `cursor: grab` / `cursor: grabbing`
- SVG: 200% width, min-height 120px
- Mobile: Font shrinks to 2rem, min-height 80px

---

### 9.25 `CircularGallery.tsx` + `CircularGallery.css` — 3D Rotating Gallery

CSS 3D carousel with drag/scroll interaction.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| items | `{ image: string; text: string }[]` | required |
| bend | number | 2 |
| textColor | string | '#ffffff' |
| borderRadius | number | 0.15 |
| scrollSpeed | number | 3 |
| scrollEase | number | 0.1 |

**Implementation:**
- Items are positioned in a 3D circle using `rotateY(angle) translateZ(radius)` with `preserve-3d`
- Radius: `380 * bend` pixels
- Smooth animation loop with lerp (`currentRotation += (target - current) * scrollEase`)
- Wheel scroll and pointer drag both control rotation
- Each item: 260×200px image with rounded corners + label below

**CSS:**
- Track: `perspective: 1200px`
- Items: `backface-visibility: hidden`
- Image shadow: `0 8px 30px rgba(0,0,0,0.3)`
- Hint text at bottom: "Drag or scroll to explore" with pulsing opacity
- Mobile: Items shrink to 200×150px

---

### 9.26 `DomeGallery.tsx` + `DomeGallery.css` — 3D Dome Photo Gallery

Spherical 3D gallery with drag interaction and lightbox.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| images | `(string \| { src: string; alt?: string })[]` | required |
| grayscale | boolean | false |
| fit | number | 0.5 |
| padFactor | number | 0.2 |
| overlayBlurColor | string | `hsl(40 30% 97%)` |
| imageBorderRadius | string | '16px' |

**Key implementation details:**
- Images are distributed on a hemisphere using rows/columns algorithm
- Row angles: -20° to 40°, column angles: -60° to 60°
- Radius: `300 * fit`
- Auto-rotation: 0.08°/frame when no user interaction
- Drag: `@use-gesture/react` `useDrag` hook with velocity and friction (0.95 decay)
- Rotation X clamped: -60° to 20°
- Click opens a fullscreen lightbox (dark overlay + enlarged image)
- Edge fade: radial gradient from transparent center to `overlayBlurColor`

**CSS:**
- Items: 180×140px (130×100px on mobile)
- Hover: `z-index: 10`, `scale(1.08)`
- Lightbox: Fixed overlay, `rgba(0,0,0,0.7)` + 8px backdrop blur
- Hint: "Drag to explore" with pulsing opacity

---

### 9.27 `Header.tsx` — Legacy Header (NOT USED)

> [!WARNING]
> This component exists in the codebase but is **NOT imported or rendered anywhere**. It was the original header before being replaced by `BubbleMenu`. It's kept as a reference but is dead code.

---

## 10. Pages (8 total)

### 10.1 Home Page (`/`)

Composed in `App.tsx` as `<HomePage>` — a sequence of 10 components (see Section 8).

---

### 10.2 About Page (`/about`) — "The Storyteller"

**File:** [AboutPage.tsx](file:///c:/Users/Charles/Desktop/Projects/Meenakshi website/meenakshi-vite/src/pages/AboutPage.tsx)

**Accent:** Warm terracotta `hsl(15 55% 70%)`

**Section flow:**

| # | Section | Background | Content |
|---|---------|------------|---------|
| 1 | PageHero | Cream gradient | Eyebrow: "The girl behind the keyboard", Title: "Just a girl, a borderline-concerning number of books, and a freelancing career built from scratch.", Subtitle: long bio paragraph |
| 2 | My Story + Portrait | `bg-background` | **Flipped layout** (text LEFT, image RIGHT). 3 paragraphs of personal story. Portrait: 340×440px `rounded-3xl` rectangle |
| 3 | CurvedLoop Band | `bg-background` | Text: "Writer ✦ Author ✦ Speaker ✦ Podcaster ✦ Mentor ✦ Book Lover ✦", speed 2, curveAmount 200 |
| 4 | Fun Facts | `bg-card` | 4 staggered masonry cards with varying top margins (0, 40px, 20px, 60px) |
| 5 | What I Do | `bg-background` | 6 items in a desktop timeline (center line + alternating cards), stacked on mobile |
| 6 | Industries | Teal gradient | Marquee of 10 industry tags: Healthcare, E-Commerce, B2B Corporate, Personal Brands, Startups, Education, Publishing, Lifestyle, Tech, Finance |
| 7 | CTA Band | Coral-to-teal gradient | `linear-gradient(135deg, hsl(15 55% 65%) 0%, hsl(175 35% 55%) 100%)` with white text/buttons |

**Fun Facts data:**

| Icon | Title | Accent Color |
|------|-------|-------------|
| PenLine | "I am a writer first." | `hsl(175 35% 55%)` |
| BookOpen | "I read. A lot." | `hsl(35 55% 55%)` |
| Mic2 | "I was freelancing before it was cool." | `hsl(200 40% 55%)` |
| Users | "I love a good 'Aha!' moment." | `hsl(320 30% 55%)` |

**What I Do data:**

| Icon | Label | Description |
|------|-------|-------------|
| PenLine | Freelance Content Writing | "Websites, blogs, SEO, newsletters..." |
| BookHeart | Author | "I wrote The Freelancer's Mindset..." |
| Mic2 | Podcaster | "I host TFM Shortcast..." |
| Users | Public Speaker | "I've spoken all over South India..." |
| Leaf | Mentor | "1-on-1 and group sessions..." |
| Instagram | Book Reviewer | "You can find me over on Instagram..." |

---

### 10.3 Freelancing Page (`/freelancing`) — "The Professional"

**File:** [FreelancingPage.tsx](file:///c:/Users/Charles/Desktop/Projects/Meenakshi website/meenakshi-vite/src/pages/FreelancingPage.tsx)

**Accent:** Rich blue `hsl(200 40% 55%)`

**Section flow:**

| # | Section | Background |
|---|---------|------------|
| 1 | PageHero | Cream gradient |
| 2 | Stats Bar | `bg-card` with border-y |
| 3 | Intro + Portrait | `bg-background` (image LEFT, text RIGHT) |
| 4 | Services Grid | `bg-card` |
| 5 | CircularGallery | `hsl(210 25% 15%)` (dark) |
| 6 | Niches | Teal gradient |
| 7 | Process Steps | `bg-background` |
| 8 | Testimonials | `bg-card` |
| 9 | CTA Band | Blue-tinted gradient |

**10 Services:**
Website Content Writing, Blog & Article Writing, SEO Content Writing, Social Media Content, Newsletters & Email Content, Ghostwriting, Ads & Copywriting, Technical Writing, Personal Branding, The Fun Offline Stuff

**5 Process Steps:**
01 We Chat → 02 The Proposal → 03 I Go Cave-Mode → 04 We Tweak → 05 You Launch

**10 Industry Niches:**
Healthcare, E-Commerce, B2B & Corporate, Education, Lifestyle & Wellness, Tech, Personal Finance, Startups, Publishing, Hospitality (each 130×110px chip with icon)

**CircularGallery items:** 6 portfolio images from `/images/portfolio/`: website.png, blog.png, social.png, newsletter.png, seo.png, copywriting.png

**Testimonials:**
| Quote | Author | Role |
|-------|--------|------|
| "Meenakshi doesn't need to be micromanaged..." | Sneha Mohan | E-Commerce Founder |
| "She overhauled our website and enquiries shot up..." | Arjun Kapoor | SaaS Startup, Bangalore |
| "Accurate, clear, and perfectly written..." | Dr. Lakshmi Nair | HealthVista Digital |

---

### 10.4 Book Page (`/the-book`, `/book`) — "The Showcase"

**File:** [BookPage.tsx](file:///c:/Users/Charles/Desktop/Projects/Meenakshi website/meenakshi-vite/src/pages/BookPage.tsx)
**Total Lines:** 312

**Accent:** Warm gold `hsl(45 60% 55%)`
**Signature element:** TiltCard book cover + ExpandableCard chapters

**PageHero:**
- Eyebrow: "Fresh Out of the Oven"
- Title: "The Freelancer's Mindset"
- Subtitle: "The book I wrote because nobody handed me a manual when I needed one. Look, this isn't a boring textbook. It's the honest, slightly messy, totally real story of how I built my freelancing career from zero. Part memoir, part survival guide, and entirely real."
- CTA: "Get Your Hands on a Copy" → `/buy`

**Section flow:**

| # | Section | Background | Content |
|---|---------|------------|---------|
| 1 | PageHero | Cream gradient | As above |
| 2 | Book Showcase | `bg-background` | TiltCard (tiltAmount=12) with book cover image LEFT (280–340px), book description RIGHT |
| 3 | Audiobook Banner | Warm gradient | BookHeart icon + "Coming Soon!" badge + description + "Notify Me" button |
| 4 | What's Inside | `bg-card` | 6 ExpandableCards (first open by default) |
| 5 | Who Is This For | `bg-background` | TextReveal heading + 3 TiltCards in grid |
| 6 | What Makes It Different | Teal gradient | 2×2 grid of differentiator cards |
| 7 | Marquee Band | `bg-card` | 8 words with ✦ separators, speed=20, direction="right" |
| 8 | About the Author | `bg-background` | Text LEFT, squircle portrait RIGHT |
| 9 | Testimonials | `bg-card` | 3 reader review cards |
| 10 | Buy CTA | Gold-to-teal gradient | "Grab your copy!" heading |

**What's Inside (ExpandableCard content):**
1. "The completely unfiltered story of my first few years (spoiler: it was chaotic)."
2. "The exact workflows, templates, and systems I use to run my business today."
3. "No-BS advice on how to find clients, send pitches, and not underprice yourself."
4. "Interviews with other real freelancers—so you don't just have to listen to me!"
5. "Gorgeous, original artworks created just for this book. (It's pretty to look at, I promise.)"
6. "A massive dose of encouragement from someone who's been exactly where you are right now."

**Who Is This For (3 audience cards):**

| Icon | Title | Accent |
|------|-------|--------|
| Sparkles | "The 'Where Do I Even Start' Beginner." | `hsl(175 35% 55%)` |
| Heart | "The 'I'm About to Quit' Freelancer." | `hsl(35 55% 55%)` |
| Users | "The 'Get Me Out of This Cubicle' Pro." | `hsl(200 40% 55%)` |

**Differentiators (4 cards):**

| Icon | Label | Description |
|------|-------|-------------|
| Heart | "It's Personal." | "You're getting the real, messy highs and lows..." |
| Users | "It's Collaborative." | "Real voices from other working freelancers..." |
| Palette | "It's Artsy." | "Original artwork makes the reading experience..." |
| Coffee | "It's Friendly." | "I wrote this like I was talking to a friend over coffee..." |

**Marquee words:** Honest, Practical, Funny, Beautiful, Real, Actionable, Heartfelt, Inspiring

**Author Section:** Squircle-shaped portrait (`borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'`), 230–260px, with bio text and "Read More About Meenakshi →" link to `/about`.

**Testimonials:**

| Quote | Author | Role |
|-------|--------|------|
| "Finally, a freelancing book written by someone who actually gets the struggle!" | Priya Sundaram | Copywriter & Freelancer |
| "The artworks are gorgeous, but the advice inside is what I keep coming back to." | Arun Balaji | UX Writer, Chennai |
| "I literally handed this to my entire team..." | Kavitha Rao | Marketing Manager |

**CTA gradient:** `linear-gradient(135deg, hsl(35 55% 55%) 0%, hsl(175 35% 55%) 100%)`

---

### 10.5 Speaking Page (`/speaking`) — "The Energizer"

**File:** [SpeakingPage.tsx](file:///c:/Users/Charles/Desktop/Projects/Meenakshi website/meenakshi-vite/src/pages/SpeakingPage.tsx)
**Total Lines:** 360

**Accent:** Vibrant magenta `hsl(320 45% 60%)`
**Signature element:** DomeGallery event photos + CountUp stats

**PageHero:**
- Eyebrow: "Speaking & Mentoring"
- Title: "Because sometimes, I actually like leaving my desk."
- Subtitle: "Writing is how I think, but speaking is how I connect. Over the years, I've dragged myself away from my laptop..."
- CTA: "Book My Brain" → `/contact`

**Section flow:**

| # | Section | Background | Content |
|---|---------|------------|---------|
| 1 | PageHero | Cream gradient | As above |
| 2 | Stats Bar | Teal-to-cream gradient | 4 CountUp stats |
| 3 | Speaking Intro | `bg-background` | TextReveal heading + 2 paragraphs + diamond-shaped portrait |
| 4 | Speaking Topics | `bg-card` | 4 ExpandableCards |
| 5 | DomeGallery | `hsl(40 30% 95%)` | 6 mentoring photos in 3D dome |
| 6 | Audience | `bg-background` | 6 pill tags showing audience types |
| 7 | Mentoring | Teal gradient | Side-by-side comparison cards |
| 8 | Toastmasters | `bg-background` | Warm gradient shoutout card |
| 9 | Testimonials | `bg-card` | 3 rotated/staggered review cards |
| 10 | CTA Band | Magenta-to-teal gradient | "Let's get you moving." |

**Stats (CountUp):**

| Number | Label |
|--------|-------|
| 1,000+ | Students Mentored |
| 50+ | Talks Delivered |
| 30+ | Colleges Visited |
| 4 | Core Topics |

**Speaking Topics (ExpandableCard):**

| Icon | Title | Accent |
|------|-------|--------|
| Briefcase | "Freelancing in the Real World" | `hsl(175 35% 55%)` |
| PenLine | "Content Writing as a Legit Career" | `hsl(35 55% 55%)` |
| UserIcon | "Building Your Personal Brand" | `hsl(200 40% 55%)` |
| MessageCircle | "Communication 101" | `hsl(320 30% 55%)` |

**DomeGallery:** 6 images from `/images/mentoring/event1.png` through `event6.png`. Props: `grayscale={false}`, `fit={0.55}`, `padFactor={0.12}`, `overlayBlurColor="hsl(40 30% 95%)"`, `imageBorderRadius="16px"`. Container height: `600px`.

**Audiences (pill tags):** College Students, Uni Events, Founders & Biz Owners, Toastmasters, Creator Communities, Online Webinars

**Mentoring Comparison Cards:**
- **Left card** (teal gradient bg): "You should book a call if:" — 4 checklist items about being confused about freelancing, monetizing writing, robot brand voice, broke/burnt out
- **Right card** (warm gradient bg): "What we'll actually do:" — 5 checklist items about figuring out blockers, setting goals, fixing portfolio, pricing, content creation
- CTA buttons: "Book a Mentoring Session" (links to topmate.io) + "Ask Me a Question First" (→ `/contact`)

**Portrait treatment:** Diamond-ish shape with `rounded-[2rem_1rem_2rem_1rem]`, rotated 3°, 260×320px

**Testimonials:**

| Quote | Author | Role |
|-------|--------|------|
| "She spoke at our college and the students were actually awake..." | Prof. Ramya Venkatesh | SRM University |
| "One mentoring call with Meenakshi gave me a clearer roadmap..." | Deepika Raj | Freelance Designer |
| "Her content writing workshop totally shifted how our team writes..." | Vikram Iyer | Head of Content, TechBridge |

**CTA gradient:** `linear-gradient(135deg, hsl(320 30% 45%) 0%, hsl(175 35% 55%) 100%)`

---

### 10.6 Contact Page (`/contact`) — "The Connector"

**File:** [ContactPage.tsx](file:///c:/Users/Charles/Desktop/Projects/Meenakshi website/meenakshi-vite/src/pages/ContactPage.tsx)
**Total Lines:** 235

**Accent:** Warm green `hsl(140 35% 55%)`
**Signature element:** CurvedLoop + TiltCard social cards

**PageHero:**
- Eyebrow: "Let's Talk"
- Title: "Got something on your mind? Slide into my inbox."
- Subtitle: "Want to hire me? Book me for a talk? Need a mentor? Or just have a burning question about the book? You're in the right place. I read every single message myself (no bots here!)."

**Section flow:**

| # | Section | Background | Content |
|---|---------|------------|---------|
| 1 | PageHero | Cream gradient | As above |
| 2 | CurvedLoop | Height 140px | "Hello ✦ Let's Create Something Amazing ✦ Let's Work Together ✦ Got a Project? ✦" |
| 3 | Two CTA Cards | `bg-background` | Email/WhatsApp card + Buy Book card |
| 4 | Contact Form | Teal gradient | Full form with TextReveal heading on desktop |
| 5 | Social Cards | `bg-background` | 5 TiltCards for LinkedIn, 2× Instagram, YouTube, Spotify |

**CurvedLoop props:** `speed={2}`, `curveAmount={160}`, `direction="right"`, `interactive={false}`, `className="text-primary/30"`

**Two CTA Cards:**

1. **"For the serious (and fun) stuff"** — Teal gradient strip
   - Mail icon (28px)
   - "If you want to hire me to write, invite me to your event, or book a 1-on-1 call, poke me here. I usually reply within 48 hours (unless I'm lost in a good book)."
   - CTA: "Email Me" → `mailto:hello@meenakshigirish.com`
   - CTA: "WhatsApp Me" → `https://wa.me/?text=Hey%20Meenakshi!`

2. **"Just want the book?"** — Gold gradient strip `hsl(35 55% 55%)`
   - MessageSquare icon
   - "Skip the small talk and head straight to the order form..."
   - CTA: "Buy The Book" → `/buy`

**Contact Form:**
- **Left sidebar (desktop only):** TextReveal "Drop it in this handy little box." + "No bots, just Meenakshi" with Heart icon
- **Fields:** Name*, Email*, Phone, Subject* (dropdown: Hire Me / Speaking & Mentoring / Book Stuff / Just saying hi), Message* (textarea, 5 rows)
- **Submit:** "Send It!" with Send icon
- **Success state:** "Message sent!" with "Send another message" button

**Social Cards (5 TiltCards):**

| Icon | Label | Description | Color | URL |
|------|-------|-------------|-------|-----|
| Linkedin | LinkedIn | "My professional-ish alter ego" | `hsl(210 60% 50%)` | linkedin.com/in/meenakshi-girish/ |
| Instagram | Instagram (Books) | "Where I geek out over my reading list" | `hsl(340 60% 55%)` | instagram.com/meenugirish31/ |
| Instagram | Instagram (Personal) | "Where I post about writing and life" | `hsl(290 50% 55%)` | instagram.com/meenakshigirish31/ |
| Youtube | YouTube | "Watch me ramble on TFM Shortcast" | `hsl(0 70% 55%)` | youtube.com/@TFMShortcast/videos |
| Music2 | Spotify | "Listen to me ramble on TFM Shortcast" | `hsl(140 60% 45%)` | open.spotify.com/show/55C8g0qgxeROYP0X6m8inn |

---

### 10.7 Buy Page (`/buy`) — "The Checkout"

**File:** [BuyPage.tsx](file:///c:/Users/Charles/Desktop/Projects/Meenakshi website/meenakshi-vite/src/pages/BuyPage.tsx)
**Total Lines:** 279

**Accent:** Coral `hsl(15 55% 65%)`
**Signature element:** Sticky order summary sidebar

**PageHero:**
- Eyebrow: "Order Your Copy"
- Title: "Get Your Hands on The Freelancer's Mindset"
- Subtitle: "Fill out the boring form below, pay the piper, and I'll make sure a fresh copy heads your way. Easy!"

**Section flow:**

| # | Section | Background | Content |
|---|---------|------------|---------|
| 1 | PageHero | Cream gradient | As above |
| 2 | Stats Strip | `bg-card` border-y | 3 CountUp stats |
| 3 | Book Details | `bg-background` | TiltCard cover + detail list |
| 4 | Marquee Band | `bg-card` border-y | 6 feature phrases with ★ separators |
| 5 | Order Form | Teal gradient | Multi-section form |
| 6 | Audiobook Banner | `bg-background` | Email signup for audiobook |

**Stats (CountUp):**

| Number | Label |
|--------|-------|
| 200+ | Copies Sold |
| 50+ | 5-Star Reviews |
| 100% | Handwritten Notes |

**Book Details:**

| Icon | Label | Value |
|------|-------|-------|
| BookHeart | Title | The Freelancer's Mindset |
| User | Author | Meenakshi Girish (Hey, that's me!) |
| Package | Format | Paperback (Audiobook in the oven) |
| MessageSquare | Language | English |
| MapPin | Available For | India (shipping) |

**Marquee words:** Real stories, Practical advice, Original artworks, No-BS guidance, Community interviews, Freelancing frameworks (with ★ separators)

**Order Form (3 sections):**
1. **Personal Information:** Full Name*, Email Address*, Phone Number*
2. **Shipping Address:** Address Line 1*, Address Line 2, City*, State*, PIN Code*, Country* (default: India)
3. **Order Details:** Number of Copies* (select: 1/2/3/5), Special Requests (placeholder: `'E.g., "Sign it!" or "Draw a cat"'`)
- Submit: "Complete My Order!" with Check icon

**Success state:** "Order received! 🎉" with mention of `meenakshigirish31@gmail.com` and "Place another order" button.

**Audiobook Banner:**
- Headphones icon (28px)
- Heading: "Hate reading? The audiobook is coming soon."
- Description: "Drop your email and I'll let you know when it drops!"
- Email input with "Keep Me Posted" button

---

## 11. Image Assets & Generation

### Hero Portrait
- **Path:** `/images/meenakshi-hero.png`
- **Size:** ~1.98MB
- **Usage:** Homepage About section (circular 340×340px), About page (rounded-3xl 340×440px), Freelancing page (rounded-2xl 320×400px)

### Book Cover
- **Path:** `/images/book-cover.png`
- **Size:** ~674KB
- **Generated:** Using AI image generation tool
- **Description:** Professional book cover for "The Freelancer's Mindset" with pastel teal watercolor art
- **Usage:** BookPage.tsx (TiltCard), BuyPage.tsx (sidebar)

### Portfolio Images (6)
All generated using AI, 1024×1024px each:

| File | Content | Size |
|------|---------|------|
| `/images/portfolio/website.png` | Website copy showcase | ~780KB |
| `/images/portfolio/blog.png` | Blog writing sample | ~922KB |
| `/images/portfolio/social.png` | Social media content | ~807KB |
| `/images/portfolio/newsletter.png` | Newsletter design | ~584KB |
| `/images/portfolio/seo.png` | SEO content visual | ~704KB |
| `/images/portfolio/copywriting.png` | Copywriting showcase | ~900KB |

### Mentoring/Event Images (6)
All generated using AI:

| File | Content | Size |
|------|---------|------|
| `/images/mentoring/event1.png` | College auditorium speaking | ~809KB |
| `/images/mentoring/event2.png` | Mentoring session | ~859KB |
| `/images/mentoring/event3.png` | Panel discussion | ~817KB |
| `/images/mentoring/event4.png` | Workshop session | ~883KB |
| `/images/mentoring/event5.png` | Toastmasters meeting | ~742KB |
| `/images/mentoring/event6.png` | Group photo with mentees | ~1MB |

### Abstract SVG Decorations (6)
Hand-crafted organic blob shapes in teal, brown, and green:
- `Leaf1.svg` (3.5KB), `Leaf2.svg` (4.4KB) — Botanical leaf illustrations
- `Teal shape 1.svg` (975B), `Teal shape 2.svg` (1.2KB) — Organic teal blobs
- `Brown shape 1.svg` (1KB), `Brown shape 2.svg` (1.1KB) — Organic brown blobs

These are served from both `/Abstract elements/` and `/abstract/` paths.

---

## 12. Third-Party Component Integrations

### From React Bits Library

Four components were adapted from the React Bits open-source component library:

#### 1. BubbleMenu
- **Original:** React Bits BubbleMenu (JavaScript + CSS)
- **Dependency:** `gsap`
- **Adaptations:**
  - Converted to TypeScript
  - Replaced `<a href>` with React Router `useNavigate()`
  - Added logo bubble with MG monogram
  - Customized hover colors per nav item (brand-aligned pastels)
  - Added active state detection via `useLocation()`
  - Overlay uses cream brand color instead of default

#### 2. CurvedLoop
- **Original:** React Bits CurvedLoop (JavaScript + CSS)
- **Adaptations:**
  - Converted to TypeScript
  - Removed `min-height: 100vh` (used as a band, not full-screen)
  - SVG fill color changed to brand teal
  - Font: Playfair Display 3rem
  - Interactive drag preserved

#### 3. CircularGallery
- **Original:** React Bits CircularGallery (JavaScript + CSS, uses OGL)
- **Dependency:** `ogl` (installed but current implementation is CSS 3D, not WebGL)
- **Adaptations:**
  - Converted to TypeScript with proper interfaces
  - CSS-only 3D transforms (not WebGL canvas)
  - Item dimensions: 260×200px
  - Custom text styling with Poppins font

#### 4. DomeGallery
- **Original:** React Bits DomeGallery (JavaScript + CSS)
- **Dependency:** `@use-gesture/react`
- **Adaptations:**
  - Converted to TypeScript
  - `overlayBlurColor` changed from dark (#120F17) to cream `hsl(40 30% 97%)`
  - `imageBorderRadius` set to `16px` (softer)
  - Added lightbox (click image → fullscreen view)
  - Auto-rotation speed reduced for subtlety
  - Edge fade uses cream color to blend with page

---

## 13. Brand Guidelines & Content Rules

### Voice & Tone
- **First person, conversational, witty**
- Talks directly to the reader ("you", "we")
- Self-deprecating humor: "Professional Book Hoarder", "a few minor typos"
- Avoids corporate jargon — replaces it with casual language
- Uses em-dashes, ellipses, parenthetical asides
- Indian English spelling ("favourite", "honour")

### Content Examples
- CTA buttons are playful: "Stalk My Services", "Book My Brain", "Slide Into My Inbox"
- Section labels are conversational: "PEOPLE SAYING NICE THINGS", "WHAT I BRING TO THE TABLE"
- Headings use humor: "Words in Action (Yes, I actually do work)"

### Visual Rules
- **Every section** has at least 2 AbstractDeco SVGs positioned uniquely
- **No two adjacent sections** share the same background color
- Backgrounds alternate: `bg-background` ↔ `bg-card` ↔ gradient variants
- **Cards always have:** rounded corners, subtle shadow, hover lift
- **Buttons:** Always pill-shaped (`rounded-full`), uppercase, letter-spaced
- **Icons:** From lucide-react only, sized consistently (14px for labels, 20-36px for cards)

---

## 14. SEO & Accessibility

### SEO
- `<title>`: "Meenakshi Girish — Writer, Author, Speaker & Mentor"
- `<meta name="description">`: Full description of services
- `<meta property="og:*">`: Open Graph tags for social sharing
- `<meta name="twitter:card">`: Twitter card support
- Semantic HTML: `<main>`, `<section>`, `<nav>`, `<footer>`, `<header>`
- Single `<h1>` per page (via PageHero)
- Proper heading hierarchy (h1 → h2 → h3)

### Accessibility
- **Skip link:** "Skip to content" as first focusable element
- **Focus ring:** 2px solid teal with 2px offset on `:focus-visible`
- **ARIA labels:** All buttons have `aria-label`, BubbleMenu has `aria-expanded`
- **Navigation:** `role="navigation"` + `aria-label="Main navigation"` on overlay
- **Images:** All have `alt` text (decorative ones have `alt=""` + `aria-hidden="true"`)
- **Keyboard:** Escape closes BubbleMenu, Enter/Space activates DomeGallery items
- **Motion:** `prefers-reduced-motion` respected in Marquee, CurvedLoop, BubbleMenu, DomeGallery
- **Touch targets:** All buttons minimum 44px height via `min-height: 44px` or `min-height: 48px`

---

## 15. Visual Audit & Bug Fixes

### Audit Process
1. Screenshots taken at every scroll position across all 8 pages (desktop 1440×900 + mobile 390×844)
2. Python Playwright script used for automated screenshots
3. Each screenshot analyzed for: alignment, colors, overlapping, scaling, animations, interactivity
4. 19 issues identified in first audit

### All 19 Fixes Applied

| # | Issue | Fix | File |
|---|-------|-----|------|
| 1 | `/book` route missing | Added route alias | App.tsx |
| 2 | Broken Unsplash image URL (404) | Replaced with working URL | Portfolio.tsx |
| 3 | CircularGallery images verified | All 6 load correctly | — |
| 4-5 | Placeholder book cover icon instead of real image | Generated real book cover | BookPage.tsx, BuyPage.tsx |
| 6 | TextReveal heading not centered | Added `justifyContent: 'center'` + style prop | TextReveal.tsx |
| 7-8 | Placeholder testimonial names ("Client Name") | Replaced with realistic Indian names | FreelancingPage, SpeakingPage, BookPage |
| 9 | DomeGallery too small | Height 500→600px, fit 0.45→0.55 | SpeakingPage.tsx |
| 10 | Mentoring cards look identical | Added distinct gradient backgrounds | SpeakingPage.tsx |
| 11 | Marquee no edge fade | Added CSS mask-image gradient | Marquee.tsx |
| 12 | CurvedLoop text clipped on Contact page | Height 120→140px, curveAmount 200→160 | ContactPage.tsx |
| 13 | Niche chips inconsistent sizes | Unified to 130×110px | FreelancingPage.tsx |
| 14 | Footer duplicate Instagram icons | Changed Bookstagram to BookOpen icon | Footer.tsx |
| 15-19 | Various minor alignment and spacing issues | Fixed on per-page basis | Various |

### Verification Result
- **8/8 pages** render without errors
- **0 broken images** across all pages
- **0 console errors**
- All interactive components functional

---

## 16. Running the Project

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup
```bash
cd "c:\Users\Charles\Desktop\Projects\Meenakshi website\meenakshi-vite"
npm install
```

### Development Server
```bash
npm run dev
```
Server typically starts on `http://localhost:5173` or `http://localhost:5174`.

### Production Build
```bash
npm run build
```
Outputs to `dist/` directory.

### Font Setup
The "Anti Design Endeavour" font must be downloaded manually:
1. Visit: https://befonts.com/anti-design-endeavour-font.html
2. Download the font files
3. Place as: `public/fonts/Anti Design Endeavour.ttf`

Without this font, the hero "MEENAKSHI" text falls back to the default serif stack.

### Video Asset
The hero video (`/video/hero-landscape.mp4`) must be present in `public/video/`. This is not generated — it's a provided asset.

---

> [!TIP]
> This walkthrough covers every file, every color value, every animation timing, every content string, and every design decision in the project. Use the Table of Contents to jump to specific sections as needed.
