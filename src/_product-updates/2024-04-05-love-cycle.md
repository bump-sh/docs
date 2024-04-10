---
title: Love Cycle
tags: [Improvement]
image: /images/changelog/love-cycle.png
---

![new-dashboard-2024.jpg](/images/changelog/love-cycle.png)

We have a tradition of scheduling what we call Love Cycles between our development cycles: times dedicated to improving Bump.sh, responding to specific user requests that we find relevant, and providing a general polish.

Our last Love Cycle has recently ended, and we wanted to share with you all the small changes we've made. If you have a feature in mind or a need, don't hesitate to share your feedback with us at hello (at) bump.sh!

Improvements:

- Overlay Support: [Overlay](https://docs.bump.sh/help/specification-support/overlays/) is a new feature (beta) of OpenAPI that allows applying a layer over an API document without modifying it, to adapt to a specific context. Now supported by Bump.sh, we also added to our CLI a [new command](https://github.com/bump-sh/cli?tab=readme-ov-file#bump-overlay-definition_file-overlay_file). Feel free to read our [recent guide](https://docs.bump.sh/guides/openapi/augmenting-generated-openapi/) on the topic!
- Examples will now display correctly regardless of the chosen format. Bonus for those in XML which will also display the appropriate highlight.
- [OpenAPI] Improved support for externalValue which now displays a link to the designated resource.
- When using the [GitHub Action](https://docs.bump.sh/help/continuous-integration/github-actions/) for a diff, we now add a link to the preview of the result directly in the PR.

Quality of Life:
- We have improved the appearance of highlights during navigation on documentation, to make them more visible and comfortable.
- Navigation has been improved for logged-in users, by adding buttons for quick return to the Dashboard.
- From now on, the timestamp of your deploys and other actions will be based on your browser's timezone instead of GMT+1 by default.
- We have added and modified some warning messages to make them more explicit.

![new-highlights.png](/images/changelog/new-highlights.png)

Fixes:
- We resolved the issue with discriminator values not always mapping correctly in certain specific cases. Special thanks to Phil Sturgeon for pointing it out and having a thorough discussion about discriminators with the team.
- The generation of some API keys was not always going smoothly, but this is now fixed.
- [AsyncAPI] The binding support is now properly applied at the channel level.