---
title: Badges
---

- TOC
{:toc}

## Badges 

Add badges to your endpoints/operations for a quick visual indication of their status.
Some operations may require specific context to clarify their usage, such as “Technical Preview” or “Soon deprecated.”

`x-state` is a custom property can be added inside an operation or a property to identify it with a custom badge.
The `x-state` property is a string.

### Example usage

Here under is an example of an operation and a property with a `x-state`.

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
                  x-state: Still unstable # x-state flag at the object property level
                  description: |
                    **Required** if `definition` is not present.
                    Current definition URL. It should be accessible through HTTP by Bump.sh servers.
```

Adding or removing this property is a structural change and is considered as breaking, as it can significantly impact API usage..
When combined with the `x-beta` (see below), the `x-state` replaces its value, but keeps the beta behavior: a change in a beta component is never identified as a breaking change.

The documentation displays custom tags on the operation and property:

![doc-beta.png](/images/help/doc-x-state.png)

## Beta

Use the `x-beta` property inside an operation, a schema or a parameter object to identify it as beta.
The `x-beta` property is a boolean.

Adding or removing this property is a structural change.
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
                  x-beta: true # Beta flag at the object property level
                  description: |
                    **Required** if `definition` is not present.
                    Current definition URL. It should be accessible through HTTP by Bump.sh servers.
```

The documentation displays a “Beta” flag on the components:

![doc-beta.png](/images/help/doc-beta.png)
