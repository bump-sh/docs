---
title: MCP servers
---

- TOC
{:toc}

## What is MCP

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open standard that lets AI agents discover and call external tools. An MCP server exposes a set of tools that agents (ChatGPT, Claude, Cursor, etc.) can invoke to interact with APIs, databases, or any external service.

## What Bump.sh offers

Bump.sh lets you create MCP servers by declaring workflows in a simple document. You describe the API calls and their sequencing, and Bump.sh generates a fully hosted MCP server that executes them.

This approach is **declarative**: you define *what* the server should do, not *how* to run it. There is no code to write, no server to deploy, no infrastructure to manage. Because every execution follows your workflow definition exactly, the behavior is **deterministic** and **predictable**, which is critical when AI agents interact with real APIs.

### The data plane {#data-plane}

All API calls are executed by an isolated component called the data plane. The AI agent never calls your APIs directly. Instead, it invokes a tool on your MCP server, and the data plane runs the corresponding workflow: resolving secrets, executing HTTP requests, and returning only the declared outputs to the agent.

This architecture keeps credentials and sensitive API responses away from the LLM. See [Security](/help/mcp-servers/security/) for details.

### Workflow specifications

Workflows can be written in two formats:

- [**Flower**](/help/mcp-servers/specification-support/flower-support): a lightweight specification designed by Bump.sh. Ideal for small projects, quick prototyping, or workflows calling APIs for which you don't have an OpenAPI document.
- [**Arazzo**](/help/mcp-servers/specification-support/arazzo-support): the workflow specification from the OpenAPI Initiative. Better suited for complex projects that need to reference existing OpenAPI documents.

Both formats support multi-step sequences, conditional logic (retry, goto, end), runtime expressions, and secrets.

## Get started

1. [Create an MCP server](/help/mcp-servers/create-and-manage-mcp-servers/) from your dashboard.
2. [Deploy a workflow document](/help/mcp-servers/deploy-workflows/) that describes the API calls your server can perform.
3. Share the server URL so that end-users can [add it to their AI tool](/help/mcp-servers/use-mcp-server/).

## Go further

- [Secrets](/help/mcp-servers/secrets/): store API keys and tokens so they are never exposed in your workflow documents.
- [Access management](/help/mcp-servers/access-management/): control who can use your MCP server.
- [Debug sessions](/help/mcp-servers/debug-sessions/): inspect execution traces to troubleshoot workflows step by step.
- [Runtime expressions](/help/mcp-servers/runtime-expressions/): reference dynamic data between steps.
- [Security](/help/mcp-servers/security/): understand the architecture and data handling guarantees.

> MCP servers are in closed beta. [Contact us to be among our first users](mailto:hello@bump.sh).
{: .info}
