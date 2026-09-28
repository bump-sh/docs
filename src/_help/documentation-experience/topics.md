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
|tags| Moves the topic out of the default “Topics” section, into a custom section or a group. Only the first value is used. See [Place topics in sections and groups](#place-topics-in-sections-and-groups).|

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

## External references

You can write your topics in dedicated Markdown files to keep your OpenAPI definition file clean. To reference a Markdown file, add a `$ref` link inside the `content` object of your topic.

```yaml
x-topics:
  - title: Getting started
    content: 
      $ref: ./getting-started.md
  - title: Authentication
    content:
      $ref: ./authentication.md
    example:
      $ref: ./authentication-example.md
```

## Place topics in sections and groups

By default, topics are displayed in the “Topics” section. To display a topic next to the operations it explains, add a `tags` array. Its first value can be:

- a **custom section** name: the topic is displayed at the top of that section, before its groups;
- a **group** name (a tag listed in a custom section): the topic is displayed at the top of that group, before its operations.

Several topics in the same place keep the order of the `x-topics` array.

Custom sections are defined with [`x-tagGroups`](/help/customization-options/sections/).

> **Using OpenAPI 3.2?** If your document uses [nested tags](/openapi/v3.2/documentation/grouping-operations-with-tags/#nested-tag-structures), `x-tagGroups` is ignored: use a parent tag to target a section, or a child tag to target a group.
{: .info}

```yaml
x-tagGroups:
  - name: "journeys" # Custom section
    tags: ["Stations", "Trips"] # Groups of the “journeys” section
tags:
  - name: "Stations"
  - name: "Trips"
x-topics:
  - title: Getting started # No tags: stays in the “Topics” section
    content: Before using the API you need to get an API key.
  - title: Planning a journey
    tags: ["journeys"] # Displayed in the “journeys” section
    content: Find a departure and an arrival station, then search the trips between them.
  - title: Searching for stations
    tags: ["Stations"] # Displayed in the “Stations” group
    content: Filter stations by name, country or coordinates to find the one you need.
```

## Public documentation examples

Here are some examples of public documentation made by teams using `x-topics`:

- [Memo Bank API Documentation](https://docs.api.memo.bank/)
- [Pexip Engage API Documentation](https://developer.pexipengage.com/)