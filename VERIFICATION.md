# Approved portfolio update verification

The user reviewed the isolated preview and authorized GitHub publication on 27 October 2026. The following checks describe the approved source; deployment and live-site results are recorded in the publication receipt saved with the chat outputs.

## Current publication checks

- The canonical checkout was clean before promotion. Fetched origin/main and verified it matched HEAD before copying the approved source.
- Root-domain and /delacruz-studio-portfolio/ builds each prepared 17 content pages plus 404.html and verified portfolio images, responsive derivatives, fonts, and license files.
- JavaScript syntax checks passed for app.js and effects.js.
- Shared HTML shells were regenerated for all routes, including all 12 case studies, contact, software, and gallery pages.

## Latest approved local browser evidence

- The intro-only opening was measured at 1183×1282: intro top 0, bottom 1282.09, Selected Work top 1282.09, and header bottom -2px. Responsive checks at 358×836, 800×642, and 1440×895 kept following content below the opening view within subpixel rounding and had no horizontal page overflow.
- First native scroll revealed the header; subsequent down/up scrolling retained hide/reveal behavior. Top-edge pointer reveal and visible keyboard focus were checked. At phone width the menu stayed available while open; Escape closed it and returned focus. Keyboard Enter could reveal/open Menu directly from the opening screen.
- Header background computed transparent and bottom border 0px while revealed over the gallery. The homepage header is fixed, with sticky positioning on other routes.
- Both hero actions were hidden initially and visible after scrolling. Their document position stayed 821.10px, height 56px, and hero height 1281.92px, so revealing them caused no layout jump. At 398px the initial actions were hidden and the page fit horizontally.
- Back to Top reproduced the sticky-anchor failure at scrollY 5388 before the fix. It now reached scrollY 0 from homepage, complete gallery, and phone footers. Initial #top entry also reached zero. View Projects still reached #work at y100.
- Native pointer movement changed carousel orientation while its anchor stayed left 279.579px/top 253.757px in the 1184px view. A native drag changed the base angle from 42 to 70 degrees without navigation; arrow-key rotation retained card focus. At the 800px breakpoint a sampled tilted fan fit the page. At 358px cursor tilt was zero, the horizontal gallery scrolled to about 264px, and no page overflow was measured. Reduced-motion safeguards were reviewed in source.
- Open the complete gallery matched the software button’s computed font, padding, border, radius, gap, minimum height, and plus glyph, and opened all 12 project cards.
- Focus top border, project-caption bottom border, and following About top border were 0px on desktop and phone. The instruction label computed hidden, with all six project links retained.
- Final captured browser console warnings/errors were empty.

## Retained baseline browser evidence

- At 398, 799, 1184, and 1426 CSS pixels, the About text and portrait occupy adjacent columns, the image meets the contact section with zero measured gap, and all four biography paragraphs remain. No horizontal page overflow was measured. The original portrait proportions are preserved.
- About and A closer look share the same section heading size. Earlier checks at 358, 798, 800, 988, 1440, and 1910 CSS pixels confirmed matching computed sizes.
- The project index shares the services green sweep and inverse text on hover and keyboard focus. Native pointer hover, Tab focus, and Enter navigation to MSG Farm were checked. All 12 destinations remain.
- The carousel scene has visible overflow and no clip path. The now-hidden instruction label preserves its spacing so hiding it does not shift the fan.
- The Work navigation label has no project count. The project index still correctly lists 12 projects.
- Buttons use square corners on the homepage, project, inquiry, and software pages. The mobile menu and form fields are square as well. Larger action arrows were inspected on desktop: 28px in buttons, 24px in text links, and 20px in compact carousel captions.
- At 398 CSS pixels, the homepage, project 1, contact, and software page had no horizontal page overflow; checked controls had 0px radii, fitting labels, and hit areas at least 44px high.
- The homepage inquiry button opened /contact/. Name, email, and message fields remain required. The project index toggled closed and open with all 12 links present.
- The homepage description now emphasizes site planning, landscape design, and 3D visualization, with no mention of interiors in that description.

## Retained interaction evidence

Previous baseline browser checks exercised the mobile menu, service expansion and Images/Description tabs, keyboard tab navigation, project fan dragging and arrow keys, software-carousel dragging and destinations, and required empty-form validation. All 12 project routes, the gallery, inquiry, software, and missing-page views were visited in that baseline. The current update retains these behaviors.

The removed carousel toolbar, Selected views label, Pause icons button, and About me / My Story headings remain absent. Reduced-motion preferences, pointer/focus pausing, and offscreen/document-visibility handling remain. The legacy #my-story anchor is preserved.

## Scope and limits

These checks use a local desktop browser with responsive widths; they are not physical-device tests. No form was submitted and no email app was launched. The form opens a draft for the visitor to review and send, and does not send or store messages. The homepage has one inquiry action; the separate contact page retains Email me without printing the address. External social-account content and performance benchmarks were not audited.

No dependencies, tracking scripts, external image services, or mail-service credentials were added. The site remains independent of Framer and uses the existing GitHub Actions Pages workflow.

## Browser branding update — 27 October 2026

The user approved removing | nyco from the homepage tab title and replacing the favicon with the supplied DCS light/dark artwork. Root and Pages-prefix builds passed. All 18 generated HTML shells include the new title and both icon links. Source and built icon hashes match the supplied originals. Local browser DOM confirmed the title Dela Cruz Studio. and the theme-specific favicon metadata. The build now validates that both icon assets exist. No page layout or contact behavior changed in this revision.

## Opening carousel fit — 27 October 2026

The approved correction raises the fan to balance it beside the centered left copy, limits desktop card size against viewport height, and caps the scene height. At 1910×1075 the left copy top remained 291.52px before and after, while the corrected fan was fully visible at sampled bounds 195.74–862.03px. At 1419×719 all four cursor-corner samples fit vertically within 32.12–663.39px. At 1419×600 a bottom-corner tilt fit within 58.74–563.58px and ArrowRight retained project focus. At 400×821 the native mobile track remained active and document width stayed 400px. Browser warning/error capture was empty. These are browser measurements, not physical-device results.

Root and Pages-prefix builds and JavaScript syntax checks passed. This revision changes desktop carousel sizing/position and its stylesheet cache key; project assets, copy, mobile layout, and interaction handlers are unchanged.
