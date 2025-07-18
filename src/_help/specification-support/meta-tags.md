---
title: Custom meta tags
---

- TOC
{:toc}

The x-metaTags extension allows to add `meta` tags to the `head` of a documentation page.

`x-metaTags` can be added at different levels: root, topic, tag ([when grouping by tag](/help/customization-options/operations-navigation/#group-operations-by-tag)), operation, webhook, message, ...

Tags added to the root of the API definition file will be added to every page of the documentation. Tags added at any other level will only be added to the corresponding pages.

Each object inside the `x-metaTags` array requires two elements:
- `name` : the value that will be given to the `name` attribute,
- `content` : the value that will be given to the `content` attribute.

## Example
Here's an example of `x-metaTags` added to the root of the API definition and to an operation.

**Adding the x-metaTags in the API definition file**
```yaml
x-metaTags:
  - name: First root tag
    content: First root tag content
  - name: Second root tag
    content: Second root tag content
paths:
  /user:
    post:
      x-metaTags:
      - name: Operation tag
        content: Operation tag content
```

**Impact on the <head> if the loaded documentation page is the root of the API documentation**
```html
<head>
  <meta name="First root tag" content="First root tag content" />
  <meta name="Second root tag" content="Second root tag content" />
</head>
```

**Impact on the `<head>` if the loaded documentation page is the POST /user operation**
```html
<head>
  <meta name="First root tag" content="First root tag content" />
  <meta name="Second root tag" content="Second root tag content" />
  <meta name="Operation tag" content="Operation tag content" />
</head>
```
