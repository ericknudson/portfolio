---
title: Your Name in Miles
summary: >-
  Spell any word with letters found in my Strava GPS tracks. Each letter is one continuous
  stretch of a real run, ride or hike. Under the hood it's a ranking problem: for each letter I
  generate candidate stretches across 172 activities, score them by how closely they match the
  letter's shape and by a handwriting model trained on EMNIST, then re-rank so the runners-up
  aren't the same stretch of road. Inspired by NASA's *Your Name in Landsat*.
order: 3
role: "TODO"
timeframe: "TODO"
stack: [Python, PyTorch, NumPy, SciPy]
metrics: []
# metrics:
#   - { label: "Top pick legible (hand-labeled)", value: "TODO" }
#   - { label: "Activities searched", value: "172" }
media:
  type: video
  src: /media/your-name-in-miles.mp4
  poster: /media/your-name-in-miles.jpg
  alt: "Typing ERIC into Your Name in Miles: each letter draws in as a real GPS route as it is typed."
links:
  - { label: "Live", href: "https://miles.eknudson.com" }
---

## Problem

Each letter is one continuous stretch of a real run, ride or hike, shown with the place and
date it happened. It was inspired by NASA's *Your Name in Landsat*.

TODO: Why you built it, and what makes the problem hard: most stretches of most routes don't
look like any letter.

## Approach

I treat each letter as a ranking problem: generate candidates, score them, then re-rank for
variety.

**Candidate generation.** Every route is resampled to a point every 10 m. For each route I
slide windows of many lengths across it: fixed lengths from 500 m to 5 km, plus 5% to 100% of
the route's length. The windows step forward by a tenth of their length, and none is shorter
than 300 m. Across 172 activities, that produces a large pool of candidate stretches for every
letter.

**Scoring.** Each candidate gets two signals:

- **Shape score.** The window is resampled to 64 points and fit into a unit box. It's compared
  with every case variant of the letter, rotated from −15° to +15°, using symmetric chamfer
  distance: how far the route strays from the letter, averaged with how much of the letter it
  misses. Drawing order doesn't matter, so backtracking is fine.
- **Model confidence.** A small CNN trained on EMNIST handwritten letters sees the window drawn
  like a handwritten sample and outputs P(letter).

The model acts as a gate, not a ranker. A candidate counts only if the model is at least 90%
confident, the shape score is at most 0.10, and the letter is at least 500 m long. Survivors
are ranked by shape score minus a small bonus for covering more of the route (0.005 of shape
score per extra 10% of the route), because a letter that *is* the run is a better story than
a fragment of one.

**Diversity re-ranking.** The top candidates for a letter are often the same stretch of road
with slightly different start points. A greedy pass takes the best-ranked candidate, skips
any candidate where more than half the window lies within 60 m of one already picked, and
keeps six. The top pick spells the letter, and the other five are runners-up a user can swap
in.

## Evaluation

TODO: Hand-label the ~150 candidates as legible or not, and report how often the top pick was
legible. Compare with a shape-only baseline if you have one.

## Results

TODO

## Working within Strava's API terms

TODO: Review this paragraph.

Strava's API terms shaped the product as much as the algorithm did. The app can't have
"Strava" in its name. It can't show one user's data to anyone else, even with consent. And
section 5.3 forbids using Strava data with AI or machine learning, which makes the handwriting
model a risk. If users sign in with Strava, the matcher switches to shape-only scoring. A
user's own data export isn't covered by the API terms, so uploading a Strava, Garmin or Apple
Health export is the fallback. For privacy, the plan is to trim the start and end of every
route by default, since those can reveal a home address.

## What I'd do next

TODO
