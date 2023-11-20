---
title: Changelog
---

- TOC
{:toc}

The changelog allows you to quickly track the breaking changes in an API documentation.

With each [new release of an API document](/help/publish-documentation/deploy-and-release-management/), it is automatically updated to inform your API consumers of every change. You can also add context during a release or later.

## What is a change

Changes are differentiated into various categories:

| Documentation change     | a description is modified  |
| Structural change        | the structure of the API definition is modified  |
| Breaking change    | a major change in your API definition requires an update to the code consuming the API for its users |

Breaking changes are the ones your API consumers should not miss and are highlighted in the changelog. Here is a non-exhaustive list of criteria that help us determine if a change is breaking or not:
- Renaming/Deleting an endpoint or operation
- Renaming/Deleting a property (body, parameters, etc...)
- Changing the "type" attribute of a property
- Marking an existing property as required
- Add or delete a security requirement

## Changelog entries

Each release generates a new entry in the changelog, summarizing the key changes since the previous one.

![](/images/help/changelog.png)

To provide more details or context to your API consumers, you can add a title and description to a release during deployment: these elements then appear in the changelog entry.

A simple color-coding system provides a quick visual indication of changes. Items in green have been added, items in orange have been modified, and items in red have been deleted.

When a change is considered a breaking change, it appears in red at the top of the changelog entry.

![](/images/help/breaking-changes.png)

## Manage changelog entries

Each entry in the changelog is linked to a deployment that has been released.

If you need to delete an entry from your changelog, you need to unreleased its deploy first: its entry in the changelog will disappear and we regenerate your changelog to accurately reflect this change within the other entries.

Unreleasing an API document can be done directly from the [deployments page](/help/publish-documentation/deploy-and-release-management/) of your API documentation.

