# AMBER & TEAL — Record Label Landing Page

<img width="1904" height="970" alt="image" src="https://github.com/user-attachments/assets/a8014779-6d12-4fa1-9e11-c3c2d5b4f48d" />


An interactive, motion-focused, and premium record label landing page customized for **Gourab Ghosh**. Built with raw semantic HTML5, modern vanilla CSS layouts, and native high-performance JavaScript engines (no bulky frameworks or runtime dependencies).

## Key Features

1. **Scroll-Driven Portal Hero:**
   - On scroll, two opaque panels slide outward to reveal the background photography.
   - The ambient duotone color wash emerges from transparency.
   - Accent markers drift toward opposite corners.
   - The central wordmark dynamically expands, tightens its letter-spacing, and separates into left/right halves.
   - Fully reversible layout transitions bound to scroll positions.

2. **Manifesto Fold & Parallax Vinyl:**
   - A bold statement utilizing responsive viewport typography (`clamp`).
   - A floating circular vinyl record that drifts (Y-parallax) and rotates on its axis based on screen viewport intersections.

3. **Throwable Catalog Deck:**
   - The label's discography is presented as a physical deck of vinyl sleeves.
   - Capture drag/swipe pointer gestures with real-time translation, rotation, and scale feedback.
   - Cards automatically swipe-out, lift, roll, and re-stack at the bottom of the pile when dragged past the 10% width threshold.
   - Integrated with progress indicators and dynamic "Now Playing" audio metadata.
   - Full keyboard accessibility (cycle cards using `Left` and `Right` Arrow keys).

4. **Catchy Audio Player & Synth Engine:**
   - Sleek floating bottom-left audio pill featuring a 100% CSS-drawn bouncing line visualizer.
   - **Bulletproof Web Audio API synthesis engine fallback:** If the browser or network blocks loading the default MP3 stream, clicking Play initializes a local synth sequence (modular triangle chord sweeps, deep bass kick, and noise hi-hats) generated directly in the browser.
   - Dynamic track labeling that updates the title automatically to match the sleeve at the top of the card deck.

5. **Responsive Roster & Tour Dates:**
   - Interactive roster list with hairline rule color shifts on hover.
   - A live date sheet that collapses into a two-column responsive grid card layout on mobile viewports (`<600px`).

6. **Accessibility & Safety:**
   - Strictly respects `prefers-reduced-motion: reduce` system configurations by locking the portal open, disabling parallax rotations, and resetting deck transition offsets to secure an accessible environment.

---

## Folder Structure

```
c:/Users/go/OneDrive/Desktop/Gourab/
├── assets/
│   ├── hero_bg.jpg      (synthesizer gear cover art)
│   └── vinyl.jpg        (minimalist spinning record face)
├── index.html           (semantic layout structures and meta SEO tags)
├── style.css            (visual design tokens, gradients, layouts, and animations)
├── app.js               (scroll trackers, physics controls, and synthesizer scripts)
└── README.md            (project guide)
```

---

## Local Development

To run the site locally and test interaction physics and synth generation:

1. **Option A: Serve via Python (Recommended)**
   Run the following command in your terminal from the project folder:
   ```bash
   python -m http.server 8000
   ```
   Then open your browser and navigate to:
   ```text
   http://127.0.0.1:8000
   ```

2. **Option B: Direct Browser Launch**
   Simply double-click the `index.html` file to open it in your browser. Note that some browsers may block local files from executing certain advanced audio parameters (Web Audio API) due to file origin constraints, so Option A is preferred.
