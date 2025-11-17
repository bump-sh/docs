---
title: "New search experience"
tags: [New]
image: /images/changelog/new-search-experience.png
---

![new_search_experience.png](/images/changelog/new-search-experience.png)

Search is at the core of our doc portal experience: your users need to easily find what they're looking for, as it's a key part of their API discovery.

Because we know how crucial it is, we recently completely rebuilt it to make it more relevant, faster, and more reliable. 

### Relevance 
Having quick results is useless if they aren't relevant. We have redesigned our relevance rules from scratch to ensure that we provide your users with what they are really looking for:
- We now display a single list of results instead of several categories: users mostly look for operations, so displaying properties and other content "by default" didn't always make sense. 
- That global result list is ordered based on how closely the query matches a result item, and on its type. For example, for the same result weight, an operation will be favored over a property,
- The depth of a result is also taken into consideration to calculate its relevance, because we know that a first-level property is generally more important (and therefore searched) than a deep property,
- We removed the 5 results per type limit and now return all relevant results,
- Typos are also now better managed, ensuring relevant results even when the search query contains typos.

### Performance
Quickly finding the right information is one of the keys to a good API discovery, and search is part of it. **Search speed has been increased by a factor of 10.** This is particularly visible on larger hubs and complex documentation, reducing the time from almost a second to a few milliseconds, making the search experience instantaneous. 

![Comparison between the new search and the old search](/images/changelog/new-search-experience-performance.gif)

### Usability
All this work is under the hood, but we also made improvements to the search interface itself: the visual hierarchy of result items has been fully reworked to increase readability.

![Search result item overhaul](/images/changelog/new-search-experience-result-item.png)

Any feedback? Reach out at [hello@bump.sh](mailto:hello@bump.sh)!