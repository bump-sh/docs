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
  "paths": {
    "/diffs": {
      "post": {
        "x-beta": true,
        "description": "Create a diff between any two given API definitions",
        "requestBody": {
          "description": "The diff creation request object",
          "content": {
            "application/json": {
              "schema": {
                "x-beta": true,
                "type": "object",
                "properties": {
                  "url": {
                    "x-beta": true,
                    "type": "string",
                    "format": "uri",
                    "description": "**Required** if `definition` is not present.\nCurrent definition URL. It should be accessible through HTTP by Bump.sh servers.\n"
                  },
                  ...
                }
              }
            }
          }
        }
      }
    }
  }
```

The documentation displays a “Beta” flag on the components:

![doc-beta.png](/images/help/doc-beta.png)
