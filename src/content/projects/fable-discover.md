---
title: Fable Dis*cover*
summary: >-
  Most book recommendation systems lean on metadata like genre and publisher descriptions,
  and ignore the cover, even though publishers put a lot of work into making covers signal a
  book's vibe. I took Fable's 10,000 most-shelved books, stripped out everything but the cover
  image, and built a new browsing experience that finds covers that feel alike. The first model I tried (SigLIP)
  mostly read the title text, so I switched to DINOv2 for visual style and blended in a separate
  color signal. After I handed off the prototype, it shipped as Discover on fable.co.
order: 1
role: Product manager. Built the prototype end to end
timeframe: "2026"
stack: [Python, PyTorch, DINOv2, SigLIP, Claude API, scikit-learn]
metrics:
  - { label: "Most-shelved books embedded", value: "10K" }
  - { label: "Microgenres from clustered vibe tags", value: "25" }
  - { label: "Tags in the requested 4–6 words", value: "~96%" }
media:
  type: video
  src: /media/fable-discover.mp4
  poster: /media/fable-discover.jpg
  alt: "The Fable Discover landing page: a search box over a slowly drifting wall of book covers."
links:
  - { label: "Live", href: "https://fable.co/discover" }
---

## Problem

Most book recommendation systems, Fable's included, lean on metadata: genre, publisher
descriptions, lists and social signals. They don't use the cover. Meanwhile, publishers put a
lot of effort into designing and choosing covers, so that a thriller looks like a thriller and
a romantasy looks like a romantasy.

When I wander around a bookstore, that's mostly what I'm doing: sizing up whether a book is my
vibe. We judge books by their covers. I wanted to know whether covers actually encode a book's
vibe.

**Hypothesis:** cover similarity on its own is a useful discovery signal ("another book that
*feels* like this one") and can power browsing at a finer grain than any genre field.

The prototype had two jobs: test whether the signal is real and legible to people, and make
it demoable enough that stakeholders could feel the answer rather than read about it.

## Approach

I built a seven-step pipeline and a single-file static web app, called Drift.

**Candidates.** The covers of Fable's 10,000 most-shelved books, deduplicated by book family
so that alternate editions don't crowd the results. I stripped out all other data about each
book, so the models saw nothing but the cover image.

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

**Vibes (proof of concept).** I also tested whether covers alone could define microgenres and
assign books to them. Claude tagged each cover with a 4–6 word vibe (e.g. "brooding gilt
romantasy opulence"), and the prompt forbade words from the title or author. I embedded the
tags and clustered them with k-means into 25 microgenres, then named each by hand from its
exemplars. In the prototype, these became "vibe doors": browsable shelves like *Crimson
obsession* and *Sunny meet-cute*.

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

After I handed it off, the cover-similarity browser shipped with light changes as
[Discover on fable.co](https://fable.co/discover). The live version lets you build a shelf as
you browse, save it to your Fable library, and share it by link. The vibe doors stayed a proof
of concept and didn't ship.

TODO: Any usage or engagement numbers you can share publicly.

## What I'd do next

- **Test whether it moves discovery metrics:** a "looks similar" shelf on book pages, or vibe
  shelves, A/B tested against the existing modules.
- **Build a real serving path:** replace the precomputed file with a nearest-neighbor index
  behind an API.
- **Expand past the top 10K books.** Embedding is cheap and tagging scales linearly; the
  deduplication has to come along.
- **Bring the microgenres to the product** as browse shelves, with an editorial or generative
  process for naming them so it scales past 25.
