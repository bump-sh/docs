---
title: Love Cycle - June 24
tags: [Improvement]
image: /images/changelog/love-cycle-june-2024.png
---

![love-cycle.png](/images/changelog/love-cycle-june-2024.png)

The last few weeks, we have been busy improving Bump.sh through small enhancements, specific user requests, while globally polishing the product. We call these moments "Love Cycles".

Here is the list of every small change we made.

As always, we love to hear about any features you would like to see added to the product. Send us a message at hello (at) bump.sh!

Improvements: 
- When you are subscribed to an API changelog, the link inside the email notifying about a new change now redirects to the specific change page. 
- We improved the display of oneOf/anyOf alternatives. When there is a lot of alternatives, we now display the list inside a select instead of a horizontally scrolling tab list.
- The public or private visibility setting options of hubs and their docs was too flexible and confusing. Docs in private hubs are now necessarily private, and cannot be public. Docs in public hubs can be either public or private.
- Single change: we worked on the page to remove duplicated information, and put the focus the deployment date and change id, that can both be useful depending on who reads it. We also put some love on the mobile version.

Quality of life:
- API keys, that let you configure automatic deployments or use the CLI can be set at the organization level, at a Hub level, or at a doc level. By default, you can always use an API key from a parent resource (for instance, the API key of the Hub or the Org that the doc belongs to). We made it clearer in the UI by displaying the parent resource API key in the Automatic Deployment settings page. It still is possible to create a dedicated key for each resource.
- Deployments page: we removed the tabs allowing to filter between All, Released and Not Released deployments to improve the page's readability. It is still possible to filter deployments by State (Enqueued, Deployiong, Deployed, Errored).

Fixes:
- Webhook in documentation now display the generic URL https://webhook.example.com.
- We fixed a visual bug on selects, that could make the user think that multiple items were active.
- We fixed a bug that made the title and description of an more recent change disappear when an user unreleased an older deployment.




