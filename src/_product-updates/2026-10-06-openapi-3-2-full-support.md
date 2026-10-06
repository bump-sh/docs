---
title: "OpenAPI 3.2: full support"
tags: [New]
image: /docs/images/changelog/openapi-3-2-full-support.png
---

![OpenAPI 3.2 is now fully supported by Bump.sh](/docs/images/changelog/openapi-3-2-full-support.png)

OpenAPI 3.2 brings native answers to needs that used to require vendor extensions: structured navigation, badges, streaming, custom HTTP methods. We started supporting it [in December](/product-updates/2025/12/22/openapi-3-2-partial-support/), and every feature it introduces is now rendered in your documentation. Deploy your OpenAPI 3.2 documents as usual, nothing else to set up.

## Nested navigation

Large APIs are easier to browse when operations are grouped by use case. OpenAPI 3.2 lets you build that structure directly in your document, by giving tags a `kind` and a `parent`. Tags with `kind: nav` (or without any `kind`) build the navigation of your documentation, and `parent` turns them into a hierarchy:
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

This is the native equivalent of [`x-tagGroups`](/help/customization-options/sections/): when a tag hierarchy is defined, `x-tagGroups` is ignored. `x-tagGroups` remains the way to go for OpenAPI 3.1 and below, and for AsyncAPI documents.

Like `x-tagGroups`, nested navigation requires the ["automatic" or "group by tag" grouping mode](/help/customization-options/operations-navigation/#grouping-operations).

## Badges

Flag what your users need to know at a glance: a beta feature, a release candidate, an endpoint reserved for some plans. A tag declared with `kind: badge` adds a badge to every operation or webhook using it. The badge displays the tag `name` in the default color. More details in the [badges help page](/help/specification-support/doc-badges/#using-openapi-32-tags).

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

![An operation using OpenAPI 3.2 badges](/docs/images/changelog/openapi-3-2-badges.png)

## Streaming responses

Streaming APIs send a sequence of items instead of a single payload. With `itemSchema`, your users see the structure of each item, instead of an opaque stream. Learn more in our [JSON streaming guide](/openapi/v3.2/advanced/json-streaming/).

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

Some APIs rely on HTTP methods outside the standard list, like `PURGE` for a cache. With `additionalOperations`, they are documented like any other operation:

```yaml
paths:
  /cache/{key}:
    additionalOperations:
      PURGE:
        summary: Purge a cache entry
```

## And more

- **Example `dataValue`**: the example data before serialization, displayed in request and response examples.
- **Example `serializedValue`**: the example as sent over the wire, displayed in request and response examples without reformatting, and used in cURL samples for path, query and header parameters.
- **Security requirement by URI**: a security scheme referenced by a URI (e.g. `#/components/securitySchemes/apiKey`) instead of its name, displayed like other security requirements.
- **OAuth 2 `deviceAuthorization` flow**: the flow for devices without a browser, displayed with its Device Authorization URL.
- **OAuth 2 `oauth2MetadataUrl`**: the authorization server metadata URL, displayed in the Authentication section.

They complete the features [already supported since December](/product-updates/2025/12/22/openapi-3-2-partial-support/): the `QUERY` method, tag `summary`, server `name`, response `summary` and deprecated security schemes.

See how each feature is handled in the [help center](/help/specification-support/openapi-support/#openapi-32), and dive deeper into OpenAPI 3.2 with our [OpenAPI guide](/openapi/v3.2/).

Any feedback? Reach out at [hello@bump.sh](mailto:hello@bump.sh).