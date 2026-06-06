# Product

## Register

product

> Default is **product**: most work is the auth-gated app (dashboard, attendees, attendance, events, reports). Exception: the public surfaces (`/` home, `/about`) are being reworked as **brand** to market Attendify. Treat those two routes as brand per-task; everything else is product.

## Users

Primary: **ministry leaders and analysts.** They review attendance after services, mostly on desktop. The job: read weekly attendance trends, demographic and member-status breakdowns, leader/cell summaries, and per-event registration data, then act on what the numbers show. Secondary: church admins/volunteers running check-in (incl. face recognition) at peak service hours on phones/tablets, time-pressured.

## Product Purpose

Attendify replaces paper-based / manual-click church attendance with fast contactless check-in (face recognition) and live analytics. It exists so leaders stop guessing at engagement: who showed up, which cells/leaders are growing, how VIPs and member statuses trend over time. Success = a leader opens the dashboard after service and gets an accurate, readable picture in seconds; a volunteer checks someone in without a queue forming.

## Brand Personality

Clean, efficient, professional. Voice is direct and competent, not chatty. The tool gets out of the way: data is legible, actions are obvious, nothing decorative competes with the numbers. Credible enough that leadership trusts the analytics, approachable enough that a non-technical volunteer isn't intimidated.

## Anti-references

- **Generic SaaS dashboard.** No hero-metric template (big number + gradient + supporting stats), no identical icon+heading+text card grids, no gradient text, no AI-cliche eyebrows/numbered section scaffolding.
- **Clunky church admin software.** Not the dated, dense, beige logbook-replacement ChMS look.
- **Sterile enterprise/government.** Not cold, gray, joyless, or over-formal; keep the legibility, lose the chill.
- **Childish / over-playful.** No emoji soup or toy-like UI that undermines trust with leaders reviewing data.

The line to walk: professional and trustworthy without being sterile; clean without being clinical.

## Design Principles

- **Numbers first, chrome last.** Every screen earns its space against the data it shows. If decoration competes with a chart or a count, the decoration loses.
- **Legible at a glance.** A leader scanning post-service should read the state in seconds: clear hierarchy, honest contrast, no hunting.
- **Fast under pressure.** Check-in and search must stay quick and forgiving on mobile during peak service; latency and friction are design bugs.
- **Trust through accuracy.** Present data plainly and correctly. No vanity framing, no misleading scales; the interface's credibility is the product's credibility.
- **Calm confidence over flash.** Personality comes from precision and polish, not novelty effects.

## Accessibility & Inclusion

WCAG 2.1 AA minimum; must pass AXE checks (per project Angular standards). Body text ≥4.5:1, large/UI text ≥3:1 — watch chart legends and muted labels on the mint-white bg. Full keyboard operation and visible focus for all interactive controls (check-in, search, tables, paginators, dialogs). Every animation needs a `prefers-reduced-motion` alternative. Don't encode chart meaning in color alone (relevant to attendance/demographic breakdowns); pair color with labels/patterns. Verify the blue monochromatic palette's chart series remain distinguishable for color-vision deficiency.
