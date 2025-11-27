---
title: "Ask AI, Markdown rendering & llms.txt"
tags: [New]
image: /images/changelog/ask-ai.png
---

![ask-ai.png](/images/changelog/ask-ai.png)

Many API consumers now rely on AI tools to help them quickly discover API capabilities. Conversational tools such as ChatGPT or Claude can be fed with documentation intended for humans, but that extra "human context" gives them more noise, impacting the AI tools' relevance and increasing token costs. 

Our latest release provides these tools with the right context, empowering your API doc consumers through their favorite AI tools.

## Markdown rendering
Bump.sh now offers an alternative context optimized for AI tools through Markdown rendering.

To access the Markdown version of a documentation, simply add `.md` at the end of the URL (or `/source.md` if you're at the root of the documentation).

[On a documentation root](https://developers.bump.sh/source.md) *(example truncated for visibility purposes).*
```markdown
# Bump.sh Api

## Description
This is version `1.0` of this API documentation. Last update on Jun 16, 2025.
This is the official Bump.sh API documentation. Obviously created with Bump.sh.

The Bump.sh API is a REST API. It enables you to [...]


## Servers
- https://bump.sh/api/v1: https://bump.sh/api/v1 ()


## Endpoints
- [Branches](https://developers.bump.sh/group/endpoint-branches.md)
- [Diffs](https://developers.bump.sh/group/endpoint-diffs.md)
- [...]


## Webhooks
- [Documentation change](https://developers.bump.sh/group/webhook-documentation-change.md)
````

[For a specific operation](https://developers.bump.sh/operation/operation-post-versions.md) *(example truncated for visibility purposes).*
```markdown
# Create a new version

**POST /versions**

Deploy a new version for a given documentation, which will become the current version.


## Servers
- https://bump.sh/api/v1: https://bump.sh/api/v1 ()


## Authentication methods
- Authorization token
- Basic token


## Body parameters
Content-type: application/json
The version creation request object
- **documentation** (string)
  UUID or slug of the documentation.
- [...]

## Responses
### 201: Documentation version successfully created

#### Body Parameters: application/json (object)
- **id** (string)
  Unique id of your version.
- [...]
```

### Ask AI 
Users can now easily ask questions about an API in their go-to conversational tools and get top-notch results. An "Ask AI" option has been added in documentation next to its introduction, x-topics, groups, and operations, offering access to ChatGPT and Claude with the right, narrowed-down context, alongside a one-click Markdown access.

![Ask AI select displayed in documentation](/images/changelog/ask-ai-select.png)

## llms.txt
LLMs crawlers face similar challenges when crawling API docs: they don't know what they're looking for, and are flooded with an overabundance of information. `llms.txt` provides context, telling crawlers what information can be retrieved behind each page of a documentation.

`llms.txt` is available on both hubs and docs, by adding `/llms.txt` at the end of the URL.

[On a hub](https://demo.bump.sh/llms.txt) *(example truncated for visibility purposes).*
```markdown
# Throttle Express API catalog

## Description
## Welcome to the Bump.sh demo!

*Bump.sh is much more than stunning documentation, for all your APIs.*

Browse through **API Hubs** and our **sleek documentation experience**. [...]

## APIs
- [Api: train/book](https://demo.bump.sh/doc/trainbook.md)
- [...]
````

Don't hesitate to reach out at [hello@bump.sh](mailto:hello@bump.sh) if you have any questions/feedback.