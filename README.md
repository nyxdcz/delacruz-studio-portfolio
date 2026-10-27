# Dela Cruz Studio portfolio

Independent HTML, CSS, and JavaScript recreation of Nyco's existing Framer portfolio. The site includes the home page, biography, software page, project index, all 12 case studies, contact page, and a missing-page view.

The original portrait, logo, project images, and tool graphics are included locally. The approved typography uses locally bundled Inter Display for headings and body copy, and Martian Mono for navigation, labels, and indices. Their SIL Open Font Licenses are included in `licenses/` and copied into the built site. The website does not load the Framer runtime or depend on Framer hosting. Social profiles remain external links.

## Preview locally

From this folder:

```sh
npm run build
npm run dev
```

Open http://127.0.0.1:43821. No package installation is required; the build needs Node.js and the preview uses Python 3.

## Edit the site

- `dist/app.js`: page content, navigation, contact behavior, and rendering.
- `dist/style.css`: base styles, project and contact layouts, and focus styles.
- `dist/editorial.css`: approved editorial homepage, shared navigation/footer, numbered gallery, and expandable services.
- `dist/effects.js` and `dist/effects.css`: project carousel, two-row tools carousel, service tabs and transitions, merged About section, and motion/accessibility handling.
- `dist/projects.json`: all 12 project titles, locations, dates, types, and descriptions.
- `dist/assets/`: locally bundled images and fonts.
- `dist/index.html`: shared page shell and metadata.
- `build.mjs`: creates static folders for each route. Run this after editing the shared HTML or project list.
- `tools/prepare-images.py`: macOS helper to regenerate 680px and 1280px gallery images from the original project files. These derivatives are committed, so CI does not need this helper.

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

The contact address is `nyxdcz@gmail.com`. It is available through the inquiry page’s Email me button rather than printed on the site. The homepage uses a single project inquiry button that opens that page. The form validates name, email, and message, then opens a draft in the visitor's email application. It does not send or store inquiries itself. Visitors review and send the draft in their mail app. No email service credentials are needed.

## Reference and scope

Content reference: https://delacruzstudio.framer.website/ and the supplied Framer desktop project. The approved update preserves DCS branding and original imagery while adopting the editorial typography, project numbering and interactions discussed using https://titarvl.framer.website/ as a reference. The homepage includes an unclipped project fan beside the introduction, four featured projects, the full 12-project index, expandable services with image/description tabs, a two-row interactive tools carousel before the scrolling project feature, and one continuous About description beside an enlarged portrait that meets the right edge and the green contact section. Project index rows share the service hover and keyboard-focus sweep. Buttons use consistent square corners across the homepage, case studies, contact and software pages, with larger action arrows. The Work navigation label has no count. Case studies retain original descriptions and full-resolution images. The user requested removal of the carousel toolbar, Pause icons, Selected views and the About me / My Story labels. Hover/focus pausing, reduced-motion preferences and offscreen/document visibility handling remain. On phones, the project fan becomes a horizontal swipe gallery.

See `VERIFICATION.md` for checks and known verification limits.
