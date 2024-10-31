---
title: Get feedback from users
---

- TOC
{:toc}

> Supported specifications: OpenAPI and AsyncAPI
{: .info}

Gathering feedback directly from your users allows you to identify areas that need more explanation, thereby continuously improving the quality of your API documentation.

The `x-feedbackLink` object can be added in the `info` section of your API document, which will add a button to your documentation that directly links to the resource (URL) of your choice.
It requires two elements:
- `label`: the text that will appear on the button
- `url`: can point to a form, for example, or even an email address (using `mailto:`).

```yaml
info:
  x-feedbackLink:
    label: Give feedback
    url: https://my-company.com/feedback
```

![Screenshot of an example API Documentation on Bump.sh, with the Give feedback button highlighted at the top right of the screen.](/images/help/feedback-button.png)
