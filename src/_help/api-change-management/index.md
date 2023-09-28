---
title: API change management
---

- TOC
{:toc}

## Automatic API changelog

Bump automatically builds a changelog for your API. Each time you upload a new version of your API definition, you will have a new event in your changelog. A link to the changelog page is available on each documentation:

![The changelog link](/images/help/changelog-link-dark.png)

As you can see below on the [Bump API changelog](https://developers.bump.sh/changes), every changes we made are listed: whether it's a structural change (endpoint or parameter removed, modified or added for example) or a content change (description or example modification).

![Bump API changelog](/images/help/changelog.png)

## Breaking changes identification

Bump automatically identifies when a **change is breaking** for your API consumers. Here are the changes considered as breaking:

- Rename or delete endpoint, _unless it was deprecated before_
- Rename or delete a property (body, header or query parameter), _unless it was deprecated before_
- Modify the type of a property
- Set an existing property as required
- Add or delete a security requirement

## Changes notification

Bump can notify changes via Slack, email, RSS or any custom HTTP webhook.

### Slack

Each time your API changes, you can notify your team directly on Slack by activating the Slack integration in your API integrations settings:

![Check the "Notify changes on Slack", fill your webhook URL and the channels you want to get the notifications on](/images/help/legacy/twaSpSvrbHghRTMKtqa2.png)

### Email

Users can subscribe to your API changelog and receive a weekly digest.

![Email changelog subscription](/images/help/legacy/8S2a0sPvEPpUkg6J6LMS.png)

### RSS

The changelog page exposes an RSS feed your users can subscribe to. Here is an example with the [Bump API changelog](https://developers.bump.sh/changes.rss).

### Webhooks

You can define as many webhooks as you wish to receive structural changes when they occur on your documentations. Please check [the dedicated page to find out how to setup a webhook](/help/api-change-management/webhooks).

# GitHub integration

With our [Github Action](/help/continuous-integration/github-actions), you can receive automatic API diff comments directly in your pull requests. This pull request comment will include:

- a diff summary
- information about the breaking change state

![GitHub integration example](/images/help/github-api-diff.svg)
