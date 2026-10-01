# Approved design system

Premium, minimal technical software with its own appointment-workflow composition. A compact shared header and a spacious workspace replace sidebars and dashboard clutter.

## Tokens and roles
Primary orange #FF7300: CTAs, selected slots, active agent steps and focus. Secondary green #4DFF00: AI accent, confirmation, successful checks. Dark background #000000 with white text; light near-white with dark text. Neutral borders and restrained surfaces. No blue, gradients, glassmorphism, emojis or excessive shadows.

Light AI/success containers use white surfaces and green borders/icons, never black fills. Accompany green with readable dark labels in light mode. Dark mode is black-first. Compact sun/moon toggle persists during navigation.

## Typography and layout
System Arabic/English font stack, bold primary headings, semibold supporting headings, regular body. Generous spacing, rounded cards, fine borders. Fluid centered workspace: editorial hero, conversational request, structured context, slot list, approval summary, execution checklist and company calendar. Mobile stacks all columns and keeps targets at least 44px tall. Preserve the hero grid with only the execution card, no response card or CTA subline. Only the hero CTA arrow is white; its orange background and text treatment remain unchanged. Approval and completion omit heading support copy. Company details label requested preference separately from the final booked appointment and explain availability alternatives; the current booking is distinguished from earlier session records.

## Identity and controls
Small custom SVG agent/cursor plus sparkle; no robot or large icon library. iOS-style Home outline, sun/moon and checks. Header includes identity, Home, AR/EN and theme. Shared components with semantic HTML; document direction switches RTL/LTR, CSS uses logical properties.

## Motion
Only short state transitions and agent progress. 3.2-second processing and execution sequences communicate meaningful work. Disable animation under prefers-reduced-motion while preserving understandable status updates.

## Disclosure
Subtle expandable accessible footer explains Portfolio Demo Mode in both languages. The disclosure describes local company calendar and local confirmation, not an external API or message.
