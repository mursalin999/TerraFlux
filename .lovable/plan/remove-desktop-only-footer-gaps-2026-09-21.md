# Remove desktop-only footer gaps

## Changes

- Keep the current full-height shell on phone and tablet widths.
- At the large-screen breakpoint, stop the shared page area from flexing to fill the viewport so the footer follows actual page content.
- Remove Home’s desktop viewport-based minimum height.
- Replace Explore and Compare’s desktop viewport-height map formulas with content-sized desktop dimensions, preserving their existing mobile heights and all controls/data behavior.

## Validation

- Check Home, Explore, Calendar, Compare, and About & Data on wide desktop for footer placement and overflow.
- Confirm the phone layout remains unchanged.
