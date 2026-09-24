---
title: "OpenAPI 3.2 now fully supported"
tags: [New]
image: /docs/images/changelog/openapi-3-2-full-support.png
---

![MCP server logs.png](/docs/images/changelog/openapi-3-2-full-support.png)

We released a partial OpenAPI 3.2 support in late 2025. That support is now complete: deploy your OpenAPI 3.2 documents as usual and get the best of its new capabilities.

## Nested navigation 

OpenAPI 3.2 lets you give tags a `kind` and a `parent`. Tags with `kind: nav` (or without any `kind`) build the navigation of your documentation, and `parent` turns them into a hierarchy:
- a tag used as a `parent` becomes a section of the navigation, titled with its name,
- its child tags become the groups of operations listed in that section.

```yaml
tags:
  - name: Journeys
    kind: nav
  - name: Stations
    kind: nav
    parent: Journeys
  - name: Trips
    kind: nav
    parent: Journeys
```

![A navigation with parent tags](/docs/images/changelog/openapi-3-2-nested-navigation.png)

If you already use [`x-tagGroups`](/help/customization-options/sections/), the result is the same: this is its native OpenAPI 3.2 equivalent. `x-tagGroups` are still the way to go for OpenAPI <= 3.1 and Async API documents.

## Badges

A tag declared with `kind: badge` can be used to add badges to your operations, webhooks and channels.

```yaml
tags:
  - name: Release candidate
    kind: badge

paths:
  /trips/{tripId}/live:
    get:
      summary: Stream live trip updates
      tags: ["Trips", "Release candidate"]
```

![An operation using OAS 3.2 badges](/docs/images/changelog/openapi-3-2-badges.png)

## Streaming responses

Streaming APIs send a sequence of items instead of a single payload. `itemSchema` describes each item of the stream.

```yaml
responses:
  "200":
    description: A stream of trip updates
    content:
      application/jsonl:
        itemSchema:
          type: object
          properties:
            trip_id:
              type: string
            ...
```

![A response using data streaming](/docs/images/changelog/openapi-3-2-streaming.png)

## Any HTTP method

You can now document operations using any HTTP method with `additionalOperations`:

```yaml
paths:
  /cache/{key}:
    additionalOperations:
      PURGE:
        summary: Purge a cache entry
```

## Also in OpenAPI 3.2

New in this release:
- **Example `dataValue`**: the example data before serialization, displayed in request and response examples.
- **Example `serializedValue`**: the example as sent over the wire, displayed in request and response examples without reformatting, and used in cURL samples for path and query parameters.
- **Security requirement by URI**: a security scheme referenced by its path instead of its name, displayed like other security requirements.
- **OAuth 2 `deviceAuthorization` flow**: the flow for devices without a browser, displayed with its Device Authorization URL.
- **OAuth 2 `oauth2MetadataUrl`**: the authorization server metadata URL, displayed on the Authentication section.

Already supported:
- **`QUERY` method**: a safe request carrying a body, displayed in the documentation and available in the API Explorer.
- **Security scheme `deprecated`**: a security method soon to be removed, displayed with a deprecation badge.
- **Tag `summary`**: a short display name, used instead of the tag name.
- **Server `name`**: a short server label, displayed in the server selector.
- **Response `summary`**: a short response description, displayed alongside the response.

You can deep dive into OpenAPI 3.2 with our [OpenAPI guide](/openapi/v3.2/), updated for this new release.

As always, don't hesitate to [reach out](mailto:hello@bump.sh) if you have any feedback!