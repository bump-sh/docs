---
title: Badges
---

- TOC
{:toc}

## State

Add badges to your operations and properties for a quick visual indication of their status, such as “Technical Preview” or “Soon deprecated”.

![Image of badges applied to operations and properties](/docs/images/help/doc-x-state.png)

Badges can be declared in two ways: with the `x-state` custom property, or, from OpenAPI 3.2 onwards, with tags.

### Using x-state

`x-state` is a custom property added on an operation or a property. Set it to a string to display a badge carrying that text, or to an object to [choose its color](#custom-color) as well. An array of objects displays several badges on the same element.

```yaml
paths:
  /diffs:
    post:
      summary: Create a diff
      x-state: # x-state flags at the operation level, displayed as two badges
        - label: Technical preview
          color: "#7C3AED"
        - label: Enterprise only
          color: "#FF6B35"
      requestBody:
        description: The diff creation request object
        content:
          application/json:
            schema:
              type: object
              properties:
                url:
                  type: string
                  format: uri
                  x-state: Still unstable # x-state flag at the property level
                  description: |
                    **Required** if `definition` is not present.
                    Current definition URL. It should be accessible through HTTP by Bump.sh servers.
```

Adding or removing an `x-state` is never a structural change in the changelog, as it does not affect the structure of the API. It does not shield the component it is attached to either: if that component changes structurally, the changelog still reports a potential breaking change — unless the component also carries [`x-beta`](#beta), which takes precedence and suppresses it.

#### Custom color

The default text color can be overridden using the `color` property. The badge background is generated from it, to ensure readability.

```yaml
x-state:
  label: "Experimental"
  color: "#FF6B35"
```

![Image of a custom color applied to a badge](/docs/images/help/doc-x-state-custom-color.png)

### Using OpenAPI 3.2 tags

With OpenAPI 3.2, a tag declared with `kind: badge` is not used to group operations: every operation carrying it displays it as a badge, in the default color.

```yaml
tags:
  - name: diffs
    summary: Diffs
    kind: nav
  - name: Technical preview # displayed as a badge, not as a navigation group
    kind: badge
  - name: Enterprise only
    kind: badge

paths:
  /diffs:
    post:
      summary: Create a diff
      tags: ["diffs", "Technical preview", "Enterprise only"]
      ...
```

The badge text is the tag `name`, and not its `summary`, so write it exactly as you want it to be read: spaces are allowed. A tag that is not declared at the root of your document with `kind: badge` displays nothing, badge tags never appear in the navigation, and webhooks are supported just like operations.

> In OpenAPI, tags apply to operations and webhooks: use `x-state` when you need a badge on a property, or when you need a custom color.
{: .info}

## Beta

Use the boolean `x-beta` property inside an operation, a schema or a parameter object to identify it as beta. A change in a beta component is never identified as a breaking change.

### Example usage

```yaml
paths:
  /diffs:
    post:
      description: Create a diff between any two given API definitions
      x-beta: true # Beta flag at the operation level
      requestBody:
        description: The diff creation request object
        content:
          application/json:
            schema:
              type: object
              x-beta: true # Beta flag at the top-level schema object
              properties:
                url:
                  type: string
                  format: uri
                  x-beta: true # Beta flag at the schema level
                  description: |
                    **Required** if `definition` is not present.
                    Current definition URL. It should be accessible through HTTP by Bump.sh servers.
```

The documentation displays a “Beta” flag on the components:

![Image of a beta tag applied to an operation](/docs/images/help/doc-beta.png)

