---
title: SEO & GEO
---

- TOC
{:toc}

## Sitemaps
To optimize the indexing of your public documentation, Bump.sh automatically generates a sitemap for each one.

[sitemap.xml of a documentation](https://bump.sh/bump-examples/doc/train-travel-api/sitemap.xml) *(example truncated for visibility purposes).*
```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bump.sh/bump-examples/doc/train-travel-api</loc>
    <lastmod>2025-10-29T15:13:09+01:00</lastmod>
  </url>
  <url>
    [...]
```

Similarly, if you use one or more [hubs](https://docs.bump.sh/help/hubs/), they will have their own sitemap_index for all the sitemaps of the documentation they contain.

[sitemap_index.xml of a hub](https://demo.bump.sh/sitemap_index.xml) *(example truncated for visibility purposes).*
```xml
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://demo.bump.sh/doc/external-adyen/sitemap_index.xml</loc>
    <lastmod>2020-04-30T21:36:43+02:00</lastmod>
  </sitemap>
  <sitemap>
   [...]
```

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
### llms.txt for LLM crawlers
`llms.txt` provides context for LLMs, telling crawlers what information can be retrieved behind each page of a documentation. It's available on both hubs and docs by adding `/llms.txt` at the end of the URL.

[llms.txt of a documentation](https://bump.sh/bump-examples/doc/train-travel-api/llms.txt) *(example truncated for visibility purposes).*
```markdown
# Train Travel API

## Description
API for finding and booking train trips across Europe.

## Servers
- Production: https://api.example.com (Production)

## Topics
- [Getting started](https://bump.sh/bump-examples/doc/train-travel-api/topic/topic-getting-started.md)

## Endpoints and operations

### [Stations](https://bump.sh/bump-examples/doc/train-travel-api/group/endpoint-stations.md)
- [Get a list of train stations](https://bump.sh/bump-examples/doc/train-travel-api/operation/operation-get-stations.md)
- [...]
````