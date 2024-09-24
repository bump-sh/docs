---
title: Integrate Bump.sh with your workflow
---

- TOC
{:toc}

How to integrate your documentation deployment to your Continuous Integration (CI) workflow.

## Available tools

There are multiple ways to integrate with Bump.sh:

- Using the [Github Action](/help/continuous-integration/github-actions)
- Using [Azure DevOps](/help/continuous-integration/azure-devops)
- Using other [CI examples](/help/continuous-integration/ci)
- Manually using the [CLI](/help/continuous-integration/cli)
- More advanced usage can be done with the [API](/help/continuous-integration/api)

## Steps to integrate in your CI

We are presenting the process recommended to our users, but feel free to adapt it to your own workflow/requirements.

We advise to setup two steps in your automation flow:
- a [**validation** and **diff** step](#api-diff--validation-of-the-documentation-file) during development
- followed by a [**deployment** step](#deploy-your-api-document) on production merges.

### API diff & validation of the documentation file

When suggesting a change to your API, you probably follow a pull request flow (also known as merge request) and make the changes on a development branch. You can integrate Bump.sh at this stage to generate an API diff or only validate your changed API document.

With our [Github Action](/help/continuous-integration/github-actions), you can receive automatic API diff comments directly on your GitHub pull requests. With other source code management systems, you can use our [CLI](/help/continuous-integration/cli) within your CI with the `bump diff` command to run each time a development branch is created or updated.

This step will fail the build if the documentation file is not valid. You can also ask our tools to fail if a **breaking change** is detected on your API (Thanks to the `fail_on_breaking:` Github Action input parameter or `--fail-on-breaking` CLI option).

### Deploy your API document

Once your branch has been merged into your main branch (generally the `master` or `main` one) you will want to deploy your new documentation file and make it live.

## Examples

### Github Action

The GitHub action example uses a dedicated action we crafted especially for you. You may find more information for both steps described above on our dedicated [GitHub Action](/help/continuous-integration/github-actions) page.

- **Recommended**: [Deploy Documentation & Diff on Pull Requests](/help/continuous-integration/github-actions/#deploy-documentation--diff-on-pull-requests)
- [API diff & validation step](/help/continuous-integration/github-actions/#diff-on-pull-requests-only)
- [Deploy to your documentation](/help/continuous-integration/github-actions/#deploy-documentation-only)

### Other Continuous Integration tools (CI)

The CI examples are here to help you build a similar process described with our GitHub action. We try to keep some specially crafted scripts for you to build the same experience for your own tools:

- Example [Gitlab CI pipelines](/help/continuous-integration/ci/#gitlab-ci).
- Example [delivery process with a CircleCI](/help/continuous-integration/ci/#circleci) config file.
- Example [Travis CI Build Configuration](/help/continuous-integration/ci/#travis-ci)

### CLI

The CLI can be used in your custom CI scripts with the two available recommendeded steps:

- [`bump diff`](/help/continuous-integration/cli/#api-diff-of-your-changes) to check the changes & validate the API document
- [`bump deploy`](/help/continuous-integration/cli/#deploy-a-file) to publish to your Bump.sh documentation


## Recommendation

Note that if you don't want to keep the private token and documentation id in your code base, you should use environment variables. Our CLI and Github-Action automatically recognizes these 3 variables:

- `BUMP_ID`: your documentation public slug or id
- `BUMP_TOKEN`: your documentation private token
- `BUMP_HUB_ID`: if [using hubs](/help/hubs), your hub public slug or id
