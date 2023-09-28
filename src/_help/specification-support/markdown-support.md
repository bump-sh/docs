---
title: Markdown support
---

- TOC
{:toc}

Bump supports common Markdown syntax, language color syntax highlighting, and information call-outs. Markdown can be included inside your contract file or as an external reference using dedicated Markdown files. Here's several options that may help.

## Common Markdown syntax support

|Formatting|Markdown Syntax|Rendering|
|---|---|---|
|bold|`**bold**`|**bold**|
|italic|`_italic_`|_italic_|
|link|`[links](https://bump.sh)`|[links](https://bump.sh/)|
|inline code|`̀ inline code ̀`|`inline code`|
|highlight|`==highlight==`|[highlight](https://bump.sh/)|
|strike-through|`~~strikethrough~~`|~~strikethrough~~|
|footnote|`Footnote[^1]`|Footnote[^1]|
|quotes|`> quotes`| > quotes |

## Titles & headings

- Heading 1: `# A first-level title`
- Heading 2: `## A second-level title`
- Heading 3: `### A third-level title`

## Multi-line code blocks with language color syntax highlighting

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

## Information call-outs

Bump support information call-outs (of type `info`, `warn`, `success` or `error`) with the quote markdown syntax (lines starting with `> ` ) if the first line contains one of the call-out types.

E.g.

```undefined
> info
> this is an important information to **standout**
```

will render:

> this is an important information to **standout**
{: .info}

## Images

Use the following syntax to add images in your markdown
```
![Alt text](/path/to/image.jpg "Image title")
```

Note that even if it's a best practice to always add an [alt text](https://en.wikipedia.org/wiki/Alt_attribute#Usage) for an image, the parameters `Alt text` and `"Image title"` are optional.

### Image sizing

If you want to manually set the size of your image you can use Bump.sh `=dimension` parameter just before the closing parenthesis as:
```
![Alt text](/path/to/image.jpg "Image title" =dimension)
```

`=dimension` uses the following syntax:
```
=[width][unit]x[height][unit]
```

for instance using `=100pxx50px` where 
- `100` is the `width`
- `px` the `unit`
- `x` the `separator`
- `50` the `height`
- second `px` is `unit` again
will output an image with 100 pixels height and 50 pixels width.

At least one `height` *or* `width` parameter is mandatory, everything else being optional.

```
=100pxx50px   # with everything
=100x50       # without unit
=100          # without height (x separator not needed) and unit
=100px        # without height
=x50          # without width and unit
=x50px        # without width
```

>- If you don't specify a `unit` it will default to pixel
- If you don't specify `width` *or* `height`, the other value will be a ratio calculated from the original size of the image so it doesn't shrink
{: .info}

You can use any of the following CSS length units as `unit`:

**Absolute units**:
- `cm` centimeters
- `mm` millimeters
- `in` inches (1in = 96px = 2.54cm)
- `px` pixels (1px = 1/96th of 1in)
- `pt` points (1pt = 1/72 of 1in)
- `pc` picas (1pc = 12 pt)

**Relative units**:
- `em` relative to the font-size of the element (usually 1em = 16px)
- `ex` relative to the x-height of the current font (rarely used)  
- `ch` relative to the width of the "0" (Unicode U +0030) in the current font
- `rem` relative to font-size of the root element   
- `vw` relative to 1% of the width of the viewport*  
- `vh` relative to 1% of the height of the viewport*   
- `vmin` relative to 1% of viewport's* smaller dimension   
- `vmax` relative to 1% of viewport's* larger dimension  
- `%` relative to the parent element

## Markdown files as an external reference

Markdown files can be included as an [external reference](/help/specification-support/references) within your contract document with the $ref syntax `$ref: "./path/to/local-markdown.md"`. In the same way you can extract part of your contract (usually JSON schema of your models into dedicated `*.yaml` or `*.json` files), you can extract your markdown content into dedicated files too.

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

It's a great way to include “Topic” sections with handwritten content before the documentation of endpoints/webhooks (or channels in case of an [AsyncAPI](https://www.asyncapi.com/) contract) in dedicated Markdown files. Thanks to the `x-topics` top-level property in your contract as [explained in the dedicated help page](/help/doc-topics).
