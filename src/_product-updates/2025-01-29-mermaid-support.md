---
title: Mermaid support 
tags: [New]
image: /images/changelog/mermaid.png
---

![mermaid.png](/images/changelog/mermaid.png)

Sometimes, the best way to explain something about your API is to do it visually. That's why we're announcing Mermaid support!

Diagrams and charts are powerful tools, that can be used to share updates on your API development roadmap or give key information on data processing flow, for example. 

Discover the full list of diagrams and charts supported by Mermaid [here](https://mermaid.js.org/syntax/flowchart.html).

To generate one, add a code block declared as `mermaid` inside a `description` or `content` property:

```yaml
  get:
    description: |
      ```mermaid
      erDiagram
        CUSTOMER }|..|{ DELIVERY-ADDRESS : has
        CUSTOMER ||--o{ ORDER : places
        CUSTOMER ||--o{ INVOICE : "liable for"
        DELIVERY-ADDRESS ||--o{ ORDER : receives
        INVOICE ||--|{ ORDER : covers
        ORDER ||--|{ ORDER-ITEM : includes
        PRODUCT-CATEGORY ||--|{ PRODUCT : contains
        PRODUCT ||--o{ ORDER-ITEM : "ordered in"
      ```
```
This example would render the following diagram [(see it live)](https://bump.sh/demo/doc/mermaid-demo/operation/operation-get-booking-parameter):

![Mermaid example](/images/changelog/mermaid-diagram.png)


The support of Mermaid is part of our global Markdown support. [Learn more about it in our help center.](/help/documentation-experience/markdown-support/#diagrams-and-charts-mermaid-support)

As always, don't hesitate to reach out if you have feedback about this feature!

