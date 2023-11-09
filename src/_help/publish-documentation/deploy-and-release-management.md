---
title: Deploy and release management
---

- TOC
{:toc}

## What are deployments

Deployment corresponds to the publication of an uploaded API definition of documentation.

We call an "API document" the file that contains your API definition, the content of your API. When you upload and then deploy an API document, it creates or updates an API version: a marked and named iteration of your API.

When your API undergoes a structural change, it is reflected on Bump.sh in the changelog. This change is referred to as an "API change."

![](/images/help/deployments-list.png)

By default, an API document is automatically deployed after being uploaded. However, you can choose to deploy it manually at a later time by using the Manual Release mode. In this case, the latest deployments will be enqueued until you decide to release one of them.

You can also add context (title, description) to any release afterward. This option is available from the page of the deployment, accessible in the list of deployments for your documentation.

### Deploy from the dashboard

To deploy a new API definition of documentation from the dashboard, you first need to go to the settings of that documentation.

From there, you will find the "Deploy new version" button, which will allow you to choose the file to upload and, if the documentation has branches, the branch to deploy it on.

![](/images/help/upload-document-quick.png)

After processing, the new API document will be automatically deployed after a few moments unless you have enabled Manual Release mode.

### Deploy from the CLI

Using the CLI, you can also deploy an API document using the `deploy` command.

> You will need to pass your private documentation access token for this command to work. Either with the `--token` flag or via the `BUMP_TOKEN`environment variable. This token can be found from your documentation settings > CI deployment page.
{: .info}

```
bump deploy path/to/file.json --doc my-documentation --token
```

You can find your own `my-documentation` slug from your documentation settings.

You can also deploy a given file to a different branch of your documentation with the `--branch <branch-name>` parameter. The branch will be created if it doesn’t exist.

```
bump deploy path/to/file.json --doc my-documentation --branch staging
```

### Deploy with CI

### Deploy using the GitHub Action

Our GitHub Action allows you to easily integrate Bump.sh into your projects by simply adding a workflow file.

If you want to deploy your documentation after each push, you can use the following file: `.github/workflows/bump-deploy.yml`

```
name: Deploy documentation

on:
  push:
    branches:
      - main

jobs:
  deploy-doc:
    name: Deploy API doc on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: doc/api-documentation.yml
```

## Release management

Publishing a new API definition of your documentation typically follows a two-step process:
- You upload a new API definition of your documentation through an API document, your specification file.
- This new API document is validated and deployed, becoming the "visible" API definition of your documentation. The changelog will also be update, reflecting changes between the current and previous definitions.

By default, these two steps are automatically linked: uploading a new API document results in its publication. However, it is possible to dissociate them using the Manual Release mode.

The Deployments section of your documentation provides access to the history of all API documents uploaded on Bump.sh, including their status (`enqueued`, `deploying`, `deployed`, or `errored`) and their release status (`Released` or `Not released`).

![](/images/help/deployments-list.png)

### Manual Release

The Manual Release mode is still in beta. Please don't hesitate to contact us if you have any questions.

The Manual Release mode is an option that allows you to separate the upload step from the publication step of your API documentation.

![](/images/help/manual-release-toggle.png)

When activated, uploading an API document of your API documentation will no longer automatically publish it. We continue to prepare this API definition on our side (and you can view a preview and its changelog), but the release step becomes manual. This means you can decide when to make an API definition live for your API users.

This option allows you to continue working on your documentation without worrying about the impact on your users. For example, you can prepare a future definition of your API and its documentation with members of your organization and launch its publication when the time is right.

#### Manually release a deployment

From the list of your deployments, select an API document of your documentation with the "unreleased" status.

![](/images/help/deployments-list-not-released.png)

The deployment preparation page will appear, allowing you to add context by adding a title or a brief description, for example, to accompany this new definition. These fields [support Markdown](/help/specification-support/markdown-support/) to make the result more readable.

![](/images/help/deployment-release-form.png)

### Unrelease an API definition

It is possible to "unrelease" any previously released API definition of your documentation. By clicking on the definition, you will find the "Unrelease" option under the "..." button.

![](/images/help/unrelease-button.png)

> Unreleasing a definition automatically adjusts your documentation: it will revert to the previous definition it was using, and its changelog will be adjusted accordingly to correctly reflect the changes.
{: .info}

> We cannot restore a deleted API document.
{: .warning}

