---
title: FAQ
---

## Will you support others specifications like BluePrint or GraphQL?

When we initially had the Bump idea, we though that it would be absolutely perfect to be able to handle any kind of documentation.

This said, at the moment, we are focusing on OpenAPI and AsyncAPI to offer the best support of these specifications.

## Why not supporting all the OpenAPI specification?

If you have tried Bump, you probably have already discovered that we don't support the whole Swagger / OpenApi specification.

There are 2 reasons for that:

- first, we are a fresh new project, which is far from being complete. So we may have decided to postpone some features due to our priorities.
- second, we may have decided that a specification feature adds too much complexity to the documentation, and have preferred to simply ignore it to keep things simple for now.

Feel free to <a class="intercom-launcher-selector" href="mailto:help@bump.sh">ask us</a> why a feature you need is missing, we'll be happy to answer and try to find a solution with you.

## Security and confidentiality

Bump.sh has been designed from the ground up with security as a core principle. **Our platform never accesses your infrastructure or source code, and only processes data explicitly sent by you.**

We only handle two types of strictly controlled data:

* API documents (OpenAPI, AsyncAPI) explicitly provided by your teams via our secure API.
* User information (email, name, role), created automatically via SSO or manually within the tool.

Integration into your workflow is secure and transparent. You retain full control over what data is shared and how:

* Direct uploads via our API through your own integration code.
* Using our [open-source CLI](https://github.com/bump-sh/cli) integrated into your CI pipeline, which exclusively sends files explicitly defined by you.
* Utilizing our [GitHub Action](https://github.com/bump-sh/github-action), also open-source, built upon the same secure, vetted codebase as our CLI.

Additionally, we implement industry-leading security practices, including WAF protection, continuous monitoring, daily dependency updates, regular staff security training, and authorized penetration tests conducted by our customers.

As a French company, we fully comply with GDPR, adhering to stringent data protection practices outlined in our [Data Processing Agreement (DPA)](https://bump.sh/dpa).
