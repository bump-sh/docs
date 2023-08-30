---
title: New Command Line Interface era
categories: [New]
---

![new-cli.gif](/images/updates/new-cli.gif)

Goodbye to our legacy ruby gem, and hello to our new node-based CLI 👋.

We are releasing a new Command Line Interface which is iso-feature with the old CLI. There is one additional improvement though: **we now support recursive external references** (`$ref` keyword in your API specifications), with mixed filesystem or URL paths. You can now refactor your API definitions in small chunks, re-use parts of it, and separate concerns between endpoints, models or nested-objects in peace.


This new CLI package is written in Typescript which will help us to publish a stable & type safe tool. On top of that -and especially with the [oclif](https://oclif.io/) framework- we are now able to publish universal packages for multiple OSes & architectures so everybody can enjoy Bump via command line interface.

### Get it while it's hot 

```
npm install -g bump-cli
```

or download a package directly from the [latest Github release](https://github.com/bump-sh/cli/releases) assets.

### Enjoy the commands

- [`bump preview`](https://github.com/bump-sh/bump-node-cli#bump-preview-file) to build as many API documentation preview as you want. 
- [`bump deploy --dry-run`](https://github.com/bump-sh/bump-node-cli#bump-deploy-file) to validate your future API documentation deployment.
  
  _(⚠️ This is a breaking change compared to our old CLI's and replaces the old `bump validate` command)_
- [`bump deploy`](https://github.com/bump-sh/bump-node-cli#bump-deploy-file) to deploy your latest API documentation changes.
