---
title: Global support of external references
tags: [New]
---

As your API grows, your specification becomes more and more complex. At some point, splitting it up into multiple files with `$ref` references pointing to these external resources can help a lot.

We have just released full external references support  by updating:
* our web app
* our CLI ([version 0.7 is out](https://github.com/bump-sh/bump-cli/releases/tag/v0.7.0))
* our GitHub action ([version 0.2 is out](https://github.com/marketplace/actions/api-documentation-on-bump))

Now, no matter the channel you use to deploy a specification, Bump will resolve all references (when possible) and import their content into your documentation.

Want to learn more? Have a look at [our documentation](https://docs.bump.sh/help/specifications-support/references/).