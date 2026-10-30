---
title: Fable Discover (Drift)
summary: A browse experience that finds books by how their covers look and feel. I prototyped it with vision embeddings and LLM-tagged "vibes", and it shipped on Fable as Discover.
order: 2
role: "TODO: e.g. PM, built the prototype end to end"
timeframe: "2026"
stack: [Python, PyTorch, DINOv2, SigLIP, Claude API, scikit-learn]
metrics:
  - { label: "Most-shelved books embedded", value: "10K" }
  - { label: "Microgenres from clustered vibe tags", value: "25" }
  - { label: "Tags in the requested 4–6 words", value: "~96%" }
links:
  - { label: "Live", href: "https://fable.co/discover" }
---

## Problem

Fable's discovery surfaces were driven by metadata: genre, lists and social signals. But
people browse a bookstore table by look and feel, and covers aren't accidental. Publishers
pay to make a thriller look like a thriller and a romantasy look like a romantasy.

**Hypothesis:** cover similarity on its own is a useful discovery signal ("another book that
*feels* like this one") and can power browsing at a finer grain than any genre field.

The prototype had two jobs: test whether the signal is real and legible to people, and make
it demoable enough that stakeholders could feel the answer rather than read about it.

## Approach

I built a seven-step pipeline and a single-file static web app, called Drift.

**Candidates.** The covers of Fable's 10,000 most-shelved books, deduplicated by book family
so that alternate editions don't crowd the results.

**Three similarity signals.**

- **DINOv2**, a self-supervised vision model, captures how a cover is *constructed*:
  composition, illustration style, typography as shape.
- **SigLIP**, trained on images paired with text, ran alongside it as a comparison.
- **Color.** DINOv2 is trained to ignore color shifts, but palette is a big part of a cover's
  vibe. I added a perceptual color histogram (CIELAB, Hellinger-transformed) so that cosine
  similarity measures palette overlap.

**Blending.** Raw color similarities bunch high and would swamp a straight average, so both
signals are z-scored per anchor book before mixing. A slider sets the weight. I precomputed
exact top-60 neighbors at every slider stop, so the app needs no server.

**Near-duplicate filter.** Anything above 0.95 DINOv2 similarity to the anchor is dropped.
Those are reissues of the same cover, not discoveries.

**Vibes.** To give people a starting point besides "type a book", Claude tagged each cover
with a 4–6 word vibe (e.g. "brooding gilt romantasy opulence"), and the prompt forbade words
from the title or author. I embedded the tags and clustered them with k-means into 25
microgenres, then named each by hand from its exemplars.

**Interface.** The anchor book sits in the center, with similar covers packed around it.
Distance from the center maps to similarity rank. Click any cover to re-center and drift.
Every state lives in the URL, so any view is a shareable link.

## Evaluation

The question at this stage was whether the signal is legible, so the evaluation was
qualitative on purpose:

- **Model comparison.** Side-by-side contact sheets of SigLIP and DINOv2 neighbors for
  benchmark titles.
- **Tag review.** A spot-check of vibe tags. About 96% of 9,997 tags came back at the
  requested 4–6 words.
- **Cluster review.** Each cluster's exemplars and signature terms, which I used to name the
  25 vibes.
- **Hallway demos** using shareable links.

## Results

- **SigLIP reads the title text; DINOv2 doesn't.** SigLIP effectively OCRs the cover, so
  *The Silent Patient* leads to *The Silent Wife*. It finds books that would be *described*
  the same way. DINOv2 finds books that are *designed* the same way, which makes it the right
  base for a "feels similar" product.
- **Structure plus color is most of "vibe", and the best mix varies by genre.** No single
  weight felt right everywhere, which is why the slider exists.
- **Deduplication is a product requirement, not data hygiene.** Visual similarity's failure
  mode is returning the same cover in ten editions.
- **Cover vibes match human genre intuition at a finer grain than the genre taxonomy.**
  *Crimson obsession*, *Blood & roses* and *Gothic romance* came out as distinct, neighboring
  romantasy vibes.
- **Naming the vibe builds trust.** Showing the tag on the center book made people trust the
  wall more, because the machine said why.

The prototype became [Discover on fable.co](https://fable.co/discover), which adds building
a shelf as you browse, saving it to your Fable library, and sharing it by link.

TODO: Your role in the production launch, and any usage or engagement numbers you can share
publicly.

## What I'd do next

- **Test whether it moves discovery metrics:** a "looks similar" shelf on book pages, or vibe
  shelves, A/B tested against the existing modules.
- **Build a real serving path:** replace the precomputed file with a nearest-neighbor index
  behind an API.
- **Expand past the top 10K books.** Embedding is cheap and tagging scales linearly; the
  deduplication has to come along.
- **Turn vibe naming and art into an editorial or generative process** so it scales past 25.
