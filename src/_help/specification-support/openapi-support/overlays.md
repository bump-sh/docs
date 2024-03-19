---
title: Overlays
---

- TOC
{:toc}

_Note: The Overlays Specification of OpenAPI is currently in beta. It is [sufficiently stable for experimentation](https://github.com/OAI/Overlay-Specification?tab=readme-ov-file#current-status), however please be advised that it may change depending on the community feedback._

The Overlay specification of OpenAPI makes it possible to modify the content of an OpenAPI definition file by adding a layer on top of it. That layer helps adding, removing or changing some or all of the content of the original file.

From an OpenAPI definition file continaing your API description, and an Overlay defintion file, you can merge the two into a new definition file that you will deploy on Bump.sh.

The Bump.sh CLI lets you [merge the files](/help/continuous-integration/cli#bump-overlay).

The obtained file can then be [deployed and released](/help/publish-documentation/) to Bump.sh as per your usual workflow, whether manually, via our CLI, API or GitHub Action.

Discover our [Overlay and OpenAPI Guides](/guides/openapi/) to learn more about this new OpenAPI feature.