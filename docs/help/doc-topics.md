# Documentation topics

Creating good API documentation requires giving users context and guides. As most of the specifications don't permit to add generic content, we have created a custom property. Setting the `x-topics` property at the root of your documentation specification will let you add some content sections at the beginning of your documentation.

|Property|Description|
|---|---|
|title|Topic title as it will appear in the navigation bar and in the content section.|
|content|The topic content. Markdown is fully supported here.|
|example|Will appear in the examples section, if activated. Markdown is fully supported here.|

Example:

```yaml
x-topics:
  - title: Getting started
    content: Before using the API you need to get an API key by sending us an email.
  - title: Authentication
    content: Send the `X-API-KEY` header with all your requests.
    example: |
      ```
      $ curl \
        -X POST https://api.example.com/endpoint/ \
        -H "X-API-KEY: XXXXXX" \
      ```
```
