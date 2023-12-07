---
title: Changes management
---

- TOC
{:toc}

## GitHub integration

With our [Github Action](/help/continuous-integration/github-actions), you can receive automatic API diff comments directly in your pull requests. This pull request comment will include:

- a diff summary
- information about the breaking change status

Find more details in [our dedicated section](/help/continuous-integration/github-actions).

## Manage changes

Each entry in the changelog is linked to an API document that has been deployed.

If you need to delete an entry from your changelog, you need to unrelease its deploy first: its entry in the changelog will disappear and we regenerate your changelog to accurately reflect this change within the other entries.

Unreleasing an API document can be done directly from the [deployments page](/help/publish-documentation/deploy-and-release-management/) of your API documentation.