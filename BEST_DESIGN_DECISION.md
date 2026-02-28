# GigBounty — Best Design Decision

## 🏆 Winner: Neon Glow Micro-Interactions

The **three-layer neon glow on card hover** is the single best improvement made to GigBounty.

### Why?

- **30 lines of CSS** transformed every card across the entire app
- Creates the instant _"this feels polished"_ reaction that wins hackathons
- No AI tool or template generates layered ambient glow — it reads as **hand-crafted**
- Ties directly into the green accent system used across buttons, inputs, and badges

### The Effect

```css
box-shadow:
  0 0 0 2px rgba(163, 230, 53, 0.25),
  /* Crisp inner edge */ 0 0 18px rgba(163, 230, 53, 0.2),
  /* Warm mid bloom */ 0 0 40px rgba(163, 230, 53, 0.08); /* Ambient outer aura */
```

Cards **lift**, **glow**, and **breathe** on hover — turning a static page into a living interface.

### Rankings

| Rank | Improvement                      |
| ---- | -------------------------------- |
| 🥇   | **Neon Glow Micro-Interactions** |
| 🥈   | Unified Green Accent System      |
| 🥉   | Button System Refinement         |

> _The best design is the one users feel but can't explain._
