# Project Instructions

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Design Context

See `PRODUCT.md` (strategy) and `DESIGN.md` (visual system) at the root before any UI work.

- **Product:** Attendify, contactless church attendance + live analytics. Primary users: ministry leaders/analysts reading post-service trends (desktop); secondary: volunteers running check-in (mobile).
- **Register:** product. Exception: `/` and `/about` are being reworked as brand (marketing) surfaces.
- **Personality:** clean, efficient, professional. Numbers first, chrome last.
- **Not:** generic SaaS dashboard · clunky church admin · sterile enterprise · childish/over-playful.
- **Visual (DESIGN.md "The Clear Ledger"):** monochromatic blue. Action Blue `#0E6FC2` for actions (AA-safe), bright `#40B7FF` for accent/identity only. Inter single family, `tabular-nums` on figures. Cool blue-tinted bg `#F7FAFD`, white surfaces, hairline `#E2EAF1` borders, flat by default.

## Required Project Rules

Before making changes, read and follow:

- `.claude/rules/angular-standards.md`

## Skills

Project-specific skills are located in:

- `.claude/skills`

Use the relevant skill when the task matches the skill description.