---
title: Hubs
---

- TOC
{:toc}

Easily create APIs catalogs to help your developers or consumers discover and synchronize with your entire APIs ecosystem. Only available with the Business plan.

## Deploying inside a hub using our CLI

Hubs provide their own authentication token. You can deploy an existing hub documentation using either its own authentication token, or the hub one.

```shell
bump deploy your/doc.yml --doc my-doc --hub hub-slug-or-id --token my-doc-token
bump deploy your/doc.yml --doc my-doc --hub hub-slug-or-id --token hub-token
```

## Default settings

You can define default settings at the hub level. These settings will be then used by the hub's documentations. You can define:

- logo
- color scheme
- grouping strategy (group by tag or by path)
- navigation mode (1 or 2 levels navigation)

The default settings can be overridden at the documentation level by selecting specific values in the documentation settings tab.

## Group documentations by tag

You can display hub's documentations grouped by tag instead of a global list. Select "Group documentations by tag" in your hub's UI settings, and fill tags for each documentation.

You can add multiple tags to a documentation. It will be displayed under each associated tag on the hub.

## Auto create the documentation

You can create a documentation on the fly by using the `--auto-create` CLI option. When deploying, if the documentation doesn't exist yet, a new one will be created with your hub defaults, the given slug (provided with `--doc`) and documentation name (`--doc-name`).

```shell
bump deploy your/doc.yml --auto-create --doc my-doc --hub hub-slug-or-id --token hub-token
```

In this case, you have to provide the following parameters:

- `--auto-create`: activate the auto-creation mode
- `--doc`:  the documentation slug (url) you want to use
- `--doc-name` (optional): the documentation name you want to use. Automatically generated from documentation's slug if missing.
- `--hub`:  the hub slug (or id)
- `--token`: the hub token

You can also combine this with the `--filename-pattern <pattern>` flag if you want to deploy multiple api definition files all at once.

```shell
bump deploy your/apis/folder/ --auto-create --filename-pattern *-{slug}-api --hub hub-slug-or-id --token hub-token
```

This command will search all files from the `your/apis/folder/` which matches the pattern `*-{slug}-api` and deploy each matching file to the corresponding `{slug}` documentation.

For instance, a file called `private-payment-service-api.yml` will be deployed to a documentation on Bump.sh with the slug `payment-service`. Where as a file called `data.json` will not matched and be ignored by the command stated above.

For more details about the folder deployment inside a Hub, please check the [Bump CLI related paragraph documentation page](../bump-cli#deploy-a-folder).

