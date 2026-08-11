# 3. Use Vanilla HTML/CSS/JS for the Web UI

Date: 2026-08-11

## Status

Accepted

## Context

We need to build a web-based UI for generating social media templates. The choice is between using a modern build-step framework (like React/Vite) or plain, zero-dependency HTML, CSS, and Vanilla JavaScript.

## Decision

We will use Vanilla HTML, CSS, and JavaScript. The application will consist of static files that can be opened directly in a browser (e.g., `file:///path/to/index.html`) without needing a local development server or Node.js environment. We will use a CDN for any required libraries (like `html-to-image`).

## Consequences

* **Positive:** Zero installation, extreme longevity (won't break due to NPM package updates), highly portable, and perfectly suited for a lightweight internal utility.
* **Negative:** Lacks component reusability features found in modern frameworks, which could become cumbersome if the number of template variations grows significantly large.
