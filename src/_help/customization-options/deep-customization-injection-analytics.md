---
title: Deep customization, injection & analytics
---

- TOC
{:toc}

> Deep customization options are available in our [paid plan](https://bump.sh/pricing/).
{: .info}

Bump.sh offers deeper customization options, offering full control of your branding. It makes your Bump.sh doc portal truly blend in with your platform. 

It also allows you to set up the same set of tools that you have on your own platform, for example, by adding analytics to your Bump.sh documentation using a script injected in the `<head>` section of your docs.

The [Embed mode](/help/customization-options/embed-mode/) is an even more advanced way to integrate Bump.sh with your existing doc sites and branding.

## How-to

Head injections and custom CSS can be added either through a [reverse proxy](/help/customization-options/embed-mode/#configure-your-proxy) you've set up or managed by Bump.sh. Feel free to [contact us](mailto:hello@bump.sh) so we can assist you.

### Custom CSS

> If you customize fonts, make sure to use a font that is available on the user's device, or loaded in your custom headers.
{: .info}

You can safely customize the style of your doc portal using these CSS variables:

- `--font-family`: the global font family;
- `--heading-font-family`: the font family used for headings (h1, h2, h3, ...). If none is defined, the global font family is displayed;
- `--code-font-family`: the font used for code blocks and examples;
- `--doc-font-size`: the global font size. The default value is 14px;
- `--code-font-size`: the font size used on code blocks and examples. The default value is 12px;
- `--nav-font-size`:  the font size used on side and top navigation bars. The default value is 14px;
- `--doc-font-weight`: the default font weight. The default value is 500;
- `--nav-font-weight`: the font weight used on side and top navigation bars. The default value is 500;
- `--logo-width`: logo width, if the default width doesn't fit your logo width;
- `--logo-height`: logo height, if the default height doesn't fit your logo height;
- `--doc-success-color`: the color used for success messages;
- `--doc-error-color`: the color used for error messages;
- `--doc-warning-color`: the color used for warning messages;
- `--doc-warning-light-color`: the color used for warning messages with a lighter background;

You could also apply your own custom CSS, but keep in mind:

- We don't guarantee the stability of HTML or CSS class names
- Custom overrides might break if we update the rendering engine

### Head injection

If you want to use our CSS variables and your own fonts to apply your branding, or add custom scripts (such as Google Analytics), the `<head>` section is the place to do it. It supports any attribute that can be added in a `<head>` section: metadata, scripts, stylesheets, fonts, ...

```
<!-- Bump.sh: head start -->
<meta name="custom-head" />
<!-- Bump.sh: head end -->
```

We are always open to adding more customization options: if you need to customize other parts of the UI, just [send us a message](mailto:hello@bump.sh) and we'll add the required CSS variables.

