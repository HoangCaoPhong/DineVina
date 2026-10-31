# PA2 consistent PDF export
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

Run `npm ci --prefix tools` from the package directory, then `npm --prefix tools run render`. The exporter expects Google Chrome at `/usr/bin/google-chrome`; set `PA2_CHROME` to another compatible Chrome/Chromium executable when needed. Install DejaVu Sans and DejaVu Sans Mono fonts for matching Vietnamese text. Playwright drives a separate headless process for local artifact rendering; it does not connect to personal browser sessions.

All nine primary PDFs use `print.css` and `export-settings.json`: A4, fixed margins, common type sizes, repeated table headings, diagram captions and page numbers. Mermaid is rendered before printing; raw Mermaid code stays in the editable Markdown. Dependencies are pinned in package-lock.json. PDF binary hashes can vary with browser version and creation time; the same inputs/settings preserve the common layout.

The exporter writes temporary HTML under `/tmp/dinevina-pa2-export`, renders local SVG diagrams to `evidence/diagrams/`, and records successful output/diagram counts in `evidence/pdf-export-log.json`. No remote content is required during rendering after dependencies are installed. It fails on broken images or Mermaid errors.

`PA2-Report.md` is rebuilt automatically from the individual reports and meeting files at the start of every export. Its introduction and contents are retained. A ZIP/manifest must be regenerated after any source or PDF changes. Use `python3 tools/package.py` for manifest and ZIP creation; the generated archive excludes itself and local dependency caches.
