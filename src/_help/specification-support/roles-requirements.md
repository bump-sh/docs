---
title: Role requirements
---

- TOC
{:toc}

Specify which roles or permissions are required to access an API endpoint with `x-rolesRequirements`. Combined with security schemes, this extension helps your API users understand both **what authentication method** they need and **what access levels or roles** their credentials must have.

Add the `x-rolesRequirements` property to any OpenAPI/AsyncAPI operation or OpenAPI webhook. The property accepts either a string or an array of strings.

### Example usage

#### Using an array of strings

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

![Screenshot of an example API documentation on Bump.sh, with a multilines roles requirements area.](/docs/images/help/roles-requirements-multilines.png)

#### Using a single string

```yaml
paths:
  /clusters/{id}:
    get:
      summary: Get cluster details
      x-rolesRequirements: "Cluster privileges: read"
      # ... rest of operation
```

![Screenshot of an example API documentation on Bump.sh, with a single line roles requirements area.](/docs/images/help/roles-requirements-single-line.png)

### Impact on the changelog

Roles requirements updates are not visible in the changelog.