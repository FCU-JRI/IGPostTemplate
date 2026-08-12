## Agent skills

### Issue tracker

GitHub issues. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context repo layout. See `docs/agents/domain.md`.

## CSS & DOM Guidelines

### modern-screenshot export caveats
When building or styling layouts that will be exported via `modern-screenshot` (HTML-to-Canvas), you MUST follow these constraints:
1. **No Pseudo-elements for Visuals**: Do NOT use CSS `::after` or `::before` for critical structural visuals (like gradient overlays or masks). `modern-screenshot` struggles to render them. Always use explicit, discrete DOM nodes (e.g., `<div className="overlay"></div>`).
2. **Explicit Stacking Contexts**: If `z-index` stacking bugs occur in the exported image (elements overlapping incorrectly), ensure the parent containers explicitly define a stacking context (e.g., `position: relative; z-index: ...`). Do not rely on implicit document flow stacking.
