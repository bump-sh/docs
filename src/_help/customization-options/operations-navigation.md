---
title: Operations and navigation
---

- TOC
{:toc}

Bump.sh offers several methods for sorting your API operations to provide a smooth and coherent reading structure based on tags or operation names and URLs.

From the “Customize UI” tab in your documentation settings, you can select a custom operations & navigation grouping mode between either “Automatic”, “By Path” or “By Tag”.

## Automatic

By default, Bump.sh analyzes your API definition and suggests the most suitable sorting mode, either by paths or by tags.

If first-level field `tags` are present at the [root of your OpenAPI document object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#openapi-object), Bump.sh will use `Group by tags` as a default documentation generation behavior.

![](/images/help/operations.png)

## Group operations by path

When `Group operations by path` is chosen, Bump.sh deduces group names from related paths. The first part of the path is extracted to generate the group name, and every operation related to it will be grouped together.

![](/images/help/group-by-path.png)

## Group operations by tag

When group operation by tag is selected, Bump.sh will use the [`tags`](https://spec.openapis.org/oas/v3.1.0#tag-object) from your API definition to group, name and sort operations.

Tags offer you better customization of your documentation, going beyond the resource names. You can also add a description for each tag, which will appear in the header of your documentation.

> When "Group operations by tag" is selected, operations without tags will be ignored and won't be displayed.
{: .warning}
