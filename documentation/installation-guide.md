# Installation & Deployment Guide

## 1. Prerequisites
Zariya is built with pure **HTML5, CSS3, and vanilla ES6+ JavaScript**. No Node.js build pipeline, framework, or database is required.

## 2. Running Locally
Open a terminal in the project root directory and launch any static HTTP server:

### Option A — Python 3
```bash
python -m http.server 8080
```
Then visit: `http://localhost:8080/pages/index.html`

### Option B — VS Code Live Server
1. Open the project folder in Visual Studio Code.
2. Right-click `pages/index.html` and choose **Open with Live Server**.

## 3. Production Deployment

### Netlify / Vercel / Cloudflare Pages
1. Connect your Git repository or drag-and-drop the project directory.
2. Leave the **Build Command** blank and set the **Publish Directory** to `.` (root).
3. Configure custom 404 routing to serve `/pages/404.html` when a route is missing:
   - **Netlify (`_redirects`)**: `/* /pages/404.html 404`
   - **Apache (`.htaccess`)**: `ErrorDocument 404 /pages/404.html`
   - **Nginx**: `error_page 404 /pages/404.html;`

### Pre-Launch / Maintenance Mode
To put the boutique into pre-launch trunk show mode prior to opening day, point your root redirect temporarily to `/pages/coming-soon.html`.

## 4. Pre-Launch Checklist
Search across the codebase for `TODO:` comments to update:
- Production domain in `sitemap.xml`, `robots.txt`, and `<link rel="canonical">` tags
- Boutique street address, telephone number, and opening hours in `pages/contact.html` and JSON-LD blocks
- Formspree endpoint (`data-formspree-endpoint`) or Netlify form settings in `pages/contact.html`
- Mailchimp / ConvertKit `action` URL on `.js-newsletter-form` forms
- Official WhatsApp Business phone number in `.whatsapp-float` links

