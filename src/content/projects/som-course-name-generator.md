---
title: SOM Course Name Generator
summary: >-
  A bigram Markov model trained on every Yale SOM course name that writes new ones, weird
  but believable, like *Innovation In Capital & Wine*. Unigrams produced nonsense and trigrams
  just recreated real courses, so bigrams were the sweet spot. I made it in 2020, before LLMs
  were in widespread use, as part of Yale's CS 577 Natural Language Processing course.
order: 4
role: Solo project
timeframe: "2020"
stack: [Python, Flask, NumPy, TypeScript]
media:
  type: image
  src: /media/som-course-name-generator.png
  alt: "The SOM Course Generator showing a generated course name, Current Issues In Data Analysis Using Stata, with a Create course button."
links:
  - { label: "Live", href: "https://som.eknudson.com" }
  - { label: "Code", href: "https://github.com/ericknudson/som-course-generator" }
---

## Problem

TODO: Why you built it, in a sentence or two.

## Approach

I trained the model on every Yale SOM course name in the registrar's Auction History
spreadsheet. Generating a name works like this:

1. Pick the first word of a random real course name.
2. Look at every word that follows that word in the real catalog, and pick one at random,
   weighted by how often it appears there.
3. Repeat until the model picks the end-of-name token.

If the result is a single word or exactly matches a real course, it starts over.

## Choosing the model

How many previous words the model looks at decides whether the names are funny.

- **Unigram** (each word picked by overall frequency, ignoring context) produced nonsense
  like *MGT 955-01 For New Evolution Fund Strategic*.
- **Trigram** (two words of context) kept recreating real courses with slight variations my
  de-duper couldn't catch, like *MGT 896-01 Private Equity Projects & Emerging Markets*. They
  sounded so real they weren't funny.
- **Bigram** hit the middle ground: weird but intelligible, like *America's Future Role In The
  Restaurant Industry* or *Innovation In Capital & Wine*.

I also tuned a few probabilities by hand, such as weighting "& Society" up by 4×.

## Bringing it back

The original ran as a Flask app on Heroku, which went down when Heroku ended its free tier.
In 2026 I ported the generator to TypeScript so it runs entirely in the browser. It uses the
same bigram table and rules, and there's no server to keep alive.
