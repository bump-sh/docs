---
title: Migrate from Redocly
authors: phil
excerpt: Move your OpenAPI out of Redocly and into your own source control, so you can control more of the workflow with all the same benefits.
date: 2024-06-10
---

Redocly is a hosted OpenAPI documentation SaaS which works in a similar way to Bump.sh: you work on OpenAPI wherever you want, then publish it up to Redocly via various Git hosting providers or Continuous Integration. The fact that it works so similarly means you can switch from Redocly easily, and start getting all the extra benefits of breaking change detection and an API changelog with minimal effort.

## Step 1: Find your OpenAPI

Most users will have set Redocly up to pull from GitHub, GitLab, or Bitbucket, making this stage very simple. You already have your OpenAPI in your control. Going to "Settings" > "Source" will remind you exactly which repository, which branch, and which file exactly.

![](/docs/images/guides/migrating-from-redocly/source-code.png)

If you are using some more complex CI/CD setup and have no idea where your OpenAPI originates, and the people who knew have left the company without a trace, you can export OpenAPI from Redocly.

![](/docs/images/guides/migrating-from-redocly/export-from-redocly.png)

Get the downloaded OpenAPI into your source code repository somewhere sensible, and give it a tidy name in the process.

```
mv ~/Downloads/swagger.yaml ~/src/train-travel-api/openapi.yaml
```

Now you can add this OpenAPI to your source control, which assuming Git is a case of:

```
cd ~/src/train-travel-api

git add openapi.yaml

git commit -m "docs: imported openapi"
```

## Step 2: Publish OpenAPI as Documentation

Instead of installing a GitHub Application, Bump.sh uses a [GitHub Action](/help/continuous-integration/github-actions/) for deployments. Alternatively you can get creative [with the command-line](/help/continuous-integration/cli/), using a [Continuous Integration setup](/help/continuous-integration/ci/), or even [deploying via the Bump.sh API](/help/continuous-integration/api/).

```yaml
# .github/workflows/bump.yml

name: Check & deploy API documentation

on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main

permissions:
  contents: read
  pull-requests: write

jobs:
  deploy-doc:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: doc/api-documentation.yml

  api-diff:
    if: ${{ github.event_name == 'pull_request' }}
    name: Check API diff on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Comment pull request with API diff
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: doc/api-documentation.yml
          command: diff
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

Grab your Doc ID and Access Token from the Automatic Deployment settings, pop the Doc ID into the GitHub Action and put the API specific `BUMP_TOKEN` into the GitHub repository Secrets.

![](/docs/images/guides/migrating-from-redocly/automatic-deployment.png)

This workflow will have Bump.sh make previews on Git branches, then deploy the main version of the documentation when a branch is merged. By doing this the pull requests also get change detection, allowing for warnings about breaking changes, and making a simple list of changes to help with design reviews.

![](/docs/images/guides/migrating-from-redocly/bump-breaking-change.png)

A side benefit of working this way is that you can defer all configuration about how reviews work, what checks should be involved, who is in charge of approving changes, etc. to the pull request settings of your source control.

Once a guide is published you can view the hosted documentation on Bump.sh, and it will look a little something like this: [Train Travel API Documentation](https://bump.sh/bump-examples/doc/train-travel-api).

## Step 3: Use Hubs to Replace Developer Portals

If you were using the Developer Portals feature with Redocly to group together multiple APIs, you can use [Hubs](/help/hubs/) to recreate this functionality and provide a landing page for each group of APIs.

![](/docs/images/help/categories.png)

## Vendor Extension Compatibility

Both Redocly and Bump.sh support vendor extensions, which are non-standard additions to the OpenAPI, starting with an `x-` like `x-logo`. Some extensions are based on common conventions, but some are vendor specific, and some are there to support functionality that was missing in older versions of OpenAPI that are no longer needed.

### Bump.sh Supports

- `x-topics` - Add more context paragraphs in your generated documentation. [Learn more](/help/enhance-documentation-content/topics/).

- `x-codeSamples` - Add your own code samples in one or more programming languages to your documentation. [Learn more](/help/specification-support/doc-code-samples).

- `x-beta` - Allows you to identify some components of your documentation as beta. [Learn more](/help/specification-support/doc-beta).

To help you with your migration, here is a full list of the extensions Redocly support, with suggestions of alternative approaches where they exist.

| Location  | Extension Keyword            | Bump.sh | Alternative                                                                                                                    |
| --------- | ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Root      | `x-servers`                  | ❌      | Use the `servers` keyword added in OAS3.0                                                                                      |
| Root      | `x-tagGroups`                | ❌      |
| Tag Group | `x-ignoredHeaderParameters`  | ❌      |
| Info      | `x-logo`                     | ❌      | Upload a logo using [customization settings](/help/customization-options/color-logo-meta-images/).         |
| Tag       | `x-traitTag`                 | ❌      |
| Tag       | `x-displayName`              | ❌      | Use human-readable tag names.                                                                                                  |
| Operation | `x-codeSamples`              | ✅      |
| Parameter | `x-examples`                 | ❌      | Use the `examples` keyword added in OAS3.0.                                                                                    |
| Response  | `x-summary`                  | ❌      |
| Schema    | `x-nullable`                 | ❌      | Use the `nullable` keyword added in OAS3.0 or `type: null` added in OAS3.1                                                     |
| Schema    | `x-extendedDiscriminator`    | ❌      | Discriminator is confusing, poorly supported, and best avoided. Use oneOf instead.                                             |
| Schema    | `x-additionalPropertiesName` | ❌      | Both additionalProperties and newer unresolvedProperties now accept a schema that can contain this extra information and more. |
| Schema    | `x-explicitMappingOnly`      | ❌      | Discriminator is confusing, poorly supported, and best avoided. Use oneOf instead.                                             |
