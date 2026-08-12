## Problem Statement

The recent codebase modifications successfully fixed overflow detection for non-text layouts (like Layout D) and fixed a Z-index bug during HTML-to-Canvas export. However, a post-fix Code Review identified several significant architectural code smells and functional omissions (standards and spec violations) introduced during this iterative repair process. These include Shotgun Surgery across all layout files, duplicated test script logic, primitive obsession (Magic Numbers), a React state sync mismatch causing direct DOM mutation, and a missing gradient background when Layout Fade lacks an image.

## Solution

A systematic refactor and targeted bug fix sweep to resolve all identified Code Review issues. This includes introducing a shared Layout Wrapper/HOC to eliminate duplicated styling logic, extracting magic numbers to constants, refactoring the text shrinking logic to properly sync with React state rather than directly mutating the DOM, and fixing the conditional rendering of the gradient overlay in Layout Fade.

## User Stories

1. As a developer, I want all shared layout styling behaviors (like compact titles) to be managed in a unified Higher-Order Component or Base Wrapper, so that I don't have to perform Shotgun Surgery across 7 different layout files when making global structural changes.
2. As a developer, I want shared testing utilities and mock data to be centralized, so that I don't maintain duplicated code across multiple diagnostic scripts (`capture-all-layouts.cjs`, `capture-post.cjs`).
3. As a developer, I want threshold limits (like `MAX_TITLE_LENGTH_BEFORE_COMPACT`) to be defined as named constants, so that the code is self-documenting and free of Primitive Obsession.
4. As a React developer, I want the `checkOverflow` font-shrinking mechanism to strictly use React state updates to drive inline styles on components, so that direct DOM mutations don't get accidentally overwritten during the component lifecycle.
5. As a user, I want the Fade Layout (D版型) to retain its dark gradient foundation even if I haven't uploaded an image yet, so that the layout's visual structure remains consistent and usable for text.
6. As a developer, I want domain vocabulary in comments (e.g. "Control Form") to strictly align with the project glossary, so that communication remains consistent.

## Implementation Decisions

- **Modules modified:**
  - Create or modify a Base Layout component (e.g., `LayoutWrapper.jsx` or similar) to handle the injection of `mainTitleCompact`.
  - Refactor all 7 layout files (`LayoutBg.jsx`, `LayoutCard.jsx`, `LayoutCaption.jsx`, `LayoutDuotone.jsx`, `LayoutFade.jsx`, `LayoutGlass.jsx`, `LayoutSplit.jsx`, `LayoutText.jsx`) to remove the duplicated `getTitleClass` calls and rely on the wrapper.
  - Modify `src/utils/styleUtils.js` to extract `9` into `MAX_TITLE_LENGTH_BEFORE_COMPACT`.
  - Modify `src/components/PreviewCanvas.jsx` to pass `bodyFontSize` down as a prop to the currently selected layout, removing the direct `bodyEl.style.fontSize = ...` mutation.
  - Modify `src/layouts/LayoutFade.jsx` to move `.postImageOverlay` outside the `{state.image && ...}` conditional block so the gradient persists.
- **Domain Vocabulary:**
  - Correct the term "7 layouts defined in ControlPanel" to "Control Form" in `scripts/capture-all-layouts.cjs` to align with `CONTEXT.md` standards.

## Testing Decisions

- **What makes a good test:** The tests should verify the component structure and CSS classes applied, without breaking the visual appearance of the canvas.
- **Modules tested:** `PreviewCanvas` and `LayoutFade`.
- **Prior art:** Use the existing Puppeteer capture scripts (`capture-all-layouts.cjs`) to visually regression test that the compact title logic and font shrinking still visually work across all 7 layouts after refactoring.

## Out of Scope

- Adding new layouts.
- Changing the actual font shrinking math or logic (only refactoring how it is applied to the DOM via React state).

## Further Notes
- This spec was automatically generated based on the Code Review output of PR/Branch HEAD.
