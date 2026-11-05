# Customization Guide (Colours, Fonts, Content & Integrations)

## 1. Customizing the Boutique Colour Palette
Open `assets/css/style.css` and locate `:root` at the top of the file:

```css
:root {
  --maroon: #5A0F2E;   /* Primary royal oxblood maroon */
  --gold: #C9A24B;     /* Antique zari gold accent */
  --ivory: #FBF5EA;    /* Warm cream primary surface */
  --emerald: #0F4C45;  /* Secondary deep emerald */
  --blush: #F2D6D3;    /* Soft blush rose tint */
  --ink: #2A1520;      /* Rich aubergine-black body copy */
}
```
To adjust dark mode surfaces, edit `[data-theme="dark"]` inside `assets/css/dark-mode.css`.

## 2. Customizing Typography
All pages use three editorial Google Fonts:
- **Display Serif**: `Cormorant Garamond` (`--font-display`)
- **Body & UI Sans**: `Jost` (`--font-body`)
- **Script Flourish**: `Pinyon Script` (`--font-script`)

To switch fonts:
1. Update the `<link href="https://fonts.googleapis.com/css2?...">` tag in `<head>` across `pages/*.html` (or place `.woff2` files in `assets/fonts/`).
2. Update `--font-display`, `--font-body`, and `--font-script` in `assets/css/style.css`.

## 3. Adding or Editing Products (`pages/products.html`)
1. Duplicate any `<article class="tilt-card js-product-card ...">` inside `#products-grid` in `pages/products.html`.
2. Update its `data-*` attributes (`data-id`, `data-name`, `data-category`, `data-subcategories`, `data-price`, `data-price-formatted`, `data-sizes`, `data-color`, `data-fabric`, `data-occasion`, `data-badge`).
3. Add a unique `.jpg` and `.webp` photograph pair in `assets/images/` (never repeat an existing filename).
4. Add matching modal styling/care copy under `PRODUCT_DETAILS_MAP` in `assets/js/main.js`.

## 4. Connecting Third-Party Integrations
- **Enquiry Form (Formspree / Netlify)**:
  - For **Netlify Forms**, keep `data-netlify="true"` on `#boutique-enquiry-form` in `pages/contact.html`.
  - For **Formspree**, replace `https://formspree.io/f/YOUR_FORM_ID` in `action` and `data-formspree-endpoint` with your Formspree endpoint URL.
- **Newsletter (Mailchimp / ConvertKit)**:
  - Replace `action="#"` on `.js-newsletter-form` elements in the footer and `pages/coming-soon.html` with your list's form action URL.
- **Google Maps**:
  - Replace the `<iframe class="map-iframe" src="...">` embed URL in `pages/contact.html` with the iframe URL from Google Maps -> Share -> Embed a map.
- **WhatsApp Concierge**:
  - Replace `919820012345` in `https://wa.me/919820012345` links with your international WhatsApp Business number (digits only, no `+` sign).

