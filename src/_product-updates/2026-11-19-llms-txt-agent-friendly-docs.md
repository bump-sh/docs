---
title: "Agent-friendly API docs: llms.txt improvements"
tags: [Improvement]
---

AI agents are now regular readers of your API documentation. Coding assistants such as Claude Code, Cursor or Copilot fetch docs pages on their own to understand an API, write an integration or debug a call. But agents don't browse like humans: they need to find the right entry point quickly, get clean content, and avoid wasting tokens on page layout.

The [Agent-Friendly Documentation Spec](https://afdocs.dev/) defines a set of checks to measure how well documentation serves these agents, and tools like [Fern's Agent Score](https://buildwithfern.com/agent-score) now benchmark public API docs against them. Following feedback from customers who ran this benchmark on their docs, we reviewed every check and improved the way Bump.sh serves `llms.txt` and Markdown pages.

There is nothing to do on your side: all your documentation and hubs benefit from these improvements.

## A standard llms.txt structure

`llms.txt` files now follow the structure of the [llms.txt proposal](https://llmstxt.org/): a title, a short summary in a blockquote, then sections listing links. Agents parsing your `llms.txt` immediately know what your API is about before following any link. Hubs without a description get a default summary.

[llms.txt of a documentation](https://bump.sh/bump-examples/doc/train-travel-api/llms.txt) *(example truncated for visibility purposes).*
```markdown
# Train Travel API

> This is version `1.3.0` of this API documentation. Last update on Oct 14, 2026.
> API for finding and booking train trips across Europe, documented with OpenAPI 3.2.0 specification.

[Documentation](https://bump.sh/bump-examples/doc/train-travel-api.md)

OpenAPI file: https://bump.sh/bump-examples/doc/train-travel-api.yaml

## [Servers](https://bump.sh/bump-examples/doc/train-travel-api/servers.md)
- Production: https://api.example.com (The production server for the Train Travel API)

## Topics

### [Getting started](https://bump.sh/bump-examples/doc/train-travel-api/topic/topic-getting-started.md)
[...]
```

## Your whole documentation, indexed

Your `llms.txt` now covers every page of your documentation, the same way your sitemap does: the documentation root, the servers page, and your [changelog](/help/changes-management/changelog/). The changelog has its own `changes/llms.txt` listing every change, so your main `llms.txt` stays light no matter how long your API history is. Each change is also available in Markdown, with the same content as its HTML version.

## llms.txt is easy to find from any page

Agents rarely land on your `llms.txt` first: they usually arrive on a specific page, from a search result or a link. Every page of your documentation, in HTML and in Markdown, now tells agents where to find the documentation index:

```markdown
> For the complete documentation index, see [llms.txt](https://bump.sh/bump-examples/doc/train-travel-api/llms.txt)
```

This hint is invisible to your human readers.

## Your MCP server, advertised to agents

When [Ask AI](/help/documentation-experience/ask-ai-capabilities/) is enabled on a public doc or hub, Bump.sh exposes an [MCP server](/help/documentation-experience/ask-ai-capabilities/#mcp-server) for it. Your `llms.txt` now advertises this server at the top of the file, so agents discover right away that they can search and read your documentation through MCP, instead of crawling pages one by one.

```markdown
## MCP server

Connect AI agents to this documentation with the Train Travel API MCP server (Model Context Protocol, Streamable HTTP transport):

- URL: `https://bump.sh/bump-examples/doc/train-travel-api/mcp`
```

## What it means for your API consumers

- **Better answers**: agents get a complete and accurate picture of your API, including its history.
- **Faster and cheaper**: agents go straight to the relevant pages in Markdown, using fewer requests and fewer tokens.
- **Better visibility**: your docs score higher on agent-readiness benchmarks, making your API easier to adopt in AI-assisted workflows.

Learn more about how Bump.sh exposes your docs to AI tools in our [SEO & GEO](/help/publish-documentation/seo-geo/) help page.

Questions or feedback? Write to us at [hello@bump.sh](mailto:hello@bump.sh).
