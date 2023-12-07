---
title: Changes management
---

- TOC
{:toc}

Tracking API changes is essential, both for users and developers.

## What is a change

Changes are differentiated into various categories:

| Documentation change     | a description is modified  |
| Structural change        | the structure of the API definition is modified  |
| Breaking change    | a major change in your API definition requires an update to the code consuming the API for its users |

Breaking changes are the ones your API consumers should not miss and are highlighted in the changelog. Here is a non-exhaustive list of criteria that help us determine if a change is breaking or not:
- Renaming/Deleting an endpoint or operation
- Renaming/Deleting a property (body, parameters, etc...)
- Changing the "type" attribute of a property
- Removing polymorphism of a property
- Marking an existing property as required
- Add or delete a security requirement

## How to manage and track changes

[Changelog](/help/changes-management/changelog/) is a crucial feature of Bump.sh, recording the history of all deployments and detailing changes compared to previous versions.

The [changes comparison](/help/changes-management/changelog/#compare-changelog-entries/) allows you to compare two deployments, regardless of differences in dates or branches, making it easier to update your API users.

To offer a smoother experience, you can also integrate [changes management](/help/changes-management/changes-management/) and [tracking integrations](/help/changes-management/integrations/) directly into your existing workflows.

And to ensure you don't miss any updates, Bump.sh offers [various notification options](/help/changes-management/changelog/#email--rss-notifications/), whether it's integration into your existing workflows or email notifications, you can be confident that you'll stay informed about important changes.