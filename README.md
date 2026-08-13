# RMTA Online Seminar Website

This is a static website. For routine updates, edit only the seminar Markdown file and add poster images to the poster folder. Do not edit the generated HTML by hand.

## The regular update workflow

### 1. Add a poster image

Put every new poster directly inside this folder:

```text
posters/
```

For example:

```text
posters/20260821.png
```

Recommended filename format:

```text
YYYYMMDD.png
```

PNG, JPG, JPEG, and WebP images can be used. Keep filenames simple: use letters, numbers, hyphens, and underscores, with no spaces if possible.

Do not put new posters:

- Next to `index.html`
- In `dist/posters/`—that folder is generated automatically
- In `content/`

### 2. Edit the seminar content

Open:

```text
content/seminars.md
```

Add or edit a talk. The `Poster:` value must be only the filename, not a full path:

```md
### benoit-collins-2026
Date: 2026-08-21
Start: 15:15
End: 16:00
Speaker: Benoît Collins
Affiliation: Kyoto University
Website: https://benoitcollins.github.io/index.html
Poster: 20260821.png
Title: Operator Norm Estimates of Lehner-type for GUEs via Concentration of Measure
Abstract:
Add the abstract here.
```

The two names must match exactly:

```text
Markdown: Poster: 20260821.png
File:     posters/20260821.png
```

Filenames are case-sensitive on GitHub Pages. For example, `Poster.PNG` and `poster.png` are different filenames.

If no poster is available, leave the value empty:

```md
Poster:
```

The website will show the RMTA poster placeholder.

### 3. Rebuild the website

In Terminal, change to this website folder and run:

```bash
npm run build
```

The build checks that every named poster exists. If a file is missing or its name does not match, it reports the affected filename and speaker.

### 4. Review the result

Open the generated file in a browser:

```text
index.html
```

If it was already open, reload the page. A browser tab showing another copy of the project will not reflect these changes, so check that the tab's path points to this folder.

## Which files are editable?

```text
content/seminars.md   Edit seminar details and abstracts
posters/              Add original poster images here
logo.jpg              RMTA logo
```

Generated files—do not edit these manually:

```text
index.html            Generated local webpage
dist/                 Generated publication-ready website
dist/index.html       Generated publication webpage
dist/posters/         Generated copies of poster images
```

Running `npm run build` replaces the generated files using the current Markdown and original images.

Organizer entries in `content/seminars.md` use this format:

```text
- Name | Affiliation | Homepage URL
```

## Live preview while editing

Run:

```bash
npm run dev
```

Then open <http://localhost:3000>. Changes to `content/seminars.md`, `posters/`, or the site design rebuild automatically. Stop the preview with `Control-C` in Terminal.

## Mathematics in Markdown

TeX-style mathematics is supported in titles and abstracts through MathJax.

Inline formula:

```text
\(x^2 + y^2 = 1\)
```

Displayed formula:

```text
\[
H_M = A_0 \otimes I_M + \frac{1}{\sqrt{M}} \sum_{i=1}^{n} A_i \otimes G_i.
\]
```

Readers need an internet connection when first loading the page so MathJax can load.

## Publishing

Upload the contents of `dist/` to any static web host. If the GitHub Pages workflow is installed in the repository, pushing changes to the `main` branch builds and publishes the site automatically.

## First-time requirement

The build requires Node.js. Verify it with:

```bash
node --version
npm --version
```

If either command is missing, install the current Node.js LTS release from <https://nodejs.org/en/download>, then close and reopen Terminal.
