import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, useScrollRevealProps } from '../lib/motion';

/**
 * ScrollReveal — wraps any section to animate it on scroll.
 *
 * Usage:
 *   <ScrollReveal>
 *     <StatsBar tasks={tasks} />
 *   </ScrollReveal>
 *
 * Props:
 *   - y: vertical offset (default 24)
 *   - stagger: child stagger delay (default 0, set > 0 to stagger children)
 *   - delay: initial delay before first child (default 0)
 *   - className: pass-through className
 *   - style: pass-through style
 *   - as: HTML element tag (default 'div')
 */
export default function ScrollReveal({
    children,
    y = 24,
    stagger = 0,
    delay = 0,
    className,
    style,
    as = 'div',
}) {
    const scrollProps = useScrollRevealProps();
    const Tag = motion[as] || motion.div;

    const variants = stagger > 0
        ? staggerContainer(stagger, delay)
        : fadeUp(y);

    return (
        <Tag
            className={className}
            style={style}
            variants={variants}
            {...scrollProps}
        >
            {children}
        </Tag>
    );
}
