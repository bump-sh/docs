---
title: Deploy workflows
---

- TOC
{:toc}

## What are deployments

Similar to API deployments, a deployment is the processing by Bump.sh servers of a workflow document containing Arazzo or [Flower](/help/mcp-servers/specification-support/flower-support) workflows. After processing, workflows contained by this document are made available by your MCP server.

![MCP servers deployments page](/docs/images/help/mcp-servers/mcp-servers-deployments.png) 
 
> MCP servers always run workflows of the last deployment.
{: .info}

## Deploy from the dashboard

You can deploy workflow documents directly from your MCP server settings. To do so, click on the "Deploy new workflow document" button.

![MCP servers deploy new workflow document button](/docs/images/help/mcp-servers/mcp-servers-deploy-new-document-button.png)

## Deploy from the CLI

You can deploy a workflow document using our CLI using the `TBD` command. The complete process is available on the dedicated [CLI page](/help/continuous-integration/cli/).

## Deploy using the GitHub Action

Our [GitHub Action](/help/continuous-integration/github-actions/) allows you to easily integrate Bump.sh into your projects.

## Deployment states
You can check the state of a deployment in the deployments page and verify which one is served by the MCP server.

| **State** | **Description** |
| Active | Exposed by the MCP server. | 
| Deployed | Previous deploy, no longer exposed by the MCP server. | 
| Deploying | Being processed by Bump.sh. |
| Errored | Encountered an error during deployment. |