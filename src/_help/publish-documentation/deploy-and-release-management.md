---
title: Deploy and release management
---

- TOC
{:toc}

## What are deployments

A Deployment is the processing of an API document - containing your API definition - uploaded to Bump.sh servers.

Following this deployment, the new API definition is published to your API consumers. This is what we call a Release: your API documentation is updated, and if your API has changed since the last deployment, a new entry representing this API change is added to your API changelog.

![](/images/help/deployments-list.png)

By default, a deployment is automatically released after its processing. However, you can choose to control the release flow by activating the Manual Release setting. In this case, the latest deployments will be enqueued until you decide to release one of them.

You can also add context (title, description) to any release afterward. This option is available from the page of the deployment, accessible in the list of deployments for your documentation.

### Deploy from the dashboard

To deploy a new API document from the dashboard, you first need to go to the settings of a documentation.

From there, you will find the "Deploy new version" button, which will allow you to choose the file to upload and, if the documentation has branches, the branch to deploy it on.

![](/images/help/upload-document-quick.png)

After processing, the new API document will be automatically released after a few moments unless you have enabled Manual Release mode.

### Deploy from the CLI

Deploying an API Document can also be done from our CLI using the `deploy` command. The complete process is available on the dedicated [CLI page](/help/continuous-integration/cli/).

### Deploy using the GitHub Action

Our [GitHub Action](/help/continuous-integration/github-actions/) allows you to easily integrate Bump.sh into your projects by adding a workflow file.

## Release management

Releasing a new API definition typically follows a two-step process:
- You upload a new API document through your dashboard, our CLI, GitHub Action or API.
- This new API document is validated and deployed, becoming the "visible" one. The changelog is also updated, reflecting changes between the current and previous definitions.

By default, these two steps are automatically linked: uploading a new API document results in its release. However, it is possible to dissociate them using the Manual Release mode.

The Deployments section of your documentation provides access to the history of all API documents uploaded to Bump.sh, including their status (`enqueued`, `deploying`, `deployed`, or `errored`) and their release status (`Released` or `Not released`).

![](/images/help/deployments-list.png)

### Manual Release

> Manual Release is available in our [Custom plan](https://bump.sh/pricing/).
{: .info}

The Manual Release mode is an option that allows you to separate the processing step from the releasing step of your API definition.

![](/images/help/manual-release-toggle.png)

When activated, uploading an API document will no longer automatically release it. We continue to prepare this API definition on our side (and you can view a preview and its future changelog entry), but the release step becomes manual. This means you can decide when to make an API definition live for your API users.

This option allows you to work on future versions of your API without disclosing the changes to your users until the moment you choose.

#### Manually release a deployment

Select a deployment with the "unreleased" status from the list of your deployments.

![](/images/help/deployments-list-not-released.png)

The release preparation page will appear, allowing you to add context by adding a title or a brief description, for example, to explain the context of the change. These fields [support Markdown](/help/enhance-documentation-content/markdown-support/) to make the result more readable.

![](/images/help/deployment-release-form.png)

### Unrelease an API definition

> Unrelease a version is available in our [paid plans](https://bump.sh/pricing/).
{: .info}

It is possible to "unrelease" any previously released deployment. By clicking on the deployment, you will find the "Unrelease" option under the "..." button.

![](/images/help/unrelease-button.png)

> Unreleasing a deployment not only rolls back your API documentation to the previously released one. It also automatically reprocesses its changelog to correctly reflect the changes.
{: .info}

