---
title: Roles requirements
tags: [New]
---

Your users need to know what authentication methods are required, but they also have to know what access level or roles are needed to start sending requests to specific endpoints. That's what our new vendor extension `x-rolesRequirements` is made for. Combined with security schemes, it gives your users a complete picture.

The `x-rolesRequirements` property can be added to any OpenAPI/AsyncAPI operation. It can either be a string or an array of strings:

```yaml
paths:
  /clusters:
    post:
      summary: Create a new cluster
      x-rolesRequirements:
        - Organization owner
        - Product owner
      # ... rest of operation
```

![Example of roles requirements](/docs/images/changelog/roles-requirements-multilines.png)

Changes to role requirements don't create changelog entries: you can update them without affecting version history.

[Learn more about it in our help center](/help/specification-support/roles-requirements/)

As always, don't hesitate to [reach out](mailto:hello@bump.sh) if you have any feedback.