---
title: Custom meta tags 
tags: [New]
---
Custom meta tags allow you to add your own `meta` tags to the `head` of your documentation, for example, to enhance your own global search experience with filtering through facets based on these meta tags. 

The `x-metaTags` array is composed of objects made of two elements:
- `name`: the value that will be given to the name attribute,
- `content`: the value that will be given to the content attribute.

Adding the `x-metaTags` to the root of your definition:
```yaml
x-metaTags:
  - name: First meta tag
    content: First tag content
  - name: Second meta tag
    content: Second meta tag content
```

Will apply the tags in the HTML of your documentation page:
```html
<head>
  <meta name="First meta tag" content="First meta tag content" />
  <meta name="Second meta tag" content="Second meta tag content" />
</head>
````

You can apply it at different levels of your API definition: root, topic, operation, ... [Learn more about it in our help center](/help/specification-support/meta-tags/)

Any feedback or requests? Don't hesitate to reach out at [hello@bump.sh](mailto:hello@bump.sh)!