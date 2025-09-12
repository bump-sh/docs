---
title: Badges
---

- TOC
{:toc}

## State

Add badges to your endpoints/operations for a quick visual indication of their status.
Some operations may require specific context to clarify their usage, such as “Technical Preview” or “Soon deprecated.”

`x-state` is a custom property which can be added inside an operation or a schema to identify it with a custom badge.
The `x-state` property is a string.

### Example usage

Here under is an example of an operation and a schema with an `x-state`.

```yaml
paths:
  /diffs:
    post:
      description: Create a diff between any two given API definitions
      x-state: Technical preview # x-state flag at the operation level
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
                  x-state: Still unstable # x-state flag at the schema level
                  description: |
                    **Required** if `definition` is not present.
                    Current definition URL. It should be accessible through HTTP by Bump.sh servers.
```

Adding or removing the `x-state` property (displaying or removing the badge) is not considered a breaking change in the changelog, as it does not affect the integrity or structure of the API.

Important: The `x-state` property does not alter the changelog behavior of the component it is attached to. If the component itself introduces a structural impact on the API (through addition, modification, or removal), the changelog will still display a potential breaking change event.

Exception: Usage together with the [`x-beta`](#beta) property.
Regardless of a component's structural impact, attaching `x-beta` will not trigger a breaking change event. If both `x-state` and `x-beta` are applied to a component, no breaking change will be generated (the `x-beta` behavior takes precedence). Only one visual badge will be visible in the documentation: the one with the `x-state` value.

The documentation displays custom badges on the operation and property:

![Image of badges applied to operations and properties](/images/help/doc-x-state.png)

### Custom color

The default color can be overrided. To do so, you can define 2 elements inside the `x-state` object:
- `label`: the text that will appear on the badge,
- `color`: the color of the text inside the badge. The background color will be generated based on the text's color, to ensure its readability.

```yaml
x-state:
  label: "Experimental"
  color: "#FF6B35"
```

![Image of a custom color applied to a badge](/images/help/doc-x-state-custom-color.png)

## Beta

Use the `x-beta` property inside an operation, a schema or a parameter object to identify it as beta.
The `x-beta` property is a boolean.

A change in a beta component is never identified as a breaking change.

### Example usage

Here under is an example of a beta operation, a beta request body and a beta schema attribute.

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

![Image of a beta tag applied to an operation](/images/help/doc-beta.png)

