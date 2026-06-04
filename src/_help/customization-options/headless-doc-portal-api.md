---
title: Headless doc portal (API)
---

- TOC
{:toc}

The Portal API provides access to API documentation hosted on Bump.sh programmatically. The API returns structured content through a REST API call, with the same level of content as the visual API doc.

> The Portal API currently works on public docs. Private docs support coming soon.
{: .info}

## When to use the Portal API

The Portal API is useful when you want to build your own integration on top of Bump.sh documentation, without relying on the MCP protocol. Typical use cases include:

- Integrating documentation content into your own developer portal or tooling
- Building a custom search interface for your API documentation
- Feeding structured doc content into AI pipelines or RAG systems
- Automating documentation audits or content extraction

> If you're looking to connect your AI assistant to an API doc portal hosted on Bump.sh, the [portal MCP server](/help/documentation-experience/ask-ai-capabilities/#mcp-server) is the way to go. It's built on top of the Portal API.
{: .info}

## Search across documentation

You can use the [`GET /search`](https://bump.sh/bump/doc/bump-portal/operation/operation-get-search) endpoint to search across all documentation pages in a portal by keyword. Results include URL, title, type, and a text excerpt for each page. You can optionally filter by page URL or by page type (`operation`, `model`, `guide`, etc.).

## Explore the documentation structure

You can use the [`GET /list`](https://bump.sh/bump/doc/bump-portal/operation/operation-get-list) endpoint to list all child pages under a given URL in the portal hierarchy. It returns each page's URL, title, type, and a short description. It's useful as a starting point to understand what a portal contains before fetching specific pages.

## Retrieve page content

You can use the [`GET /fetch`](https://bump.sh/bump/doc/bump-portal/operation/operation-get-fetch) endpoint to retrieve the full content of one or more pages by their URLs (up to 10 per request). Content is returned in Markdown format.

A common flow is to call `GET /search` first to identify relevant pages, then `GET /fetch` to read their full content.