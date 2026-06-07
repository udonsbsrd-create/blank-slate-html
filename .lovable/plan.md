## Summary
Create a route that renders a completely blank HTML page with no visible content, styles, or layout elements.

## Plan
1. **Create route** `src/routes/blank.tsx` with a component that returns `null` (or an empty fragment).
2. **Update metadata** — set a minimal `head()` with just a title like "Blank".
3. **No styling, no layout, no visible DOM nodes.**

That's it — one new route file.