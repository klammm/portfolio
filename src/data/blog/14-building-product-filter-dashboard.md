---
title: "Building a Product Filter Dashboard (Interview Prep, Day 1)"
date: "2026-08-20"
excerpt: "Search, category filter, price filter, and sort — with the live version embedded below."
tags: ["react", "interview-prep"]
demo: "product-filter-dashboard"
---

# **🚧 WORK IN PROGRESS 🚧**

Day 1 of a study plan I'm working through: build a product filter dashboard from scratch, with local component state only — no state management library, no UI kit.

The constraints that mattered most:

- Keep state as local as reasonably possible.
- Avoid duplicated or derived state — sorted/filtered results are computed from the source list and the current filter values, not stored separately.
- No premature memoization — the dataset here is tiny, so `useMemo` on the filter/sort pipeline is really just documentation of "this is derived, not stored," not a real performance necessity yet.

~~The live version is embedded below — try changing the filters.~~
