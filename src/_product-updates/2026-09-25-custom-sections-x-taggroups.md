---
title: Shape your doc navigation around your use cases
tags: [New]
image: /docs/images/changelog/x-tagGroups.png
---

![A documentation navigation where the journeys, bookings and account custom sections each contain a set of tagged operations](/docs/images/changelog/x-tagGroups.png)

Until now, operations and groups of operations sat under the same “Endpoints”, “Webhooks” and “Channels” sections. That's fine on a small API, but for APIs covering multiple business use cases, it can get noisy really quickly.

The `x-tagGroups` vendor extension lets you add a level to your navigation by defining your own sections.

```yaml
x-tagGroups:
  - name: "journeys"
    tags: ["Stations", "Trips"]
  - name: "bookings"
    tags: ["Reservations", "Payments", "Tickets"]
  - name: "account"
    tags: ["Profile", "API keys"]
```

Your users find what they came for faster: a section can gather everything around a single use case, whatever it is made of (regular operations, webhooks, or both).

Tags you leave out of a section aren't hidden: they stay in their default section, so you only declare the structure you actually care about.

`x-tagGroups` works for both OpenAPI and AsyncAPI documents, regardless of their version. If you're already using OpenAPI 3.2, you can [customize your sections natively using the `parent` property of tags](/openapi/v3.2/documentation/grouping-operations-with-tags/#nested-tag-structures).

Learn more about custom sections in the [help center](/help/customization-options/sections/), and reach out at [hello@bump.sh](mailto:hello@bump.sh) for any questions or feedback.