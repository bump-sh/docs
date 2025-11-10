---
title: Change tags display name
---

- TOC
{:toc}

> Supported specification: OpenAPI. 
Note that [OpenAPI 3.2](https://spec.openapis.org/oas/v3.2.0.html#fixed-fields-18) now supports `summary` on tags, behaving the same way as `x-displayName`. 
{: .info}

The `x-displayName` property allows for custom tag names. When added, it replaces the default `name` value in the documentation.

```yaml
tags:
  - name: myFirstTag
    x-displayName: Branches
  - name: mySecondTag
    x-displayName: Diffs
```

![Screenshot of an example API Documentation on Bump.sh, with x-displayName being used.](/images/help/x-displayName.png)
