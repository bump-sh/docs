---
title: SEO & GEO
---

- TOC
{:toc}

## Sitemaps
To optimize the indexing of your public documentation, Bump.sh automatically generates a sitemap for each one.

Similarly, if you use one or more [hubs](https://docs.bump.sh/help/hubs/), they will have their own sitemap_index for all the sitemaps of the documentation they contain.

## Meta titles
The titles follow the construction below:

`[Node Title] - API expanded name ([branch name])`

- `[Node Title]` indicates which sections of the documentation the URL points to (e.g., `authentication` or `servers`). For the URL pointing to the root of your documentation, this section remains empty.
- `API expanded name` uses the name of your documentation followed by `API documentation`. For example, the documentation `Bump` becomes `Bump API documentation`.
- `[branch name]` is present only if there is a [branch](https://docs.bump.sh/help/publish-documentation/branching/) on the documentation.

## Meta descriptions
Descriptions are limited to 160 characters and truncated beyond that.

If a description is provided by `info.description` in your API definition, it will be used.
Otherwise, Bump.sh automatically generates a description using the following model:

```shell
This is the documentation for version <code class="code-inline">#{api_version}</code> of the API.
Last update on #{l(api_definition.created_at, format: :date)}
```

## GEO (Generative Engine Optimization)
### llms.txt
`llms.txt` provides context for AI tools, telling crawlers what information can be retrieved behind each page of a documentation. It's available on both hubs and docs by adding `/llms.txt` at the end of the URL.

[llms.txt of a hub](https://demo.bump.sh/llms.txt) *(example truncated for visibility purposes).*
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