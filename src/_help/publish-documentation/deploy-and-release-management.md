---
title: Deploy and release management
---

- TOC
{:toc}

## What are deployments

Deployment corresponds to the publication of an uploaded version of documentation.

When we talk about deployment, we mean the act of publishing a version of your documentation to your API users. A deployed version is a published, live version.

![](/images/help/deployments-list.png)

By default, a version is automatically deployed after being uploaded. However, you can choose to deploy a version manually at a later time by using the Manual Release mode.

You can also add a title and description to your last automatic deployment afterward. This option is available from the page of the deployment, accessible in the list of deployments for your documentation.

### Deploy from the dashboard

To deploy a new version of documentation from the dashboard, you first need to go to the settings of that documentation.

From there, you will find the "Deploy new version" button, which will allow you to choose the file to upload and, if the documentation has branches, the branch to deploy it on.

![](/images/help/upload-version-quick.png)

After processing, the new version will be automatically deployed after a few moments unless you have enabled Manual Release mode.

### Deploy from the CLI

Using the CLI, you can also deploy a version using the `deploy` command.

```
bump deploy path/to/file.json --doc my-documentation
```

You can find your own `my-documentation` slug from your documentation settings.

You can also deploy a given file to a different branch of your documentation with the `--branch <branch-name>` parameter. The branch will be created if it doesn’t exist.

```
bump deploy path/to/file.json --doc my-documentation --branch staging
```

> You will need to pass your private documentation access token for this command to work. Either with the `--token` flag or via the `BUMP_TOKEN`environment variable. This token can be found from your documentation settings > CI deployment page.
{: .info}

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

Publishing a new version of your documentation typically follows a two-step process:
- You upload a new version of your documentation through a specification file.
- This new version is validated and deployed, becoming the "visible" version of your documentation. The changelog will also be update, reflecting changes between the current and previous version.

By default, these two steps are automatically linked: uploading a new version results in its publication. However, it is possible to dissociate them using the Manual Release mode.

The Deployments section of your documentation provides access to the history of all versions uploaded on Bump.sh, including their status (`enqueued`, `deploying`, `deployed`, or `errored`) and their release status (`Released` or `Not released`).

![](/images/help/deployments-list.png)

### Manual Release

The Manual Release mode was recently introduced on Bump.sh and is still in beta. Please don't hesitate to contact us if you have any questions.

The Manual Release mode is an option that allows you to separate the upload step from the publication step of your API documentation.

![](/images/help/manual-release-toggle.png)

When activated, uploading a version of your API documentation will no longer automatically publish it. We continue to prepare this version on our side (and you can view a preview and its changelog), but the release step becomes manual. This means you can decide when to make a version live for your API users.

This option allows you to continue working on your documentation without worrying about the impact on your users. For example, you can prepare a future version of your API and its documentation with members of your organization and launch its publication when the time is right.

#### Release manually a deployment

From the list of your deployments, select a version of your documentation with the "unreleased" status.

![](/images/help/deployments-list-not-released.png)

The deployment preparation page will appear, allowing you to customize it by adding a title or a brief description, for example, to accompany this new version. These fields support Markdown to make the result more readable.

![](/images/help/deployment-release-form.png)

### Unrelease a version

It is possible to "unrelease" any previously released version of your documentation. By clicking on the version, you will find the "Unrelease" option under the "..." button.

![](/images/help/unrelease-button.png)

> Unreleasing a version automatically adjusts your documentation: it will revert to the previous version it was using, and its changelog will be adjusted accordingly to correctly reflect the changes.
{: .info}

> We cannot restore a deleted version.
{: .warning}

