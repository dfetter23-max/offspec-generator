# Receiving Tools (ec-receiving.web.app)

Everything under `public/` is the live site. This repository is the working copy.

## How changes go live

1. Make changes on a branch and open a pull request.
2. GitHub deploys the branch to a temporary **preview address** and posts it on the pull request.
3. Test the preview with real screenshots and data.
4. Merge the pull request into `main`, and GitHub deploys it to the **live** site.

`deploy.bat` still works from the home PC as a manual fallback.

## Offspec Generator

- One permanent address: `public/Offspec-Generator.html`. Versions are dotted (6.8, 6.9, ...)
  and shown only in the app's badge and page title. **Never rename the file.**
- Old versioned addresses (`Offspec-Generator.v67.html`, `.v9.html`, any `.v*.html`) are
  redirected to it in `firebase.json`, so old bookmarks keep working. Don't remove those redirects.
- The screenshot OCR parser (`manifest-ocr` v1.1) is inside the generator in the
  `<script id="manifest-ocr-v1">` block. `tools/manifest-ocr-lab.html` is a standalone test page
  with a copy of the same parser. Open it, paste SAP GUI or Fiori screenshots, and use Copy JSON
  to report misreads. If you change the parser, update both copies.

## Version history

- **6.8** (2026-10-02): New position-based OCR for both the classic SAP GUI and Fiori manifest
  screens. Fixed-name file with redirects. Includes the 2026-09-28 fixes (Excel logo, live notification
  preview, no `1)` numbering) and the fit-to-page print fix.

## Working from work

Ask Claude in the "Receiving Tools" project to make the change. Claude pushes a branch and opens a
pull request. The preview address shows up on the pull request. Say "ship it" and Claude merges it,
then the change goes live. No home PC is needed.
