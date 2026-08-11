# 2. Use a local web-based UI for template generation

Date: 2026-08-11

## Status

Accepted

## Context

After deciding to use an automated approach for generating social media templates, we need to choose the user interaction model. The tool can either be a fully background CLI/script or a local web interface that offers a live preview.

## Decision

We will build a local web-based UI where the user can input text, upload images, and see a live preview of the generated social media post (e.g., a 1080x1080 IG post). The interface will include a "Download" button to save the preview as an image file (using a library like `html-to-image`).

## Consequences

* **Positive:** Provides a visual, intuitive way to catch text overflow or layout issues before generating the image. Retains the speed of automation while keeping the human-in-the-loop for quality assurance.
* **Negative:** Requires running a local dev server (or opening an HTML file) rather than just executing a quick shell command.
