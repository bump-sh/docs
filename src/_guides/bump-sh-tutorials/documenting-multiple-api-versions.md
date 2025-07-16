---
title: Documenting Multiple API Versions
authors: phil
canonical_url: https://bump.sh/blog/multiple-api-versions-documentation
excerpt: When you release a new version of an API you’re going to need to keep the old one around for a while, and keep the documentation up to date until it can be retired.
date: 2025-05-13
---

Versioning an API can be incredibly difficult, but working out how to handle documentation for multiple API versions can be even more of a challenge. When you release a new version of an API you’re going to need to keep the old one around for a while, and manage it as its own project until it can be retired. Thankfully Bump.sh makes it as simple and flexible as you could hope for.

## Different workflows

First of all, where and how is the API source code stored?

- one Git repository for each API version
- one Git branch for each API version
- one Git repository for all the API versions (monorepo)

It's best practice to keep the API descriptions (e.g.: `openapi.yaml`) with the API source code, so whichever of the above you're doing will work out just fine. If you're generating OpenAPI or AsyncAPI from source code, that'll work out just fine too.

Let's look at how API documentation version management works with Bump.sh, and walk through a few of these scenarios so you can get things set up however you happen to work.

## Bump.sh "Branches"

Bump.sh supports branches as a concept, but this does not have to be specifically Git branches. It is simply a branch of the API, and that could be version numbers that match the API major version, it could be terms like "beta" and "next". For example, the Twilio Chat API has v2 and v3 versions deployed, so they would set up a v2 branch and a v3 branch.

To add the v3 to the API documentation, go to the API settings on Bump.sh, click **Branches**, and add a new branch. Then pick which branch should be the default, which is the branch which will display to users before they pick a version.

![](/images/guides/documenting-multiple-versions/set-branches.png)

Now there are two branches, using Bump CLI deploy command will deploy to the default branch of the API. You can pick a specific branch by using the `--branch=` argument like so:

```shell
bump deploy --doc "twilio-chat" \
  --token "<your-token>" \
  --branch v3 \
  v3/openapi.yaml
```

As changes are made to the old "v2 (Legacy)" branch they too can be deployed, but the name of the branch is a hyphenated version of the name, so "v2 (Legacy)" becomes "v2-legacy".

```shell
bump deploy --doc "twilio-chat" \
  --token "<your-token>" \
  --branch v2-legacy \
  v2/openapi.yaml
```

This example assumed that both versions of the API were in the same repository and used the CLI, but we can now look at a few more examples that might feel more familiar to your setup.

### Example: One directory per API version

This setup involves one GitHub repository, but each version of the API exists in a sub-directory. This means a single GitHub Action can be used, with two similar deployment steps so that both APIs can be deployed from the same workflow.

```yaml
# .github/workflows/bump.yml
name: Deploy API documentation
on:
  push:
    branches: [main]

jobs:
  deploy-doc:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy API v2 documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <your-doc-id-or-slug>
          token: ${{secrets.BUMP_TOKEN}}
          file: src/v2/api/openapi.yaml
          branch: v2-legacy

      - name: Deploy API v3 documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <your-doc-id-or-slug>
          token: ${{secrets.BUMP_TOKEN}}
          file: src/v3/api/openapi.yaml
          branch: v3
```

### Example: One Git branch per API version

This setup involves one GitHub repository. Each version of the API is
in its own Git branch, a `v2` and `v3`. In this instance, you could
use a GitHub Action, that gets triggered on each of the corresponding
branch. For more flexibility between the Git branch and the Bump.sh
target file & branch, we've detailed below configuration mapping that
you will need to adapt to your needs.

The workflow file would look like this in both Git branches:

```yaml
# .github/workflows/bump.yml
name: Deploy API documentation pushes
on:
  push:
    branches: [v2, v3]

jobs:
  deploy-doc:
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    env:
      TARGET_BUMP_BRANCH: >
        ${{
          fromJson('{
            "v3": "v3",
            "v2": "v2-legacy"
          }')[github.ref_name]
        }}
      SOURCE_FILE: >
        ${{
          fromJson('{
            "v3": "openapi.yaml",
            "v2": "legacy/directory/structure/swagger.yaml"
          }')[github.ref_name]
        }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <your-doc-id-or-slug>
          token: ${{secrets.BUMP_TOKEN}}
          file: ${{env.SOURCE_FILE}}
          branch: ${{env.TARGET_BUMP_BRANCH}}
```

### Example: One repository for each API version

This would look exactly the same as the previous example just pushing the workflow file to two different repos instead of two different branches. You would also need to adapt the branch name targets in the workflow file to align with the branches you use in each of the repository.

## Branch names

The branch names are important, and should be chosen carefully. The default branch is the one that will be shown to users when they first visit the API documentation. When there is only one branch there will be no need to pick a branch, but as soon as there are two or more branches the user will be prompted to pick a branch.

Some API maintainers decide to name branches after major versions like v1, v2, v3. Some maintainers prefer branching based on release dates, especially when using [API evolution](https://apisyouwonthate.com/blog/api-evolution-for-rest-http-apis/) or date-based versions.

Some API maintainers prefer to use terms like "beta" and "next" for their branches, which can be useful when the API is in a state of flux and the version numbers are not yet stable.

## Deprecating old API versions

When a new API version is created, and you create a new Bump.sh branch for the API documentation to match, at some point you will want new users to start using it.

Announcements to users by email are a common soft-touch start, letting users know all the brilliant new functionality available in the new version of the API so they want to go and upgrade, but that won't get them all, and we also want to make sure new users aren't picking up the old version.

The "carrot" of dangling a new shiny default version works best when deployed alongside a stick, and for API versioning that stick is deprecation.

The basic premise of deprecation for APIs is giving people a heads up that an operation is going away and is best avoided. This would make a new API user think twice about using that operation, or that entire version if all the operations are deprecated, and helps point them towards the new version.

Bump.sh [eases the pain of API deprecation in several ways](https://docs.bump.sh/guides/technical-writing/how-our-api-docs-can-ease-the-pain-of-api-deprecation/), with automatic changelogs showing people what has changed, highlighting deprecations in the documentation, and alerting subscribers about meaningful changes.
