# Markdown support

Bump supports common Markdown syntax, language color syntax highlighting, and information call-outs. Markdown can be included inside your contract file or as an external reference using dedicated Markdown files. Here's several options that may help.

# Common Markdown syntax support

Formatting

Markdown syntax

Rendering

bold

`**bold**`

**bold**

italic

`_italic_`

_italic_

link

`[links](https://bump.sh)`

[links](https://bump.sh/)

inline code

`̀ inline code ̀`

`inline code`

highlight

`==highlight==`

[highlight](https://bump.sh/)

strike-through

`~~strikethrough~~`

strikethrough

footnote

`Footnote[^1]`

Footnote¹
¹: Content of the first footnote

quotes

`> quotes`

- > quotes
>

# Titles & headings

- Heading 1: `# A first-level title`
- Heading 2: `## A second-level title`
- Heading 3: `### A third-level title`

# Multi-line code blocks with language color syntax highlighting

E.g.

```undefined
    ```json
    {
      "hello": "world",
      "number": 1,
      "boolean": true
    }
    ```
```

will render:

```javascript
{
  "hello": "world",
  "number": 1,
  "boolean": true
}
```

# Information call-outs

Bump support information call-outs (of type `info`, `warn`, `success` or `error`) with the quote markdown syntax (lines starting with `> ` ) if the first line contains one of the call-out types.

E.g.

```undefined
> info
> this is an important information to **standout**
```

will render:

this is an important information to **standout**

# Markdown files as an external reference

Markdown files can be included as an [external reference](undefined) within your contract document with the $ref syntax `$ref: "./path/to/local-markdown.md"`. In the same way you can extract part of your contract (usually JSON schema of your models into dedicated `*.yaml` or `*.json` files), you can extract your markdown content into dedicated files too.

**E.g.** Your OpenAPI contract `api-contract.yml` can thus looks like:

```yaml
openapi: 3.1.0
info:
  title: Bump API documentation
  version: 1.0.0
  description:
    $ref: "./docs/introduction.md"
x-topics:
  - title: Getting started
    content:
      $ref: "./docs/getting-started.md"
  - title: Use cases
    content:
      $ref: "./docs/use-cases.md"
    example:
      $ref: "./docs/use-cases-examples.md"
servers:
  ...
paths:
  ...
```

With files `docs/introduction.md`, `docs/getting-started.md`, `docs/use-cases.md` and `docs/use-cases-examples.md` right next to your contract document, you will be able to generate a comprehensive API documentation with nicely formatted content for your users.

It's a great way to include “Topic” sections with handwritten content before the documentation of endpoints/webhooks (or channels in case of an [AsyncAPI](https://www.asyncapi.com/) contract) in dedicated Markdown files. Thanks to the `x-topics` top-level property in your contract as [explained in the dedicated help page](undefined).

# Adding topics to your documentation

Creating good API documentation requires giving users context and guides. As most of the specifications don't permit to add generic content, we have created a custom property. Setting the `x-topics` property at the root of your documentation specification will let you add some content sections at the beginning of your documentation.

Each topic can have the following properties:

Property

Description

title

Topic title as it will appear in the navigation bar and in the content section.

content

The topic content. Markdown is fully supported here.

example

Will appear in the examples section, if activated. Markdown is fully supported here.

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

