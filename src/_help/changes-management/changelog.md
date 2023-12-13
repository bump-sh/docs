---
title: Changelog
---

- TOC
{:toc}

The changelog allows you to follow what's happening on your API, or on your API documentation.

## Changelog entries

With each [new release of an API document](/help/publish-documentation/deploy-and-release-management/), the changelog is automatically updated to inform your API consumers of every change. You can also add context during a release or later.

Each release generates a new entry in the changelog, summarizing the key changes since the previous one.

![](/images/help/changelog.png)

To provide more details or context to your API consumers, you can [add a title and description](/help/publish-documentation/deploy-and-release-management/#manually-release-a-deployment) to a release during deployment: these elements then appear in the changelog entry.

A simple color-coding system provides a quick visual indication of changes. Items in green have been added, items in orange have been modified, and items in red have been deleted.

When a change is considered a [breaking change](/help/getting-started/concepts/#breaking-change), it appears in red at the top of the changelog entry.

![](/images/help/breaking-changes.png)

## Compare changelog entries

From the changelog, you can select two entries, including between two different branches, and compare them instantly.

On the change comparison page, each entry is identifiable by its release date and Bump.sh branch name.

![](/images/help/compare-changes.png)

After selecting the two versions to compare, a detailed list of changes will appear.

![](/images/help/comparison.png)

You have the option to share the URL of this comparison directly with your API consumers or team members for reference if needed.

## Email & RSS notifications

Your API consumers can subscribe to a weekly summary of changes to your API via email by clicking on `Get Updates` from the changelog page.
Two options are available: email notification or RSS feed.

> The emails collected in this way will only be used for sending this changelog summary and nothing else.
{: .info}

![](/images/help/get-updates.png)