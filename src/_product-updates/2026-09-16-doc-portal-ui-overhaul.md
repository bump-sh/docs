---
title: Your API docs get a whole new look
tags: [Improvement]
---

Most of the attention right now goes to making APIs readable by AI tools. But agents aren't the only ones who use your APIs: developers are. They still read your documentation, scan response bodies, look for the one parameter they're missing. And that part of the experience hasn't moved much in years.

This is why we worked on a major UI verhaul: new type scale, new color palette, and a real dark mode, among many other things. We focused on one thing: making your documentation as scannable as possible.

The new UI, that we call `next` will be rolled out on October 1st, but you can already try it on your documentation by adding `?theme=next` at the end of the URL. It's only a preview: nothing changes for your users.

Changes spread in every part of your doc portal: hub, API Explorer, changelog, etc. Our own [API documentation](https://developers.bump.sh) already runs on it. 

### Built to be quickly scanned

The type scale has been reworked around Inter for the interface, and JetBrains Mono for everything code-related (think anything you would paste into a terminal). 

Content is tighter too. More of your API fits on one screen, without the scrolling that comes with oversized line height and padding. Tighter doesn't mean less scannable: it's the opposite, as a lot of effort and thought was put into fine-tuning the visual hierarchy, ensuring your users are driven to the right information.

Examples now sit on neutral, high contrast surfaces instead of a custom colored panel, and read the same way in light and dark mode, providing top-notch contrasts no matter what custom color is defined. 

### A dark mode with proper contrasts

Dark mode is no longer a filtered version of the light theme. Every surface, badge and code sample is a deliberate choice in each theme, not a side effect of the other. Your brand color still drives the whole interface: accent tints, hover states and text variants are derived from colors you chose, adjusted so contrast stays good.

### Activate it today

If you don't want to wait until October, we can enable it by default on your documentation today: just send us a message at [hello@bump.sh](mailto:hello@bump.sh). And don't hesitate to reach out if you have any feedback before the rollout.