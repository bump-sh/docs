---
title: Head injection (analytics and tools integration) 
---

- TOC
{:toc}

`<head>` injection allows you to add the same set of tools that you have on your own platform, for example to:
- Add analytics tags (Google, Fathom, ...),
- Integrate support tools (such as Intercom or AI assistants).

> Head injections are available in our [Custom plan](https://bump.sh/pricing/).
{: .info}

## How-to

Head injections can be done either through a [reverse proxy](/help/customization-options/embed-mode/#configure-your-proxy) you've set up or managed by Bump.sh. Feel free to [contact us](mailto:hello@bump.sh) so we can assist you.

The `<head>` section is the place to do it. It supports any attribute that can be added in a `<head>` section: metadata, scripts, stylesheets, fonts, ...

```
<!-- Bump.sh: head start -->
<meta name="custom-head" />
<!-- Bump.sh: head end -->
```