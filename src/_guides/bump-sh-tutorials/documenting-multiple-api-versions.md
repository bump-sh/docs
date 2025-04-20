---
title: Documenting Multiple API Versions
authors: phil
excerpt: 
date: 2025-05-19
# When you release a new version of of an API you’re going to need to keep the old one around for a while, and manage it as its own project until it can be retired. Keep maintaining the docs, avoiding breaking changes with our change detection, and keep customers happy.
---


Versioning an API can be incredibly difficult, but working out how to handle documentation for multiple APIs can be even more of a challenge. When you release a new version of of an API you’re going to need to keep the old one around for a while, and manage it as its own project until it can be retired. 

Thankfully Bump.sh makes it as simple and flexible as you could hope for. 

## Different Workflows

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

## Example: One Directory per API Version

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
          file: src/v3/api/openapi.yaml
          branch: v2-legacy

      - name: Deploy API v3 documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <your-doc-id-or-slug>
          token: ${{secrets.BUMP_TOKEN}}
          file: src/v3/api/openapi.yaml
          branch: v3
```


## Example: One Git Branch per API Version

This setup involves one GitHub repository. Each version of the API is in its own
Git branch, a `v2` and `v3`. In this instance, you could use GitHub Actions,
with different actions in each branch.

In the `v2` Git branch:

```yaml
# .github/workflows/bump.yml
name: Deploy API documentation
on:
  push:
    branches: [v2]

jobs:
  deploy-doc:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <your-doc-id-or-slug>
          token: ${{secrets.BUMP_TOKEN}}
          file: openapi.yaml
          branch: v2-legacy
```

Commit, push, switch to the v3 branch, and merge (or grab just that workflow from v2 with restore):

```shell
git add .github/workflows/bump.yml
git commit -m "docs: deploy v2 docs to bump"
git push origin v2
git checkout v3
git restore --source=v2 .github/workflows/bump.yml
```

Now we can modify mentions of v2 to v3.

```yaml
# .github/workflows/bump.yml
name: Deploy API documentation
on:
  push:
    branches: [v3]

jobs:
  deploy-doc:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <your-doc-id-or-slug>
          token: ${{secrets.BUMP_TOKEN}}
          file: openapi.yaml
          branch: v3
```

Lets commit that and push it up to get both the v2 and v3 branches doing their thing.

```shell
git add .github/workflows/bump.yml
git commit -m "docs: deploy v3 docs to bump"
git push origin v3
```

## Example: One Repository for each API Version

This would look exactly the same as the previous example just pushing the workflows to two different repos instead of two different branches.
