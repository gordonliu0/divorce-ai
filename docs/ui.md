# UI/UX Style Guide

## Overall Style: Institutional Modern

The aesthetic used across legal tech, fintech, and B2B tools targeting professional services. Minimal decoration, generous whitespace, typography-driven hierarchy, and a color palette that says "we take your money/data/case seriously."

## Key Principles

### Cardless Forms
No container borders or shadows — just floating fields on a neutral background. Feels confident and uncluttered. Reference: Linear, Vercel, Stripe's newer auth flows.

### Serif + Sans-Serif Pairing
Playfair Display for headings, Geist for body text. Signals trust and gravitas (law, finance) without feeling stuffy. Reference: Harvey AI, Mercury, Carta.

### Neutral Off-White Background
Not pure white (clinical) or dark (techy). Gray off-white reads as calm, professional, premium. Marketing pages use `hsl(0 0% 96.5%)`.

### Muted Hierarchy
Dark text for headings, gray for descriptions/labels, subtle borders. Low contrast between elements but high readability. Nothing screams for attention.

### Native HTML Inputs
Clean, lightweight inputs over heavy component library wrappers. No visual noise from card borders or shadows.

## Color Palette (Marketing / Auth)

- **Background**: `hsl(0 0% 96.5%)` — gray off-white
- **Foreground**: `hsl(0 0% 12%)` — near-black
- **Muted text**: `hsl(0 0% 45%)` — medium gray
- **Labels**: `hsl(0 0% 25%)` — dark gray
- **Borders**: `hsl(0 0% 82%)` — light gray
- **Inputs**: `hsl(0 0% 100%)` — white
- **Buttons**: `hsl(0 0% 12%)` bg / `hsl(0 0% 96.5%)` text
- **Footer**: `hsl(0 0% 10%)` — dark charcoal

## Typography

- **Headings**: Playfair Display (serif), `font-medium`, tight tracking
- **Body**: Geist Sans, `text-sm` / `text-base`
- **Labels**: `text-sm font-medium`, dark gray
- **Section labels**: `text-xs`, uppercase, wide tracking

## App Dashboard

Dark mode (`forcedTheme="dark"`) using shadcn/ui defaults. Marketing and auth pages override to light mode with scoped CSS variables.
