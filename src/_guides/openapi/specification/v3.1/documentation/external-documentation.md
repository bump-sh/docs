---
title: External Documentation
authors: phil
excerpt: Link OpenAPI documentation with other guides and tutorials.
canonical_url: https://docs.bump.sh/guides/openapi/specification/v3.2/documentation/external-documentation/
date: 2024-08-08
---

- TOC
{:toc}

While the `description` property is excellent for giving a little more information about a specific tag, you might need to provide additional documentation if the business logic by a part of the API is complex, or there are lists of possible values defined outside of the API.

If anything requires further explanation, you can provide a link to an external web page where you offer a more detailed explanation using the `externalDocs` property.

The `externalDocs` property is two things, a URL using the `url` property, and a `description` explaining what this link is about.

```yaml
tags:
  - name: Diffs
    description: Diff summary of changes in the API
    externalDocs:
      description: More details about Diff
      url: https://docs.bump.sh/help/api-change-management/

```

This is not limited to tags, `externalDocs` can be used on:

- Root Object
- Tag Object
- Operation Object
- Schema Object

Here's all of them being used all at once!

```yaml
openapi: 3.1.0
info:
  title: External Docs Everywhere!
  version: "1.0.0"

externalDocs:
  description: Guides & Tutorials
  url: https://docs.bump.sh/guides/

paths:
  /diffs:
    get:
      externalDocs:
        description: Learn more about Operations
        url: https://docs.bump.sh/guides/openapi/specification/v3.1/understanding-structure/paths-operations/

tags:
  - name: Diffs
    description: Diff summary of changes in the API
    externalDocs:
      description: More details about Diff
      url: https://docs.bump.sh/help/api-change-management/

components:
  schemas:
    Diffs:
      externalDocs:
        url: https://docs.bump.sh/guides/openapi/specification/v3.1/data-models/schema-and-data-types/

```

When you generate API documentation for the API description above, you'll see the link rendered like this:

![How the externalDocs property is displayed in generated API documentation.](/images/guides/tag-with-externaldocs.png)
