---
title: Beta
---

- TOC
{:toc}

Use the `x-beta` property inside an operation, a schema or a parameter object to identify it as beta.
The `x-beta` property is a boolean.

Adding or removing this property is a structural change.
A change in a beta component is never identified as a breaking change.

## Example usage

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
