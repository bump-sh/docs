---
title: Ask AI & Markdown rendering
---

- TOC
{:toc}

Markdown version of your API docs and hubs, optimized for AI tools, are offered next to your standard docs. These Markdown versions, by providing narrowed-down contexts, reduce token cost and hallucinations, therefore returning more relevant results. 

Many API consumers now rely on AI tools to help them quickly discover API capabilities. The `Ask AI` dropdown menu offers documentation users easy access to ChatGPT and Claude, alongside a one-click Markdown access.

![ask-ai-dropdown.png](/images/help/ask-ai-dropdown.png)

## Markdown rendering
To access the Markdown version of a documentation, add `.md` at the end of the URL (or `/source.md` if you have a custom domain, when the URL is the root of your documentation).

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