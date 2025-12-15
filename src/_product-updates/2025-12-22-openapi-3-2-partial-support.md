---
title: "OpenAPI 3.2: partial support"
tags: [Improvement]
image: /images/changelog/openapi-3-2-partial-support.png
---

![openapi-3-2-partial-support.png](/images/changelog/openapi-3-2-partial-support.png)

The OpenAPI Initiative released a new version of their OpenAPI specification in September: [OpenAPI 3.2](https://spec.openapis.org/oas/v3.2.0.html). 

If you didn't hear about this new version, feel free to read our [OpenAPI complete guide](/guides/openapi/specification/v3.2/introduction/what-is-openapi/), updated for OpenAPI 3.2. 

We started supporting some of the features brought by this new version:
- The QUERY method is now supported in both the documentation and the API Explorer.
- Servers can now have a `name`, which can be combined with the existing `description` field to provide users with a clear context about a server's usage.
- Tags now offers a `summary` property. Behaving like our existing x-displayName vendor extension, it gives a way to display a group name in the documentation that is different from the tag name.
- `summary` can be added to responses when the level of detail doesn't justify the use of the existing `description` field.
- Security schemes can now be `deprecated`. 

OpenAPI 3.2 definition files can be deployed through your usual deployment process: using our [Github Action](https://github.com/bump-sh/github-action), our [CLI](https://github.com/bump-sh/cli), our [API](https://developers.bump.sh/) (now in OpenAPI 3.2 ✨), or directly in your Bump.sh dashboard.

As always, you can reach out at [hello@bump.sh](mailto:hello@bump.sh) for any questions/feedback.