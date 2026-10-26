# Verification

Checked October 26, 2026, using the local browser preview and static build.

## Browser and source checks

- PASS: build creates 17 route pages, including home, projects, 12 case studies, tools, software, and contact, plus `404.html`.
- PASS: all 19 bundled image/font assets exist; the home page reports 12 project cards and no broken images.
- PASS: all 12 project routes render the matching source title, image path, and next-project destination. The last project links back to the first.
- PASS: a project card opens its case study and the back link returns to the work section. Software navigation and missing-page recovery work.
- PASS: responsive measurements at approximately 358, 389, 769, 1024, and 1440 CSS pixels report no horizontal overflow on Home. All 12 detail pages report no horizontal overflow at 1440 pixels; the contact page reports none at 389 pixels.
- PASS: mobile Menu opens, Escape closes it, selecting Work closes it and navigates to the section. Keyboard Tab produces a visible solid focus outline.
- PASS: submitting an empty inquiry form focuses the required Name field. Email is required. The copy button reports that the supplied address was copied.
- PASS: completing the form produces the explicit email-draft feedback. The browser blocks the external mail-app navigation; no message was sent.
- PASS: temporarily removing portfolio data renders the error view with an email fallback. Restoring the data and clicking Try again recovers all 12 project cards.
- PASS: JavaScript syntax check succeeds. Browser console inspection before the intentional missing-data test reports no errors or warnings.

## Antislop delivery gate

- PASS R-02: no em dashes in delivered UI copy.
- PASS R-03: responsive reflow, labelled mobile menu, 44px minimum controls, and measured overflow checks described above.
- PASS R-17, R-18, R-36, R-38, C-5: project facts and biography derive from the supplied site; no invented statistics, testimonials, or customer claims.
- PASS R-23: the original brand mark, portrait, tool graphics, project images, and typefaces are retained.
- PASS R-24, R-26, C-2: navigation has built sections or pages; controls have navigation, menu, copy, retry, or mail-draft behavior. External destinations match the supplied reference.
- PASS R-25: green text #435242 on #dcdcd6 is 6.04:1. Secondary text #566052 is 4.78:1. Component boundaries #71796c are 3.28:1. White project text uses a 78% dark backing, including over the lightest image areas.
- PASS R-27: initial loading, empty-gallery, image-failure, missing-data, retry, and missing-page states exist. Missing-data recovery was exercised.
- PASS R-28: no generic FAQ.
- PASS R-32: semantic links, buttons and labelled inputs; visible focus styles; mobile Escape handling tested.
- PASS R-33: UI features are implemented in their HTML, CSS, and JavaScript sources.
- PASS R-34: one brand-derived light theme, no incomplete theme toggle.
- PASS R-35: build, browser routing, menu, focus, form validation, copy, draft feedback, and recovery checks completed. Native mail handoff and physical-device coverage are listed as limits below.
- PASS Purpose Gate R-01, R-04, R-06 to R-10, R-12 to R-14, R-19, R-22: visual choices have a source-based purpose in DESIGN.md. Image scrims serve legibility; arrows identify navigation or external destinations; motion is restrained; no decorative grids, glow, or unrelated illustrations.
- PASS Liveliness: ENERGY 2 / RHYTHM 3 / MOTION 1. Portrait, green type, original DCS mark, editorial biography, and large project images carry the identity. Each main section has a focal point and distinct spacing.
- PASS Quality Locks R-05, R-11, R-15, R-16, R-20, R-21, R-29 to R-31, C-1 to C-4: the supplied portfolio determines content, palette, type, composition, and behavior. Action labels describe their destinations. No generic marketing sections or fabricated content were introduced.

## Verification limits

Opening the visitor's native mail application was blocked by browser security policy. The form's draft feedback was visible, but native mail launch and sending were not verified. Sending remains a visitor action in their mail application.

Responsive checks were performed in a browser with viewport overrides, not on a physical phone. Physical-device keyboard, safe-area behavior, and 200% text zoom were not separately tested.

This is a responsive visual recreation, not a pixel-for-pixel Framer runtime export. The original published biography and project data were used alongside the updated introduction visible in the editor.
