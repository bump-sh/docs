# Font handling

Bump.sh uses a custom font-face for all its type: [Saans](https://displaay.net/typeface/saans-collection/).

## Font files

- the main heading/body font is a variable font file (_Saans Uprights_). It allows us to render the font in multiple weights with one unique woff2 file.
- the mono font is not a variable font, so we have two files: one for the regular weight and one for the semibold weight.

### Font-related CSS rules

With our variable font, the tailwind "normal way" to change font-weight is not done with classic `font-weight` for `font-style` rules, but with `font-variation-settings`.

This is why specific `vfont-*` tailwind utilities are added. They match the naming of default tailwind utilities with a _v_ prefix (like _variable_ font) and change the font rendering correctly.

## Font subsetting

For extra performance chef's kiss moment, we do what is called "font subsetting". We remove the characters we assume won't ever appear on the website. This small trick has a big impact on the font file size, almost dividing it by 2.

We do this with [glyphhanger](https://github.com/zachleat/glyphhanger). The subsetted fonts are built locally while developing the website, and tracked in git to ease up building. This is done because glyphhanger depends on a few python packages that might be troublesome to have required on cloud services building the static website.

The current subsets have been built with these commands:

```bash
glyphhanger \
  --subset="./saans-uprights.woff2" \
  --formats=woff2 \
  --output=. \
  --whitelist="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀàâäÇçèÉÊËéêëÏîïÔôùûŒœÆ  &•#…€$~˚°%\_=+-×÷\*/[]{}()<>,.:;?@«»©™←↑→↓↖↗↘↙√≤≥'\!\’\“\”\\\`\""

glyphhanger \
  --subset="./saans-mono-regular.woff2" \
  --formats=woff2 \
  --output=. \
  --whitelist="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀàâäÇçèÉÊËéêëÏîïÔôùûŒœÆ  &•#…€$~˚°%\_=+-×÷\*/[]{}()<>,.:;?@«»©™←↑→↓↖↗↘↙√≤≥'\!\’\“\”\\\`\""

glyphhanger \
  --subset="./saans-mono-semibold.woff2" \
  --formats=woff2 \
  --output=. \
  --whitelist="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀàâäÇçèÉÊËéêëÏîïÔôùûŒœÆ  &•#…€$~˚°%\_=+-×÷\*/[]{}()<>,.:;?@«»©™←↑→↓↖↗↘↙√≤≥'\!\’\“\”\\\`\""
```

### Limitations of font subsetting by hand

⚠ Any character not in the given `whitelist` will render with fallback system font (shame).

For now, manual font subsetting, done by giving a fixed whitelist is enough: we 100% control what is written on the website.

You might need to tinker with the whitelist if you happen to write names of Swedish people or other languages with specific characters. For now, English and French (there mostly for the team member names) should be completely supported.

_This setup can eventually be improved so that glyphhanger [crawls the whole website](https://github.com/zachleat/glyphhanger?tab=readme-ov-file#use-the-spider-to-gather-urls-from-links) and whitelists by itself all necessary characters. But that's a rabbit hole I won't get into :)_

### When updating the subsetted fonts

When you run the glyphhanger command with a new whitelist, don't forget to:

- update the commands in this README
- update the unicode-range of the `@font-face` rules in the CSS. The unicode-range is in the glyphhanger command output.
