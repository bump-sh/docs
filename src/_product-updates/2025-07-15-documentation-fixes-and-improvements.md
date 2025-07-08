---
title: Documentation fixes and improvements
tags: [Improvement]
---
Even if our product grows with new features, taking the time to maintain, enhance, and polish existing features is crucial to ensure a solid documentation experience. That's why we always give ourselves time to tackle small enhancements and fixes alongside the development of new features. Here's a list of what's been worked on.

Improvements:
- You can now add more than one additional link to the navigation bar by using [our new custom extension](https://docs.bump.sh/help/publish-documentation/external-links/) called `x-externalLinks` instead of the `externalDocs` property,
- When the link to an operation or group no longer exists, it now returns a 404 page instead of redirecting to the top of the documentation, providing a clearer feedback,
- The global stability of the platform has been improved by optimizing requests and setting up deeper cache strategies. It's an ongoing endeavour that we'll continue for the next few months,
- We’ve updated our status page and how we communicate through it, to share precise information about the production status in real-time. It can be followed on [status.bump.sh](https://status.bump.sh),
- Meta descriptions are now context-specific (topic, endpoint, channel, operation, webhook...),
- Enums support in query parameters have been deepen to handle complex combinations,
- The sharing module appearing on hover no longer prevents from easily copying of operation and property names,
- Badges generated using the `x-state` property no longer have a string length limit, 
- [Mermaid diagrams and charts](https://docs.bump.sh/help/documentation-experience/markdown-support/#diagrams-and-charts-mermaid-support) added in Markdown now support custom text colors,
- The switch between oneOfs now displays the discriminator mapping name instead of the component name: the mapping name value generally gives more information about the real use of an API consumer.


Fixes:
- Revamped the navigation bar architecture to ensure its stability in every context (with or without logo, inside a hub or as a standalone documentation, in the documentation, API Explorer, changelog, ...),
- Reworked the copy button of the code sample module to keep it visible when the path is longer than the module, and make sure it alway copies the active content when multiple code samples are defined,
- Reworked oneOfs support to ensure the right titles and content are always displayed and clickable,
- Fixed an issue where selecting a different content-type returned an empty body,
- Fixed missing required badges in advanced oneOf contexts,
- Fixed a glitch hiding the title of the hub in dark mode,
- Added a line break to `externalDocs` strings to ensure they wrap with the documentation width,
- Fixed multiple API Explorer UI consistency issues when applying custom styles, 
- Fixed missing headers in AsyncAPI in specific contexts.

As always, don't hesitate to reach out if you have any feedback, questions, or features you think are missing from the product. Knock at [hello@bump.sh](mailto:hello@bump.sh)
