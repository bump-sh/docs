---
title: "A brief history of OpenAPI"
authors: phil
excerpt: OpenAPI allows to describe how an API works, how a sequence of APIs work together, generate client code, create tests, apply design standards, deploy documentation, and much more.
date: 2024-07-25
---

The OpenAPI Specification started off life with another name, and this can cause a bit of confusion. Until version 3.0, the specification was still called "Swagger", before being renamed to "OpenAPI" in 2016. It's actually a "retroactive" rename, so even v2.0 and earlier are called OpenAPI now.

The OpenAPI Specification is now supervised by the [OpenAPI Initiative](https://www.openapis.org/), an open-source project under the [Linux Foundation](https://linuxfoundation.org/).

The name Swagger is still popular, and many of the tools have the word Swagger in, but generally speaking you are better of searching for "OpenAPI tools" than "Swagger tools" because those are mostly old outdated tools which don't work with modern versions of OpenAPI.

## Major differences between OpenAPI 2.0, 3.0, 3.1

### Versions

In the 2.0 specification, a property called `swagger` indicated which version of the specification you are using. In OpenAPI 3.0, this is replaced by a new `openapi` property:

- `swagger: "2.0"` line is thus transformed into `openapi: "3.0.0"`

### Structural changes

The following image sums up the main structural changes between 2.0 and 3.0. As you can see a simplification effort has been made to group each concern in a more logical way.

![openapi 2 versus openapi 3](https://storage.googleapis.com/bump-blog-resources/what-is-openapi/OpenAPI-2-versus-OpenAPI-3.png)

If you want to get more into the details about what changed between OpenAPI 3.0 and 3.1, you can have a look at our dedicated article [here](https://bump.sh/blog/changes-in-openapi-3-1).

## Format

OpenAPI documents can be written both in YAML and JSON formats.

These formats were chosen because they are easy for a human to read and write, and easy for machines to parse. In practice, YAML is the most used format adopted to write OpenAPI documents. Like it or not, YAML is easier to read than JSON mainly because it reduces the use of markup tags. Also, it is a format that is widely used to write any sort of software configuration.

Here is an example of a simple OpenAPI (3.0) definition endpoint written in YAML:

```yaml
/previews:
  post:
    summary: Create a preview
    description: |
      Create a preview for a given documentation file. The preview will have a unique
      temporary URL, and will be active for 30 minutes.
    security: []
    requestBody:
      $ref: "#/components/requestBodies/Preview"
    responses:
      "201":
        description: "Success"
        content:
          "application/json":
            schema:
              $ref: "#/components/schemas/Preview"
```

## OpenAPI simple definition structure

Your OpenAPI documents lets you describe your REST API:

* Define general information about your API: description, terms of use, license, contact, etc…
* Authentication methods `HTTP`, `API keys`, `OAuth 2`, `OpenID`, etc…
* Available endpoints `/users`, etc…
* Since OpenAPI 3.1, [available webhooks](https://bump.sh/blog/changes-in-openapi-3-1#webhooks-support) 
* Available operations on each endpoint: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc…
* Input and output parameters for each operation
