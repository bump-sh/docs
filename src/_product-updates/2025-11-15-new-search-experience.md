---
title: New search experience
tags: [New]
image: /images/changelog/new_search_experience.png
---

![new_search_experience.png](/images/changelog/new_search_experience.png)

Search is at the core of our doc portal experience: your users need to easily find what they're looking for, as it's a key part of their API discovery.

We recently completely rebuilt it to make it more relevant, faster, and more reliable. 

### Relevance 
- We now display a single list of results instead of several categories: users mostly look for operations, so displaying properties and other content "by default" didn't always make sense. 
- That global result list is ordered based on how close the query matches a result item, and on its type. For example, for the same result weight, an operation will be favored above a property,
- The depth of a result is also taken into consideration to calculate its relevance, because we know that a first-level property is generally more important (and therefore searched) than a deep property,
- We removed the 5 results per type limit, and now return all relevant results.  

### Usability
- Typos are now better managed and processed to return relevant results,
- The result item hierarchy has been reworked to increase readability.

![Search result item overhaul](/images/changelog/new-search-experience-result-item.png)

### Performance
On average, search speed has been increased by a factor of 7. This is particularly visible on larger hubs and complex documentations, moving from almost a second to a few hundred milliseconds. 

*New search: in this example, the search request takes 43ms.*
![New search performance](/images/changelog/new-search-experience-performance-new.gif)


*Old search: in this example, the search request takes 306ms.*
![Old search performance](/images/changelog/new-search-experience-performance-old.gif)



Any feedback? Reach out at [hello@bump.sh](mailto:hello@bump.sh)!