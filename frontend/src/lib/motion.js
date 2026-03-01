/**
 * GigBounty — Shared Motion System
 * Premium SaaS-grade animation config.
 *
 * Principle: calm, confident, intentional.
 * Only transform + opacity are animated (GPU-composited).
 */
import { useReducedMotion } from 'framer-motion';

// ─── Global Easing ──────────────────────────────────────────
export const EASE = [0.22, 1, 0.36, 1]; // cubic-bezier — smooth deceleration

// ─── Duration Tokens ────────────────────────────────────────
export const DURATION = {
    instant: 0.12,    // haptic click feedback
    fast: 0.2,        // micro-interactions
    medium: 0.5,      // content reveals
    slow: 0.7,        // hero-level entrance
    decorative: 6,    // floating loops
};

// ─── Stagger Tokens ─────────────────────────────────────────
export const STAGGER = {
    fast: 0.06,       // buttons, badges
    default: 0.1,     // cards in a grid
    slow: 0.18,       // major sections
};

// ─── Reusable Variants ──────────────────────────────────────

/** Container — orchestrates staggered children */
export const staggerContainer = (stagger = STAGGER.default, delay = 0) => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren: stagger,
            delayChildren: delay,
        },
    },
});

/** Fade-up — standard entrance for any element */
export const fadeUp = (y = 24, duration = DURATION.medium) => ({
    hidden: { opacity: 0, y },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration, ease: EASE },
    },
});

/** Fade-in — no vertical movement */
export const fadeIn = (duration = DURATION.medium) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration, ease: EASE },
    },
});

/** Scale-in — for badges, icons */
export const scaleIn = (delay = 0) => ({
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: DURATION.medium, ease: EASE, delay },
    },
});

// ─── Hover / Tap Presets ────────────────────────────────────

/** Card hover — subtle lift + shadow hint */
export const cardHover = {
    y: -4,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
};

/** Button hover — tactile micro-lift */
export const buttonHover = {
    y: -2,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
};

/** Button tap — haptic compression */
export const buttonTap = {
    scale: 0.97,
    transition: { type: 'spring', stiffness: 500, damping: 30 },
};

/** Gentle icon hover — slight rotation */
export const iconHover = {
    rotate: 3,
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
};

// ─── Continuous Animations ──────────────────────────────────

/** Slow floating — for illustrations */
export const floatLoop = (distance = 8, duration = DURATION.decorative) => ({
    y: [0, -distance, 0],
    transition: {
        duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
    },
});

// ─── Accessibility Hook ─────────────────────────────────────

/**
 * Returns motion props that disable animations when user prefers reduced motion.
 * Usage: <motion.div {...useMotionProps()}>
 */
export function useMotionProps() {
    const prefersReduced = useReducedMotion();
    if (prefersReduced) return {};
    return { initial: 'hidden', animate: 'visible' };
}

/**
 * Returns motion props for scroll-triggered reveals.
 * Usage: <motion.div {...useScrollRevealProps()}>
 */
export function useScrollRevealProps() {
    const prefersReduced = useReducedMotion();
    if (prefersReduced) return {};
    return {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '0px' },
    };
}
