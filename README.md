# Receiving Tools (ec-receiving.web.app)

Everything under `public/` is the live site. This repository is the working copy.

## How changes go live

1. Make changes on a branch and open a pull request.
2. GitHub deploys the branch to a temporary **preview address** and posts it on the pull request.
3. Test the preview with real screenshots and data.
4. Merge the pull request into `main`, and GitHub deploys it to the **live** site.

`deploy.bat` still works from the home PC as a manual fallback. It pulls the latest from GitHub
first and refuses to deploy if that fails, so an out-of-date home copy can't overwrite newer changes.

## Offspec Generator

- One permanent address: `public/Offspec-Generator.html`. Versions are dotted (6.8, 6.9, ...)
  and shown only in the app's badge and page title. **Never rename the file.**
- Old addresses (`Offspec-Generator.v67.html`, `.v9.html`, any `.v*.html`, and the older
  `gen-data.offspec.html`) are redirected to it in `firebase.json`, so old bookmarks keep working. Don't remove those redirects.
- The screenshot OCR parser (`manifest-ocr` v1.1) is inside the generator in the
  `<script id="manifest-ocr-v1">` block. `tools/manifest-ocr-lab.html` is a standalone test page
  with a copy of the same parser. Open it, paste SAP GUI or Fiori screenshots, and use Copy JSON
  to report misreads. If you change the parser, update both copies.

## H-Codes bookmarklet

The live install page is `public/hcode-export.html` (linked from the dashboard). Its drag button holds
the bookmarklet code. The source pages live at the repo root (`hcodes_interactive_bookmarklet_v*.html`).
To update it, copy the new `javascript:` link into the install page's drag button and update the version label.

## Archive

`archive/` holds retired pages that are no longer deployed. Their old addresses redirect.

## Version history

- **7.1** (2026-10-06): In Q Offspec mode, using the FLASH or POS OXIDATION phrase also puts
  "D001 NEEDS ADDED TO MANIFEST." on the next empty miscellaneous line below it (once only).
- **7.0** (2026-10-06): The date picker has ‹ › arrows to page back (and forward, up to this month)
  through months, in both Gen-Data and Q Offspec modes. PageUp/PageDown do the same. Reopening
  the picker on an older date opens on that date's month.
- **6.9** (2026-10-02): The paste box is half the height, and the gap after the Gen-Data preview
  is gone. The same paste box (ZSD64 text or screenshot) now also sits in Q Offspec mode, under
  Generate / Clear.
- **6.8** (2026-10-02): New position-based OCR for both the classic SAP GUI and Fiori manifest
  screens. Fixed-name file with redirects. Includes the 2026-09-28 fixes (Excel logo, live notification
  preview, no `1)` numbering) and the fit-to-page print fix.

## Working from work

Ask Claude in the "Receiving Tools" project to make the change. Claude pushes a branch and opens a
pull request. The preview address shows up on the pull request. Say "ship it" and Claude merges it,
then the change goes live. No home PC is needed.
