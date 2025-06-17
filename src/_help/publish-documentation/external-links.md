---
title: Provide links to external resources
---

- TOC
{:toc}

> Supported specifications: OpenAPI and AsyncAPI
{: .info}

External resources, such as tutorials or guides that don't belong inside the API documentation can be linked in your documentation using `x-externalLinks`.

The `x-externalLinks` array can be added at the root of your API document, which will add link(s) to the resource(s) of your choice, displayed in your documentation navigation bar.

Each object requires two elements:
- `label`: the text that will appear on the link,
- `url`: the URL the link will point to.

```yaml
x-externalLinks:
  - label: My first link
    url: https://my-company.com/my-resource-1
  - label: My second link
    url: https://my-company.com/my-resource-2
```

![Screenshot of an example API Documentation on Bump.sh, with the Give feedback button highlighted at the top right of the screen.](/images/help/x-externalLinks.png)
