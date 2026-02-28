# GigBounty — Stat Card Orientation Guide

## ❌ The Problem

The current stat cards use a **4-column equal-width grid** with stacked number + label. This is the most common AI-generated card pattern — every template, every Tailwind tutorial, every ChatGPT output looks exactly like this:

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  3       │  │  2       │  │  20.1    │  │  0       │
│  TOTAL   │  │  OPEN    │  │  ALGO    │  │  COMPLETED│
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

**Why it looks AI-generated:**

- All cards are identical size — no visual hierarchy
- No card is more important than others — everything screams equally
- Perfectly symmetric — real designers intentionally break symmetry
- Stacked vertical layout is the laziest default

---

## ✅ Best Orientation Options (Ranked)

---

### 🥇 Option 1: Compact Inline Stats Bar (RECOMMENDED)

No cards at all. A single unified bar with dividers — like Stripe, Linear, and Vercel dashboards use.

```
┌─────────────────────────────────────────────────────────────────┐
│  3 Total Tasks   │   2 Open Bounties   │   20.1 ALGO   │   0  │
└─────────────────────────────────────────────────────────────────┘
```

**Why it's best:**

- Eliminates the "4 identical boxes" problem entirely
- Feels like a real product dashboard, not a template
- Compact — doesn't waste vertical space
- Numbers and labels read as a sentence, not isolated data points

---

### 🥈 Option 2: Asymmetric Bento Grid (2-1-1)

Make the primary metric (Total Tasks or ALGO Locked) **wider** than the others.

```
┌──────────────────────┐  ┌──────────┐  ┌──────────┐
│  20.1 ALGO           │  │  3       │  │  2       │
│  Total Value Locked  │  │  TASKS   │  │  OPEN    │
│  ████████░░ 63%      │  │          │  │          │
└──────────────────────┘  ├──────────┤  ├──────────┤
                          │  0       │  │          │
                          │ COMPLETED│  │          │
                          └──────────┘  └──────────┘
```

**Why it works:**

- Creates clear visual hierarchy — one hero metric
- Breaks the symmetry that screams "auto-generated"
- The larger card can hold supplementary data (progress bar, trend)
- Feels intentionally designed, not randomly laid out

---

### 🥉 Option 3: Horizontal Card Layout

Numbers and labels sit **side by side** instead of stacked. Each card is a wide, short strip.

```
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  📋  3  ·  Total Tasks       │  │  ⚡  2  ·  Open Bounties     │
└──────────────────────────────┘  └──────────────────────────────┘
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  🔥  20.1  ·  ALGO Locked   │  │  💎  0  ·  Completed         │
└──────────────────────────────┘  └──────────────────────────────┘
```

**Why it works:**

- Horizontal cards feel more dynamic and modern
- 2×2 grid is less "template-y" than 4×1
- Icon + number + label reads naturally left-to-right
- Each card is compact and scannable

---

### Option 4: Single Hero + Small Pills

One big featured metric card, with the rest as small inline pills below it.

```
┌───────────────────────────────────────────┐
│  20.1 ALGO                                │
│  Total Value Locked in Escrow             │
│  ████████████░░░░░ 63% of target          │
└───────────────────────────────────────────┘
  ┌─────────────┐  ┌──────────────┐  ┌───────────┐
  │ 3 Tasks     │  │ 2 Open       │  │ 0 Done    │
  └─────────────┘  └──────────────┘  └───────────┘
```

**Why it works:**

- Extremely clear hierarchy — one metric dominates
- Small pills feel lightweight and contextual
- Hero card can include rich supplementary info

---

## 🏆 THE VERDICT

### Go with **Option 1: Compact Inline Stats Bar**

It's the most professional, the most startup-like, and the hardest to mistake for AI output. Real products don't put stats in separate equal boxes — they put them in a **unified data strip** that reads like a dashboard header.

**Key implementation details:**

- Single container with `display: flex` and vertical dividers
- Numbers in bold display font (Syne, 28px)
- Labels in muted uppercase (Inter, 12px)
- Subtle left border accent on each stat segment
- No individual card backgrounds — just the unified strip

> **Rule of thumb:** If you can find your exact layout in the first 3 results of "CSS stat cards tutorial" — it's too generic. Option 1 won't appear in those results.

---

_Analysis for GigBounty design sprint — February 2026_
