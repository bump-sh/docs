---
title: Run Arazzo workflows on your MCP servers
tags: [New]
image: /docs/images/changelog/mcp-platform-arazzo-support.png
---
![mcp-platform-arazzo-support.png](/docs/images/changelog/mcp-platform-arazzo-support.png)

You can now use your Arazzo documents to run workflows on Bump.sh MCP servers. Arazzo is a workflow specification from the OpenAPI Initiative that extends your existing OpenAPI documents by describing how to sequence operations to accomplish real tasks.

You can deploy Arazzo documents using the [CLI](/help/continuous-integration/cli/#deploy-a-workflow-document-on-your-mcp-server) or the [GitHub Action](/help/continuous-integration/github-actions/#deploy-a-workflow-document-for-your-mcp-server). Web upload using the dashboard isn't supported yet.

Wanna learn more about Arazzo? Head over to our [Arazzo guide](/arazzo/v1.0/) for a full walkthrough of the specification.

## Choosing between Arazzo and Flower

You can now describe your workflows using one of these two specifications:
- [Flower](/help/mcp-servers/specification-support/flower-support/), our own lightweight specification.
- [Arazzo](/arazzo/v1.0/introduction/what-is-arazzo/), the specification supported by the OpenAPI Initiative.

We initially built Flower to describe simple workflows without having to add references to OpenAPI files: the specification felt overkill during our MCP platform building phase. As we started writing more complex workflows, we deepened Flower capabilities. It now supports data transformation between steps that Arazzo doesn't support.

You can use Arazzo when you have OpenAPI definitions and want the portability of an OAI standard, and use Flower when you need something lighter or deeper data manipulation at the step level.

Any questions or feedback? [Reach out to us](mailto:hello@bump.sh) anytime.