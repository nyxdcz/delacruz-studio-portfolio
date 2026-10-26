# Dela Cruz Studio portfolio

Independent HTML, CSS, and JavaScript recreation of Nyco's existing Framer portfolio. The site includes the home page, biography, software page, project index, all 12 case studies, contact page, and a missing-page view.

The original portrait, logo, project images, tool graphics, and Neue Montreal fonts are included locally. The website does not load the Framer runtime or depend on Framer hosting. The existing FlipHTML5 portfolio and social profiles remain external links.

## Preview locally

From this folder:

```sh
npm run build
npm run dev
```

Open http://127.0.0.1:43821. No package installation is required; the build needs Node.js and the preview uses Python 3.

## Edit the site

- `dist/app.js`: page content, navigation, contact behavior, and rendering.
- `dist/style.css`: colors, typography, responsive layouts, and focus styles.
- `dist/projects.json`: all 12 project titles, locations, dates, types, and descriptions.
- `dist/assets/`: locally bundled images and fonts.
- `dist/index.html`: shared page shell and metadata.
- `build.mjs`: creates static folders for each route. Run this after editing the shared HTML or project list.

## Host independently

Upload the contents of `dist/` to any static web host that supports directory index files and a custom `404.html`. Each project has its own generated `projects/<id>/index.html`, so direct links work without special client-side routing rules.

This project also contains its Sites hosting configuration in `.openai/hosting.json`. The exact site identity is retained there for future updates. The hosted review starts private to the owner.

## GitHub Pages

The GitHub repository is `nyxdcz/delacruz-studio-portfolio`. Its Pages address is https://nyxdcz.github.io/delacruz-studio-portfolio/ once the first deployment succeeds. The GitHub Pages website is public.

The workflow in `.github/workflows/pages.yml` builds and deploys changes pushed to `main`. In the repository's Settings > Pages, the publishing source should be **GitHub Actions**.

The build reads the Pages base path and generates `_site/`. Asset links, project routes, home-section navigation, and direct links work under the repository's URL prefix. The same source still builds for a root domain using `npm run build`.

To preview the Pages build locally:

```sh
SITE_BASE_PATH=/delacruz-studio-portfolio/ SITE_OUTPUT_DIR=_site node build.mjs
```

Serve `_site/` under a folder named `delacruz-studio-portfolio` to reproduce the deployed URL structure. `_site/` is generated and ignored by Git. `.openai/` is excluded from the GitHub copy because it belongs to the separate Sites host.

## Contact behavior

The contact address is `nyxdcz@gmail.com`. The form validates name, email, and message, then opens a draft in the visitor's email application. It does not send or store inquiries itself. Visitors review and send the draft in their mail app, or use the direct email link and copy button. No email service credentials are needed.

## Reference and scope

Reference: https://delacruzstudio.framer.website/ and the supplied Framer desktop project. This is a close visual recreation with responsive reflow, accessible contrast, normal navigation, and locally bundled assets. Framer's letter-by-letter biography animation, draggable tool tags, and automatic marquee are replaced with readable static content and restrained interaction feedback.

See `VERIFICATION.md` for checks and known verification limits.
