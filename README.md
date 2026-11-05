# Zariya — Luxury Women's Ethnic Wear Boutique Website

A production-ready, editorial multi-page luxury fashion website built with semantic **HTML5**, modular **CSS3**, and vanilla **ES6+ JavaScript** (zero external frameworks) for an upscale Indian Women's Ethnic Wear Boutique specializing in **Kurtis, Lehengas, and Salwar Suits**.

---

## Project Architecture

```text
boutique-website/
├── assets/
│   ├── css/
│   │   ├── style.css          # Core design tokens, editorial layouts, 3D cards & responsive grid
│   │   ├── dark-mode.css      # Aubergine & midnight dark palette with antique gold accents
│   │   └── rtl.css            # Bidirectional RTL support (Arabic / Hebrew / Urdu)
│   ├── js/
│   │   ├── main.js            # Theme/RTL toggles, product filters, sorting, modal, sliders & forms
│   │   └── plugins/
│   │       └── tilt.js        # 3D perspective mouse-tilt & radial light-glare card engine
│   ├── images/                # 86 unique local JPG + WebP fashion, textile & boutique photographs
│   └── fonts/                 # Self-hosted WOFF2 font instructions
├── pages/
│   ├── index.html             # Home 1 — Royal Collection Atelier
│   ├── home-2.html            # Home 2 — Contemporary Editorial Lookbook
│   ├── products.html          # Products Catalogue, Multi-Facet Filters, Sort & Styling Modal
│   ├── festive-edit.html      # Festive & Wedding Campaign Edit + Interactive Colour Swatches
│   ├── contact.html           # Flagship Salon Directory, Map, Validated Enquiry & Concierge
│   ├── 404.html               # Custom 404 Editorial Error Page
│   └── coming-soon.html       # Pre-Launch Countdown & Private Preview Email Capture
├── documentation/
│   ├── installation-guide.md
│   ├── customization-guide.md
│   ├── page-structure.md
│   └── credits-changelog-support.md
├── sitemap.xml
├── robots.txt
└── README.md
```

---

## Quick Start & Installation

1. **Clone or extract** the project folder onto your machine or static web host.
2. **Run a local static server** from the repository root (recommended so `<picture>` sources and relative asset paths behave identically to production):
   ```bash
   # Using Python 3
   python -m http.server 8080

   # Or using Node / npx serve
   npx serve .
   ```
3. Open `http://localhost:8080/pages/index.html` in your browser.
4. **Static Hosting Deployment**: Upload the repository directly to **Netlify**, **Vercel**, **Cloudflare Pages**, **GitHub Pages**, or any Apache/Nginx host. No build step or bundler is required.

---

## Key Features

- **Two Distinct Editorial Homepages**:
  - **Home 1 (`pages/index.html`)**: Full-bleed royal palace hero with parallax, 3D tilt category & new-arrival cards, alternating signature-style editorial spreads, 4-step craftsmanship composition, and customer style stories slider.
  - **Home 2 (`pages/home-2.html`)**: Split-screen architectural fashion hero, expanding mood triptych panels, horizontal drag-to-scroll trend filmstrip, staggered occasion spread, interactive 5-pin *"Style It Your Way"* hotspot builder, and masonry campaign gallery with accessible lightbox.
- **Working Multi-Facet Product Filtering & Sorting (`pages/products.html`)**:
  - Filter across **Category**, **18 Ethnic Sub-Categories**, **Price Range (₹)**, **Size**, **Colour**, **Loom Fabric**, and **Occasion**, plus sorting (**Newest**, **Price Low to High**, **Price High to Low**), skeleton loading states, live result counts, and an interactive studio-zoom **Product Details & Styling Modal**.
- **Interactive Festive Colour Stories (`pages/festive-edit.html`)**:
  - Live swatch switcher (**Royal Red**, **Emerald Green**, **Champagne Gold**, **Blush Pink**, **Midnight Blue**) that dynamically updates featured outfit photography and page accent tokens.
- **Dark/Light Mode & RTL Support**:
  - Automatic OS `prefers-color-scheme` detection + persistent header toggle, alongside full `dir="rtl"` Right-to-Left layout switching.
- **WCAG 2.1 AA Accessible & SEO Ready**:
  - Skip-to-content links, semantic single-H1 hierarchy, keyboard navigation, focus-visible rings, `prefers-reduced-motion` support, Open Graph tags, `ClothingStore` JSON-LD schema, `sitemap.xml`, and `robots.txt`.

---

## Customization Overview

See the `documentation/` directory for step-by-step instructions:
- **[Installation Guide](documentation/installation-guide.md)** — Local preview, Apache/Nginx 404 setup, and static deployment.
- **[Customization Guide](documentation/customization-guide.md)** — Updating `:root` brand colours, Google/local fonts, products, Formspree/Netlify forms, Mailchimp/ConvertKit, Google Maps, and WhatsApp click-to-chat.
- **[Page Structure & SEO](documentation/page-structure.md)** — Section breakdown for all 7 pages, image naming rules, and schema metadata.
- **[Credits, Changelog & Support](documentation/credits-changelog-support.md)** — Typography, icon, photography credits, version history, and support guide.

