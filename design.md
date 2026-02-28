# 🎨 TrustAudit UI System

Flat Light Mode – Drag & Drop Design Guide

Inspired by the Creative Flat Theme (Uploaded Reference)

## 🧠 Overview

This document defines a component-driven, token-based flat design system for building the TrustAudit app.

**Design Goals:**

- Flat Light Mode
- High contrast typography
- Playful geometric accents
- Clean structured layout
- CRAP principles enforced
- Accessible (WCAG AA+ baseline)
- Modern 2025 startup aesthetic
- Zero clutter

---

## 🏛️ PART 0 — DESIGN PHILOSOPHY (CRAP PRINCIPLES)

Every design decision in TrustAudit must pass through the CRAP framework.

### C — Contrast

- Create clear visual hierarchy through size, weight, color, and spacing
- Use contrast to guide user attention to primary actions and key content
- Ensure 4.5:1 minimum contrast ratio for text (7:1 for premium body content)
- Layer contrasts: color + size + weight for maximum impact
- Headlines: High contrast, large, bold against soft beige background
- CTAs: Maximum contrast — accent-green on beige, distinct from secondary outline-black
- Each hierarchy level must be distinctly different — no ambiguity

### R — Repetition

- Establish consistent design patterns throughout the experience
- Repeat design tokens (colors, fonts, spacing values) across all components
- Build visual rhythm — all cards, buttons, forms follow the same flat treatment
- Interaction patterns (hover states, transitions) are predictable and consistent
- Component consistency is non-negotiable: if one card has 24px padding, all do

### A — Alignment

- Everything aligns to the 8px grid — nothing is arbitrary
- Use alignment to create visual connections between elements
- Strong vertical and horizontal rhythms guide the eye
- Left-align body content for optimal readability
- Center alignment sparingly (hero headline, section titles only)
- Intentional breaks in alignment create emphasis, not chaos

### P — Proximity

- Group related elements together to show relationships
- Use whitespace to separate unrelated content
- Create visual "chunks" of information for cognitive ease
- Related form fields grouped together (tight 8–16px gaps)
- Generous margin between sections (64–96px desktop, 48–64px mobile)
- Whitespace is a design element, not empty space

---

## 🧱 PART 1 — DESIGN TOKENS

### 🎨 Color System

**Backgrounds**

```css
--bg-primary: #f4efe7; /* Soft beige base */
--bg-card: #ffffff;
--bg-accent-soft: #fce8ec; /* Soft pink circle tone */
```

**Typography Colors**

```css
--text-primary: #111111;
--text-secondary: #4a4a4a;
--text-muted: #7a7a7a;
```

**Accent Palette (Flat Pops)**

```css
--accent-green: #a3e635;
--accent-coral: #f97316;
--accent-blue: #2563eb;
--accent-yellow: #facc15;
--accent-black: #000000;
```

**Borders**

```css
--border-light: #e5e5e5;
--border-dark: #111111;
```

**60-30-10 Color Rule**

- 60% → `--bg-primary` (beige — background, large surfaces)
- 30% → `--bg-card` + `--bg-accent-soft` (white cards, pink accents)
- 10% → Accent pops (`--accent-green`, `--accent-coral`, `--accent-blue`)
- Never let accents exceed 10% — they must shock, not overwhelm

**Color Psychology — TrustAudit Context**

- Green (`--accent-green`): Action, success, trust — used for primary CTAs and PASS states
- Coral (`--accent-coral`): Energy, alert — used for FAIL states and attention markers
- Blue (`--accent-blue`): Trust, professionalism — used for progress bars, active states
- Yellow (`--accent-yellow`): Warmth, optimism — used sparingly for highlights
- Black (`--accent-black`): Authority, seriousness — used for headlines and borders

**Accessibility Rules**

- Body text contrast ≥ 7:1 (premium standard, not just AA baseline)
- Large text ≥ 4.5:1
- Interactive elements must exceed 4.5:1
- Non-text elements (icons, borders) ≥ 3:1
- Never use pure #FFFFFF without soft context
- Validate against color blindness (8% of males affected)
- Test contrast on actual beige background, not assumed white

---

### 🔤 Typography System

**Primary Font:** Inter
**Display Font:** Syne or Cabinet Grotesk

**Type Scale**

| Element | Size (Desktop) | Size (Mobile) | Weight | Notes           |
| ------- | -------------- | ------------- | ------ | --------------- |
| H1      | 56px           | 40px          | 700    | -1px tracking   |
| H2      | 40px           | 32px          | 600    |                 |
| H3      | 28px           | 24px          | 600    |                 |
| Body    | 18px           | 16px          | 400    | Line-height 1.7 |
| Small   | 14px           | 14px          | 400    | Captions only   |

**Rules**

- Headlines bold and compact — display font (Syne) for impact
- Body relaxed and readable — Inter for clarity
- Buttons uppercase with 0.08em letter-spacing
- Labels uppercase with 0.1em letter-spacing
- Max two font families — no exceptions
- Line-height: 1.7 for body, 1.2 for headlines
- Never go below 14px for any text

**Font Loading Strategy**

- Use `font-display: swap` to prevent invisible text (FOIT)
- Preload display font (Syne) in `<head>`
- Inter via Google Fonts with `&display=swap`
- Subset fonts to Latin characters for performance

---

### 📐 Spacing System (8px Grid)

| Type            | Size |
| --------------- | ---- |
| Micro           | 4px  |
| Tight           | 8px  |
| Default         | 16px |
| Component Gap   | 24px |
| Section Padding | 32px |
| Section Space   | 64px |
| Major Sections  | 96px |

Everything must align to this 8px system. No arbitrary values.

**Container Widths**

- Max content width: 1280px
- Comfortable reading: 680px
- Full-bleed sections: 100vw with 32px side padding (24px mobile)
- Hero split layout: 50/50 or 60/40

---

### 📱 Responsive Breakpoints

```
Mobile:        320px – 767px
Tablet:        768px – 1023px
Desktop:       1024px – 1439px
Large Desktop: 1440px+
```

---

## 🧩 PART 2 — DRAG & DROP COMPONENT LIBRARY

Each component follows:

```
DRAG: [Component]
STYLE: [Variant]
OPTIONS: [Modifiers]
```

### 🟩 1️⃣ HeroBlock

**Layout**

- 50% Text (Left)
- 50% Flat Illustration (Right)

**Structure**

- Headline
- Subtext
- Primary CTA
- Secondary CTA

**Styling Rules**

- H1: 56px bold black (Syne display font)
- Max text width: 580px
- Primary CTA: Accent Green, uppercase, 0.08em tracking
- Secondary CTA: Outline black, 1px border
- Border radius: 8px
- Hover scale: 1.02
- No heavy shadow
- Soft organic circle background (pink `#FCE8EC`)

**CRAP Check:**

- Contrast: 56px bold headline vs 18px body — ✓
- Repetition: Accent green CTA matches design system — ✓
- Alignment: All text left-aligned, grid-aligned — ✓
- Proximity: Headline + subtext grouped (16px gap), CTA separate (32px gap) — ✓

---

### 🟦 2️⃣ StepperHorizontal

**Used for:**

```
[Input] → [AI Audit] → [On-Chain Record] → [Verified]
```

**Style Rules**

- Circle size: 40px
- Border: 2px black
- Active: Green fill (`--accent-green`)
- Completed: Coral fill (`--accent-coral`)
- Inactive: White with border
- Connector: 2px grey line (`--border-light`)
- Flat design only — no shadow, no gradient
- Step labels: 14px uppercase, 0.1em tracking

---

### 🟨 3️⃣ ScoreCard

**Structure**

- Title
- Progress Bar
- Score %
- Verdict Badge

**Styling**

- Card background: white (`--bg-card`)
- Padding: 24px
- Border: 1px neutral (`--border-light`)
- Border radius: 8px
- Progress height: 12px, radius: 6px
- Accent blue fill (`--accent-blue`)
- PASS → green badge (`--accent-green`, black text)
- FAIL → coral badge (`--accent-coral`, white text)
- No drop shadow

---

### 🟪 4️⃣ BentoGrid (Dashboard)

**Layout**

- 3 columns desktop
- 2 tablet
- 1 mobile
- Asymmetric card heights allowed
- Gap: 24px (component gap token)

**Card Rules**

- White background
- 1px border (`--border-light`)
- 24px padding
- 8px border radius
- Optional geometric accent (circles, dots)
- No drop shadows

---

### 🟧 5️⃣ FormCard

**Structure**

- Label
- Input
- Helper Text
- Button

**Rules**

- Input height: 52px
- Border: 1px `--border-light`
- Focus: 2px `--accent-blue` outline
- Radius: 8px
- Comfortable spacing (16px between fields)
- Full width on mobile
- Clear labels above fields (14px, `--text-secondary`)
- Inline validation with friendly messages
- Focus states with accent color ring
- Autocomplete support for common fields

---

### 🟩 6️⃣ BlockchainBadge

**Style**

- Pill shape (24px+ border-radius)
- Icon left (shield or checkmark)
- Uppercase text, 0.08em tracking
- Soft green background (`--accent-green` at 20% opacity)
- 1px green border
- Hover scale 0.98
- 14px font size

---

### 🟦 7️⃣ Button System

**Hierarchy**

| Level     | Style                                  | Usage                     |
| --------- | -------------------------------------- | ------------------------- |
| Primary   | Accent Green fill, black text          | Main CTAs (Submit, Audit) |
| Secondary | Outline black, 1px border, transparent | Secondary actions         |
| Tertiary  | Text-only, underline on hover          | Links, minor actions      |

**Shared Rules**

- Padding: 12px 32px minimum (touch-friendly)
- Border radius: 8px
- Uppercase, 0.08em letter-spacing
- Height: 48px minimum
- Hover: scale(1.02), 200ms ease
- Active: scale(0.98)
- Focus: 2px `--accent-blue` outline at 2px offset
- No gradients, no shadows

---

## 🎭 PART 3 — Visual Accent System

Inspired by the reference image:

**Allowed:**

- Abstract circles (solid flat fills)
- Semi rectangles
- Dot grids (small, decorative)
- Organic blobs (flat, single color)
- Leaf/floral flat illustrations
- Geometric pattern blocks

**Rules:**

- Flat fills only — no gradients, no mesh
- No heavy shadows — zero `box-shadow` on accents
- Max 3 accent colors per viewport
- Use whitespace generously — accents breathe in space
- Accents are decorative, never over content
- Organic circles sit behind content (z-index lower)
- Pink circles (`--bg-accent-soft`) as primary background accents

---

## 🎬 PART 4 — INTERACTION & ANIMATION SYSTEM

### Micro Interactions

- Hover scale: 1.02 (buttons, cards)
- 200ms ease transition (all interactive elements)
- No bounce effects — flat design = flat motion
- Color transitions: 200ms ease
- Underline animations: left-to-right reveal on links

### Loading States

- Skeleton loading blocks (match card shapes, beige tint)
- Never use spinners — they break the flat aesthetic
- Progress indicators for multi-step flows (Stepper updates)
- Smooth opacity transitions for content reveal

### Scroll Behavior

- Subtle reveal animations on scroll (fade-up, 300ms ease)
- Use IntersectionObserver for performance — no scroll event listeners
- Trigger at 75% viewport entry
- No heavy parallax — flat design stays grounded
- Sticky header on scroll (subtle, without shadow)

### Accessible Focus States

- 2px `--accent-blue` outline on all interactive elements
- 2px offset for visibility against backgrounds
- Never remove default focus — enhance it
- Visible focus ring on keyboard navigation

### Performance Rules

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- `will-change` only on elements that will animate imminently
- 60fps minimum — no jank, no compromise
- Respect `prefers-reduced-motion`: disable all animations when set

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 🧠 PART 5 — AI Design Command Language

AI Agent Commands follow this structure:

**Example Hero**

```
CREATE: HeroBlock
STYLE: Flat Modern
THEME: TrustAudit Light
LAYOUT: 50/50 split
ADD: Organic background circle
CTA_PRIMARY: accent-green
CTA_SECONDARY: outline-black
```

**Example Dashboard**

```
CREATE: BentoGrid
COLUMNS: 3
CARDS:
  - ScoreCard
  - AuditHistoryCard
  - WalletStatusCard
STYLE: Flat minimal
BORDER: 1px neutral
```

**Example Form**

```
CREATE: FormCard
INPUTS:
  - TaskDescription (textarea)
  - WorkDeliverable (textarea)
BUTTON: Primary (accent-green)
VALIDATION: Inline
FOCUS: accent-blue ring
```

---

## 📱 PART 6 — Responsive Rules

**Mobile (320–767px)**

- Stack vertically
- Hero image below text
- Buttons full width
- H1 = 40px, Body = 16px
- 24px side padding
- BentoGrid → single column
- Section spacing: 48px

**Tablet (768–1023px)**

- 2 column grid
- Reduced spacing (section: 64px)
- Hero: 50/50 maintained or stacked
- Inputs remain full width

**Desktop (1024–1439px)**

- Full 3 column grid
- 96px section spacing
- Max content width: 1280px
- Hero 50/50 split with illustration

**Large Desktop (1440px+)**

- Content centered, max-width enforced
- Extra whitespace on sides
- No layout changes, just breathing room

---

## 🎯 PART 7 — Design Personality

TrustAudit should feel:

- **Playful yet serious** — geometric accents + bold typography
- **Modern but not Web3 cliché** — no neon gradients, no dark hacker aesthetic
- **Clean** — whitespace is generous and intentional
- **Bold typography** — Syne headlines command attention
- **Structured geometry** — circles, rectangles, dots as accents
- **Calm beige background** — `#F4EFE7` anchors the entire identity
- **Strategic bright pops** — green, coral, blue only where needed
- **Professional enough for investors** — not a toy, a real product
- **Trustworthy** — blockchain verified, AI audited, visually honest

**Brand Adjectives:** Playful. Trustworthy. Clean. Bold. Modern.

---

## 🏆 PART 8 — Final Standard Checklist

✓ WCAG AA+ compliant (7:1 body text target)
✓ 8px grid alignment — no exceptions
✓ No visual clutter — every element earns its place
✓ Strong hierarchy — CRAP validated on every component
✓ Flat aesthetic — no gradients, no shadows, no 3D
✓ System-based components — reusable tokens and patterns
✓ Reusable tokens — colors, spacing, typography all tokenized
✓ Mobile-first structure — designed mobile, enhanced desktop
✓ 60fps animations — transform/opacity only
✓ `prefers-reduced-motion` respected
✓ Color blindness validated
✓ Font loading optimized (swap strategy)
✓ Consistent button hierarchy (Primary/Secondary/Tertiary)
✓ Skeleton loading states (no spinners)
✓ Focus states visible on all interactive elements

---

## 🚀 Outcome

Following this guide will produce:

- A startup-ready SaaS interface
- Modern 2025 visual identity rooted in flat design
- Strong brand consistency across all components
- Clear hierarchy and trust through CRAP principles
- Flat premium design inspired by the reference theme
- Accessible, performant, and production-ready frontend

---

## 🔍 DESIGN ANALYSIS (Auto-Generated)

> The following analysis was produced by cross-referencing this document with `proejct_knowledge.md` and `Algorand.md` in the same repository.

---

### DESIGN SYSTEM ASSESSMENT

**What's Well-Defined:**

- ✅ **Complete color token system** — Backgrounds, typography, accents, and borders all tokenized with CSS custom properties
- ✅ **Typography scale** — Desktop and mobile sizes for H1–H3, body, and small text with weight and tracking specs
- ✅ **8px spacing grid** — Seven defined spacing values from 4px (micro) to 96px (major sections)
- ✅ **Responsive breakpoints** — Four tiers: mobile, tablet, desktop, large desktop with specific layout rules per tier
- ✅ **CRAP validation** — Each major component includes a CRAP principles check
- ✅ **60-30-10 color rule** — Prevents accent color overuse
- ✅ **Animation system** — Performance-focused (GPU-only transforms), accessibility-aware (`prefers-reduced-motion`)
- ✅ **Accessibility targets** — 7:1 body text contrast (above WCAG AA), color blindness validation required

**What's Missing or Underspecified:**

- ⚠️ **No dark mode** — The system is explicitly "Flat Light Mode" only. If dark mode is ever needed, the entire token system will need a second layer.
- ⚠️ **No error states** — Form validation messages, error alerts, empty states, and 404 pages are not designed
- ⚠️ **No toast/notification component** — Transaction confirmations, wallet connect success, and error alerts need a notification pattern
- ⚠️ **No modal component** — The product requires a "Submit Proof Modal" (per `proejct_knowledge.md`) but no modal is defined here
- ⚠️ **No navigation/header component** — Navbar with wallet connect button is a core requirement but not in the component library
- ⚠️ **No table component** — The task board will likely need a table or list view not covered by BentoGrid alone

---

### COMPONENT ↔ PRODUCT MAPPING

How well do the 7 defined components cover the product requirements from `proejct_knowledge.md`:

| Product Requirement    | Matching Component                | Coverage                                                                 |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| Task Board             | **BentoGrid**                     | ✅ Partial — good for dashboard, may need list view variant              |
| Post Task Form         | **FormCard**                      | ✅ Full — inputs, labels, validation, button                             |
| Claim Button           | **Button System** (Primary)       | ✅ Full                                                                  |
| Approve Button         | **Button System** (Primary)       | ✅ Full                                                                  |
| Status Badges          | **BlockchainBadge**               | ✅ Adaptable — needs color variants for OPEN/CLAIMED/SUBMITTED/COMPLETED |
| AI Score Display       | **ScoreCard**                     | ✅ Full — progress bar + verdict badge                                   |
| Audit Flow Visual      | **StepperHorizontal**             | ✅ Full — Input → AI Audit → On-Chain → Verified                         |
| Wallet Connect Button  | ❌ Not defined                    | ❌ Needs a new component spec                                            |
| Submit Proof Modal     | ❌ Not defined                    | ❌ Needs a modal overlay spec                                            |
| Navigation Bar         | ❌ Not defined                    | ❌ Needs header/nav spec                                                 |
| Transaction ID Display | ❌ Not defined                    | ❌ Needs a code/hash display pattern                                     |
| Loading States         | Skeleton blocks (described in §4) | ✅ Concept defined, no component spec                                    |

---

### CROSS-DOCUMENT CONFLICT: CSS Framework

This design system defines **vanilla CSS custom properties** (`--bg-primary`, `--accent-green`, etc.) with explicit pixel values for every component. However, `proejct_knowledge.md` specifies **Tailwind CSS** as the frontend styling tool.

**Resolution Options:**

1. **Tailwind + Custom Theme** — Map all design tokens into `tailwind.config.js` as custom theme values. Use Tailwind utility classes for layout, the custom theme for colors/spacing. This is the most practical approach for a hackathon.
2. **Pure Vanilla CSS** — Ignore Tailwind entirely, implement the design system as written with CSS custom properties and component-scoped stylesheets.
3. **Hybrid** — Use Tailwind for responsive utilities and layout, but apply design tokens via CSS variables for colors and typography.

---

### BRANDING NOTE

This document brands the product as **"TrustAudit"** throughout. The project folder is named **"GigBounty"** and `proejct_knowledge.md` calls it **"Decentralized Micro-Task Bounty Board"**. The design system's identity (playful, trustworthy, clean, bold, modern) applies regardless of final name — but all references should be unified before implementation.

---

### IMPLEMENTATION NOTES

1. **Font Loading Priority** — Preload Syne (display font) in `<head>` since it's used for H1 hero text, the first thing users see. Inter can load via Google Fonts with `&display=swap`.
2. **CSS Variable Fallbacks** — When implementing, always provide fallback values: `color: var(--text-primary, #111111)` to prevent broken rendering if tokens fail to load.
3. **Component Build Order** — Start with the Button System and FormCard (used everywhere), then ScoreCard and BentoGrid (dashboard), then HeroBlock (landing page). StepperHorizontal and BlockchainBadge are lower priority.
4. **Missing Components to Build** — Navigation bar, modal overlay, toast notifications, and transaction hash display should be designed following the same token system and CRAP principles defined here.
