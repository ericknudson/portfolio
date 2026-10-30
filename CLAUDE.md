@AGENTS.md

# Eric Knudson — Portfolio

Personal portfolio site for Eric Knudson, a product manager who ships production code.

## Who it's for

Hiring managers and recruiters for **AI/ML product** and **consumer product** roles. A visitor
should leave with one idea: Eric defines the problem, builds the thing himself, and measures
whether it works.

## Positioning and voice

- PM first, builder second. Lead with the product decision and who it served, then show the code
  and data that back it up.
- Be specific: real numbers, real tradeoffs, what failed. Don't use adjectives like "passionate",
  "innovative" or "cutting-edge", and don't pad with buzzwords.
- First person, plain sentences, short paragraphs.
- **Never invent content.** Eric supplies all project copy, metrics, dates and links. If something is
  missing, leave a visible `TODO:` placeholder and don't fill it in with plausible-sounding text.

## Projects

Display order is set by `order` in frontmatter.

1. **Your Name in Miles** — *lead case study*, the only `featured: true` entry. Present it as a
   **ranking system with an evaluation**: how candidates are generated and scored, how ranking
   quality was measured (metrics, baselines, test set), and what the results showed. The
   evaluation is the centerpiece, not a footnote.
2. **Fable Discover (Drift)**
3. **SOM Course Name Generator**
4. **King County Home Price Predictor**

### Sources

| Project | Code | Live |
| --- | --- | --- |
| Your Name in Miles | github.com/ericknudson/your-name-in-miles | your-name-in-miles.vercel.app |
| Fable Discover (Drift) | (not public) | fable.co/discovery |
| SOM Course Name Generator | github.com/ericknudson/som-course-generator | Runs in the browser on its project page. The old Heroku app is gone. |
| King County Home Price Predictor | github.com/ericknudson/king-county-home-price-generator | knudson.shinyapps.io/kingcounty |

The `som-course-generator` repo's `master` branch was later repurposed as a **Fable club** name
generator (commit `4f00028`, May 2022). The SOM course version is the commit before it, `773462d`.

## Structure

- `src/content.config.ts` — `projects` collection schema (Zod). Change fields here first.
- `src/content/projects/*.md` — one Markdown file per project. The filename is the URL slug
  (`/projects/<slug>`).
- `src/layouts/BaseLayout.astro` — HTML shell, global styles, header and footer.
- `src/layouts/ProjectLayout.astro` — case-study page: title, summary, meta (role, timeframe,
  stack, links), an optional key-results strip (`metrics`), then the Markdown body.
- `src/pages/index.astro` — home: intro, the featured case study, then the other projects.
- `src/pages/projects/[slug].astro` — builds one static page per project entry. Its `demos` map
  attaches an interactive component (from `src/components/`) to a project, shown above the body.
- `src/data/` — static data for demos, e.g. `som-courses.json` for the SOM course generator.

## Case-study body convention

Use `##` headings, in roughly this order:
Problem → Approach → Evaluation → Results → What I'd do next.
Leave out sections that don't apply to a project. Don't leave empty headings.

## Design and code conventions

- Minimal and typographic: one column, system font stack, generous whitespace, one accent color.
  Styling uses CSS custom properties defined in `BaseLayout.astro`.
- Plain Astro and CSS. Don't add a UI framework, Tailwind or client-side JS unless a feature needs it.
- Static output only, no SSR adapter.
- Use semantic HTML, give every image alt text, and keep the site readable at 375px wide and in dark mode.
- Run `npm run build` before you call a change done. It type-checks frontmatter against the schema.
