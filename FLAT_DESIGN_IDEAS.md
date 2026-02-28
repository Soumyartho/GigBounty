# GigBounty — Flat Design Stat Card Ideas

## 🎨 Design Philosophy

Flat design = **no shadows, no gradients, no 3D effects**. Just clean shapes, bold colors, strong typography, and intentional whitespace. Every element earns its place.

---

## Idea 1: Color-Blocked Stat Strip

Each stat gets a **bold flat color block** as its left accent. No card borders — just color doing the work.

```
┌─────────────────────────────────────────────────────────────┐
│ ██ 3 Total Tasks  │ ██ 2 Open  │ ██ 20.1 ALGO  │ ██ 0 Done │
└─────────────────────────────────────────────────────────────┘
  🟢 green            🟡 yellow    🟠 coral         ⬛ black
```

- Single flat bar, no individual cards
- 4px left-border accent per segment in a different flat color
- Numbers in **Syne 28px bold**, labels in **Inter 11px uppercase muted**
- Dividers are simple 1px vertical lines

---

## Idea 2: Flat Tile Grid with Accent Tops

Cards with a **bold colored top strip** (3px) — no shadows, no rounded corners, sharp edges.

```
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ┌──────────────┐    ┌──────────────┐
  │  3           │    │  2           │
  │  TOTAL TASKS │    │  OPEN        │
  └──────────────┘    └──────────────┘

  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ┌──────────────┐    ┌──────────────┐
  │  20.1        │    │  0           │
  │  ALGO LOCKED │    │  COMPLETED   │
  └──────────────┘    └──────────────┘
```

- 2×2 grid instead of 4×1 — breaks the template pattern
- Each card has a unique flat accent color on top (green, yellow, coral, blue)
- **Sharp corners** (border-radius: 0) — true flat design signature
- White background, 1px border, zero shadow

---

## Idea 3: Oversized Number + Tiny Label (Swiss Style)

Inspired by Swiss/International typography — let the **number dominate** with extreme size contrast.

```
  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │             │  │             │  │             │  │             │
  │     3       │  │     2       │  │   20.1      │  │     0       │
  │             │  │             │  │             │  │             │
  │  tasks      │  │  open       │  │  algo       │  │  done       │
  └────────────┘  └────────────┘  └────────────┘  └────────────┘
     64px bold       64px bold       64px bold       64px bold
     11px light      11px light      11px light      11px light
```

- Numbers at **64px Syne bold** — the card IS the number
- Labels at **11px Inter lowercase** — whisper-quiet
- Generous padding (48px)
- No icons, no emojis — pure typography
- 1px border, flat white background

---

## Idea 4: Inline Dashboard Row (No Cards)

Eliminate cards entirely. Just a **flat horizontal data row** embedded in the page.

```
  3 tasks  ·  2 open  ·  20.1 ALGO locked  ·  0 completed
```

- No borders, no backgrounds, no boxes
- All stats on one line separated by dots or pipes
- Numbers in **bold black**, labels in **muted gray**
- Sits directly below the hero — feels integrated, not modular
- Maximum flat: literally just text on a page

---

## Idea 5: Left-Accent Stacked List

Vertical list with bold left color bars — like a sidebar data panel.

```
  ██  3    Total Tasks
  ──────────────────────
  ██  2    Open Bounties
  ──────────────────────
  ██  20.1 ALGO Locked
  ──────────────────────
  ██  0    Completed
```

- Each row has a **12px flat color block** on the left
- Horizontal dividers between rows (1px, light gray)
- Number and label on the same line — reads like a data table
- No card wrappers — just structured text with color cues

---

## Idea 6: Flat Tag / Pill Strip

Stats displayed as **inline flat pills** — compact, modern, scannable.

```
  ┌─────────────┐  ┌───────────────┐  ┌─────────────────┐  ┌───────────┐
  │ 3 Tasks     │  │ 2 Open        │  │ 20.1 ALGO       │  │ 0 Done    │
  └─────────────┘  └───────────────┘  └─────────────────┘  └───────────┘
```

- Pill-shaped containers (border-radius: 24px)
- Flat background tint per pill (green 10%, yellow 10%, coral 10%, blue 10%)
- Number bold, label regular — all on one line inside the pill
- Compact, doesn't take vertical space
- Feels like status tags, not data cards

---

## 🏆 Best for GigBounty

### Recommended: **Idea 3 (Swiss Style)** + **Idea 2 (Accent Tops)**

Combine them:

```
  ▓▓▓▓ green          ▓▓▓▓ yellow        ▓▓▓▓ coral         ▓▓▓▓ blue
  ┌──────────────┐    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │              │    │              │   │              │   │              │
  │     3        │    │     2        │   │    20.1      │   │     0        │
  │              │    │              │   │              │   │              │
  │  total tasks │    │  open        │   │  algo locked │   │  completed   │
  └──────────────┘    └──────────────┘   └──────────────┘   └──────────────┘
```

**Why this combo wins:**

- **Oversized numbers** (64px) create instant visual impact — the eye goes straight to the data
- **Flat accent top strips** differentiate each card without using shadows or glows
- **Lowercase labels** feel confident and modern — no need to shout in uppercase
- **No icons/emojis** — pure flat design lets typography do all the work
- **Zero shadows, zero gradients** — authentically flat
- Each card tells you its category through **color alone** (green = active, yellow = pending, coral = value, blue = complete)

### Implementation is simple:

- `border-top: 3px solid [color]`
- `border-radius: 0` or `2px` max
- `font-size: 64px` for numbers
- `font-size: 11px; text-transform: lowercase` for labels
- `box-shadow: none`
- `background: #FFFFFF`

---

_Flat design ideas for GigBounty — February 2026_
