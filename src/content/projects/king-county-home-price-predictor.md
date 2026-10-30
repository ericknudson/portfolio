---
title: King County Home Price Predictor
summary: An R Shiny app that predicts a home's sale price with linear regression and k-means neighborhoods, then shows similar homes using k-nearest neighbors.
order: 4
role: Solo project
timeframe: "2020"
stack: [R, Shiny, glmnet, Leaflet, ggplot2]
links:
  - { label: "Live app", href: "https://knudson.shinyapps.io/kingcounty/" }
  - { label: "Code", href: "https://github.com/ericknudson/king-county-home-price-generator" }
---

## Problem

TODO: Who this was for and why, in a sentence or two.

## Approach

The model is trained on Kaggle's King County dataset: 21,613 home sales from May 2014 to
May 2015.

**Cleaning.** I removed duplicate rows, fixed an obvious typo (a 33-bedroom house that was
really 3), and dropped a handful of extreme outliers, such as a very expensive horse farm and
some very large lots. I also dropped the neighborhood-average columns, since a user wouldn't
have those numbers on hand.

**Feature engineering.** I added polynomial and interaction terms (bedrooms × bathrooms,
condition × age, grade × age, years since renovation, and others) to capture nonlinear and
joint effects.

**Location.** Zip codes draw arbitrary lines, so I also used k-means on latitude and
longitude to make "neighborhood" clusters. Head to head, 70 zip codes beat 70 k-means
neighborhoods. Keeping zip codes and adding 4 regions plus 210 fine-grained neighborhoods
on top improved the model significantly.

**Regularization.** LASSO didn't improve test error, so the final model is plain least
squares on log price.

**In the app.** Users enter a home's details and location. The app predicts the price,
inflates it from 2014 dollars to mid-2020 dollars using the Seattle Home Price Index, and maps
the 30 nearest homes in the dataset.

## Evaluation

Every model was scored by test RMSE in dollars, using 10-fold cross-validation.

| Model | Test RMSE | Training R² |
| --- | --- | --- |
| Baseline, linear price | $154,501 | 0.814 |
| Baseline, log price | $145,505 | 0.874 |
| Final model | TODO | TODO |

The log-price model beat the linear one at both stages where I compared them. Polynomial terms and the extra
location features each brought test error down substantially from the baseline.

TODO: Final-model numbers. The knitted notebook only prints the baseline numbers; re-run
`scripts/generate_resources.Rmd` to get the final ones.

## What I'd do next

TODO
