---
title: API
---

- TOC
{:toc}

If neither the [Github-Action](/help/continuous-integration/github-actions/) or the [CLI](/help/continuous-integration/cli/) are sufficient for you, please read this page to discover what you can do with the [Bump.sh Workspace API](https://developers.bump.sh/doc/workspace/).

## Deploy to your documentation

You can use the [`POST /versions`](https://developers.bump.sh/doc/workspace/operation/operation-post-versions) endpoint to publish a new API document to your documentation.

You will need to provide at least the following request body parameters:
- a `documentation` slug of your target Bump.sh documentation
- a `definition` content of your API document

The endpoint gives you some other optional parameters such as:
- a `branch_name` if you want to deploy to a different branch
- a list of `references` if you have filesystem based external references in your root `definition`

## Manage your releases

> Manual Release is available in our [custom plans](https://bump.sh/pricing/).
{: .info}

With [Manual Release](/help/publish-documentation/deploy-and-release-management/#manual-release), a deployed version stays hidden from your users until you release it. Use [`POST /versions/:id/release`](https://developers.bump.sh/doc/workspace/operation/operation-post-versions-parameter-release) to release it from your pipeline.

## Unrelease a version

> Unrelease a version is available from our [Pro plan](https://bump.sh/pricing/).
{: .info}

Use [`POST /versions/:id/unrelease`](https://developers.bump.sh/doc/workspace/operation/operation-post-versions-parameter-unrelease) to unrelease a version. It also removes its changelog entry.

## Validate an API document

Use [`POST /validations`](https://developers.bump.sh/doc/workspace/operation/operation-post-validations) to check an API document without deploying it. Provide a `definition` content or a `url`.

## Preview an API document

Use [`POST /previews`](https://developers.bump.sh/doc/workspace/operation/operation-post-previews) to render an API document on a temporary URL, active for 30 minutes. Provide a `definition` content or a `url`. Use [`PUT /previews/:preview_id`](https://developers.bump.sh/doc/workspace/operation/operation-put-previews-parameter) to update it.

## Diff between two API documents

You can use the [`POST /diffs`](https://developers.bump.sh/doc/workspace/operation/operation-post-diffs) endpoint to compare two given API documents. To see the diff result you will then need to call the [`GET /diffs/:id`](https://developers.bump.sh/doc/workspace/operation/operation-get-diffs-parameter) endpoint with the `id` returned by the POST request.

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

> Branches are available from our [Pro plan](https://bump.sh/pricing/).
{: .info}

Thanks to the [Branches endpoints](https://developers.bump.sh/doc/workspace/group/endpoint-branches) you can:

- [List existing branches](https://developers.bump.sh/doc/workspace/operation/operation-get-docs-parameter-branches) of your documentation
- [Create a new branch](https://developers.bump.sh/doc/workspace/operation/operation-post-docs-parameter-branches)
- [Delete a branch](https://developers.bump.sh/doc/workspace/operation/operation-delete-docs-parameter-branches-parameter)
- [Promote a branch as the “default” one](https://developers.bump.sh/doc/workspace/operation/operation-patch-docs-parameter-branches-parameter-set_default). **Warning**: this will affect your published documentation and make the given branch the default one visible by your users.

## List your hubs

Thanks to the [hubs endpoints](https://developers.bump.sh/doc/workspace/group/endpoint-hubs) you can:

- [List all the hubs](https://developers.bump.sh/doc/workspace/operation/operation-listhubs) of your organization (requires an organization API key).
- [Fetch information of an existing hub](https://developers.bump.sh/doc/workspace/operation/operation-get-hubs-parameter) including the list of APIs it contains.

## Documentation change webhook

Our API offers a [“documentation change” webhook](https://developers.bump.sh/doc/workspace/operation/operation-webhookdocstructurechange), which can help you receive automated notifications whenever one of your documentation receives a new published API document.

## Deploy to your MCP server

Use [`POST /mcp-servers/:mcp_server_id_or_slug/deploy`](https://developers.bump.sh/doc/workspace/operation/operation-mcpserverdeploy) with an organization API key to deploy a workflow document (`definition`) to your [MCP server](/help/mcp-servers/deploy-workflows/). Add `references` for the OpenAPI sources of an Arazzo document.

## Rate limits

The API is rate limited by IP: 30 requests per minute on diffs and previews endpoints, 100 requests per minute and 300 per 5 minutes overall.