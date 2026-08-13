# Editing seminar content

The complete maintenance workflow—including where to put poster images—is in the project-level [`README.md`](../README.md).

Add each talk to `seminars.md` using this format:

```md
### unique-talk-name
Date: 2026-10-22
Start: 15:00
End: 16:00
Speaker: Speaker Name
Affiliation: University Name
Website: https://speaker.example.com
Poster: 20261022.png
Title: The talk title
Abstract:
The abstract can contain one or more paragraphs.
```

Place `20261022.png` in the project-level `posters/` folder. Leave `Poster:` empty to show the RMTA placeholder.

Dates and times are Beijing time. The Upcoming and Past sections are determined automatically.

## Mathematics

Use standard TeX notation inside a title or abstract:

- Inline: `\(x^2 + y^2 = 1\)` or `$x^2 + y^2 = 1$`
- Displayed: `\[ ... \]` or `$$ ... $$`

Example:

```text
\[
H_M = A_0 \otimes I_M + \frac{1}{\sqrt{M}} \sum_{i=1}^{n} A_i \otimes G_i.
\]
```
