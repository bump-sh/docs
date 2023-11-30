---
title: API
---

- TOC
{:toc}

If neither the [Github-Action](/help/continuous-integration/github-actions/) or the [CLI](/help/continuous-integration/cli/) are sufficient for you, please read this page to discover what you can do with the [Bump.sh API](https://developers.bump.sh).

## Deploy to your documentation

You can use the [`POST /versions`](https://developers.bump.sh/operation/operation-post-versions) endpoint to publish a new API document to your documentation.

You will need to provide at least the following request body parameters:
- a `documentation` slug of your target Bump.sh documentation
- a `definition` content of your API document

The endpoint gives you some other optional parameters such as:
- a `branch_name` if you want to deploy to a different branch
- a list of `references` if you have filesystem based external references in your root `definition`

## Diff between two API documents

You can use the [`POST /diffs`](https://developers.bump.sh/operation/operation-post-diffs) endpoint to compare two given API documents. To see the diff result you will then need to call the [`GET /diffs/:id`](https://developers.bump.sh/operation/operation-get-diffs-parameter) endpoint with the `id` returned by the POST request.

For file comparison, you will need to provide at least the following request body parameters:
- a `previous_definition` content
- a `definition` content

For URLs comparison, you will need:
- a `previous_url` pointing to an online API document
- a `url` pointing to an other online API document

The endpoint gives you some other optional parameters such as:
- a list of `previous_references` if you have filesystem based external references in your root `previous_definition`
- a list of `references` if you have filesystem based external references in your root `definition`

## Manage your branches

Thanks to the [Branches endpoints](https://developers.bump.sh/group/endpoint-branches) you can:

- [List existing branches](https://developers.bump.sh/operation/operation-get-docs-parameter-branches) of your documentation
- [Create a new branch](https://developers.bump.sh/operation/operation-post-docs-parameter-branches)
- [Delete a branch](https://developers.bump.sh/operation/operation-delete-docs-parameter-branches-parameter)
- [Promote a branch as the “default” one](https://developers.bump.sh/operation/operation-patch-docs-parameter-branches-parameter-set_default). **Warning**: this will affect your published documentation and make the given branch the default one visible by your users.

## List your Hubs

Thanks to the [Hubs endpoints](https://developers.bump.sh/group/endpoint-hubs) you can:

- [Fetch information of an existing Hub](https://developers.bump.sh/operation/operation-get-hubs-parameter) including the list of APIs it contains.

## Documentation Change Webhook

Our API offers a [“documentation change” webhook](https://developers.bump.sh/operation/operation-webhookdocstructurechange), which can help you receive automated notifications whenever one of your documentation receives a new published API document.

For more information on how to use this webhook please check the [dedicated help page](/help/api-change-management/webhooks/).


