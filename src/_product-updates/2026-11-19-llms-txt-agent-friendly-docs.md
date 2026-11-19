---
title: "Agent-friendly API docs: llms.txt improvements"
tags: [Improvement]
image: /docs/images/changelog/agent-friendly-docs.png
---

![Bump.sh docs score 100/100 on the Agent-Friendly Docs Scorecard](/docs/images/changelog/agent-friendly-docs.png)

Your API docs have a new kind of reader. Coding assistants like Claude Code, Cursor or Copilot fetch documentation pages on their own, to understand an API, write an integration or debug a call. They don't browse like humans: they need the right entry point, clean content, and no tokens wasted on page layout.

The [Agent-Friendly Documentation Spec](https://afdocs.dev/) lists checks to measure how well docs serve these agents. Some of you ran these checks on your docs and shared the results. So we went through every check and improved the way Bump.sh serves `llms.txt` and Markdown pages.

Nothing to set up: all your docs and hubs benefit from it.

Our own API docs, [developers.bump.sh](https://developers.bump.sh), now score 100/100 on every category.
Run the [checks](https://afdocs.dev/) on your docs and let us know your score.

## A standard llms.txt structure

Your `llms.txt` now follows the [llms.txt proposal](https://llmstxt.org/): a title, a short summary in a blockquote, then sections of links. Agents know what your API is about before following a single link. Hubs without a description get a default summary.

[llms.txt of a documentation](https://bump.sh/bump-examples/doc/train-travel-api/llms.txt) *(truncated)*:
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

## Every page indexed

Like your sitemap, your `llms.txt` now lists every page of your documentation: the root, the servers page and your [changelog](/help/changes-management/changelog/). The changelog gets its own `changes/llms.txt`, so your main file stays light however long your API history is. Each change is also available in Markdown, with the same content as its HTML page.

## llms.txt, reachable from any page

Agents rarely start from your `llms.txt`: they land on a specific page, from a search result or a link. Every page, in HTML and Markdown, now points them to the index:

```markdown
> For the complete documentation index, see [llms.txt](https://bump.sh/bump-examples/doc/train-travel-api/llms.txt)
```

Your human readers won't see it.

## Your MCP server, advertised

When [Ask AI](/help/documentation-experience/ask-ai-capabilities/) is enabled on a public doc or hub, Bump.sh exposes an [MCP server](/help/documentation-experience/ask-ai-capabilities/#mcp-server) for it. Your `llms.txt` now announces it at the top of the file: agents can search and read your docs through MCP, instead of crawling pages one by one.

```markdown
## MCP server

Connect AI agents to this documentation with the Train Travel API MCP server (Model Context Protocol, Streamable HTTP transport):

- URL: `https://bump.sh/bump-examples/doc/train-travel-api/mcp`
```

For your API consumers, it means agents that give better answers, use fewer requests and tokens, and make your API easier to adopt in AI-assisted workflows.

Learn more about how Bump.sh exposes your docs to AI tools in the [SEO & GEO](/help/publish-documentation/seo-geo/) help page.

Any feedback? Reach out at [hello@bump.sh](mailto:hello@bump.sh).
