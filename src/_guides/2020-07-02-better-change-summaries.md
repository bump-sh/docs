---
title: Better change summaries
categories: [Improvement]
---

We have enhanced the way we summarize API changes. We now list any changes, at all levels (endpoints, requests, responses, attributes & headers) in the API changelogs and notifications we send.

Here an example of a previous summary:

```
Endpoint updated: Versions
Endpoint updated: Validations
```

Which now becomes:

```
Updated: POST /docs/{:id}/versions
  Body attribute added: specification
  Response added: 200
  Responses removed: 201, default
Updated: POST /docs/{:id}/validations
  Body attribute added: specification
  Response removed: default
```

It is now active for all new deployments. We’ll be recalculating the summaries of previous deployments to make your API changelogs clearer soon.
