---
title: Topics
---

- TOC
{:toc}

`x-topics` is a vendor-specific property that we've created to allow you to add extended content to your API documentation. They enable you to add context, additional information, or even tutorial elements to guide your readers in using your API.

## Use `x-topics`

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

## Public documentation examples

Here are some examples of public documentation made by teams using `x-topics`:

- [Memo Bank API Documentation](https://docs.api.memo.bank/)
- [Pexip Engage API Documentation](https://developer.pexipengage.com/)