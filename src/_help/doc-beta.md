---
title: Beta
---

- TOC
{:toc}

Use the `x-beta` property inside an Operation, a schema or a parameter object to identify it as beta.
The `x-beta` property is a boolean.

Add or remove this property is a strucutal change.
A change on a beta component, can't be breaking.

## Example usage

The following screen capture shows the rendering of adding two code samples `cURL` and `Ruby` to your Operation.

Hereunder is an example of a beta Operation, Schema and Parameter.

```yaml
  "paths": {
    "/diffs": {
      "post": {
        "x-beta": true,
        "description": "Create a diff between any two given API definitions",
        "requestBody": {
          "x-beta": true,
          "description": "The diff creation request object",
          "content": {
            "application/json": {
              "schema": {
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

The documentation display a "Beta" flag on the components:

![doc-beta.png](/images/help/doc-beta.png)
