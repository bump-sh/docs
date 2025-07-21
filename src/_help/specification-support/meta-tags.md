---
title: Custom meta tags
---

- TOC
{:toc}

Add custom `meta` tags to the `head` of your documentation pages with the `x-metaTags` extension. It can be used, for example, to improve your own global search with more precise filtering through facets, thanks to customized meta tags retrieved by your internal crawler.

`x-metaTags` can be added at different levels: 
- root, 
- topic, 
- operation, 
- webhook, 
- message, 
- binding, 
- tag ([when the grouping mode is set to "Group by tag"](/help/customization-options/operations-navigation/#group-operations-by-tag)).

Each object inside the `x-metaTags` array requires two elements:
- `name` : the value that will be given to the `name` attribute,
- `content` : the value that will be given to the `content` attribute.

> Tags added to the root of the API definition file will be added to every page of the documentation. Tags added to any other level will only be added to the corresponding pages.
{: .info}

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
