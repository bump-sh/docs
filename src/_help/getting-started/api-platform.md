---
title: Deploying docs from API Platform
---

- TOC
{:toc}

[API Platform](https://api-platform.com/) is an API-first PHP framework that allows you to create REST and GraphQL APIs using PHP classes, and automatically generates their documentation, based on the OpenAPI specification. If you are new to API Platform, check out [their getting started guide](https://api-platform.com/docs/distribution/).

## Deploying docs from your local machine

The following assumes your local machine is configured with PHP and API Platform.

1. [Create and name](https://bump.sh/docs/new?utm_source=bump&utm_medium=content_hub&utm_campaign=getting_started) your first API documentation. Then, retrieve the name and token of this documentation from the _CI deployment_ settings page.

2. Install the Bump.sh CLI with [npm](https://docs.npmjs.com/cli/v9/configuring-npm/install?v=true) as below, or use [alternative options](/help/bump-cli), with

```bash
npm install -g bump-cli
```

3. Launch your local server with [Docker](https://api-platform.com/docs/distribution/#using-the-api-platform-distribution-recommended) or [Symfony](https://api-platform.com/docs/distribution/#using-symfony-cli)

4. Deploy your doc to Bump.sh with

```bash
bump deploy https://localhost/docs.json \
  --doc my-documentation-name \
  --token my-documentation-token
```

That's it! Enjoy the comfort of Bump.sh to browse through your API doc, and [customize it to your needs](/help/getting-started/quick-start#customization-options).
