---
title: GitHub Action
---

- TOC
{:toc}

## Generate your API documentation & changelog

Bump is a Continuous Documentation Platform: it lets you keep your API doc always synchronized with your codebase. With this [Github Action](https://github.com/actions) you can automatically generate your API reference (with changelog and diff) on [Bump](https://bump.sh) from any [OpenAPI](https://github.com/OAI/OpenAPI-Specification) or [AsyncAPI](https://github.com/asyncapi/asyncapi) file.

## Usage

Start by creating a documentation on [Bump](https://bump.sh/users/sign_up). Then add one of the following workflow file to your GitHub project.

> In all the examples below, make sure to change the branch name `main` with the name of your repository main destination branch, replace `<BUMP_DOC_ID>` with your Bump documentation slug or id and change the filepath `doc/api-documentation.yml` with your api specification file path.
{: .info}

> [`actions/checkout`](https://github.com/actions/checkout) has to be called **before our action**.
{: .warning}

### Deploy on `git push`

If you only need to deploy the documentation on push you can use this workflow file:

`.github/workflows/bump-deploy.yml`

```yaml
name: Deploy documentation

on:
  push:
    branches:
      - main

jobs:
  deploy-doc:
    name: Deploy API doc on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: doc/api-documentation.yml
```

### API diff on pull requests

If you only want to have API diff summary sent as a comment on your pull requests:

`.github/workflows/bump-diff.yml`

```yaml
name: API diff

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read
  pull-requests: write

jobs:
  api-diff:
    name: Check API diff on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Comment pull request with API diff
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: doc/api-documentation.yml
          command: diff
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

### API diff on pull requests & Deploy on push

This is the most common workflow that we [recommend](/help/continuous-integration#integrate-with-your-ci), which will create two steps in your automation flow: a validation & diff step on code reviews, followed by a deployment step on merged changes.

`.github/workflows/bump.yml`

```yaml
name: Check & deploy API documentation

on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main

permissions:
  contents: read
  pull-requests: write

jobs:
  deploy-doc:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: doc/api-documentation.yml

  api-diff:
    if: ${{ github.event_name == 'pull_request' }}
    name: Check API diff on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Comment pull request with API diff
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: doc/api-documentation.yml
          command: diff
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

> Since [February 2nd, 2023](https://github.blog/changelog/2023-02-02-github-actions-updating-the-default-github_token-permissions-to-read-only/), the default GITHUB_TOKEN permissions are set to read-only for every new repository.
>
> Permissions have to be explicitly defined in your workflows, as illustrated above.
{: .warning}

## Input parameters

- `doc` (required): Documentation slug (or id). Can be found in the documentation settings on <https://bump.sh/docs>
- `token` (required): Do not add your documentation token here, but create an [encrypted secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets) that holds your documentation token.
  - Your Bump.sh token can be found in the documentation settings on [your API dashboard](https://bump.sh/docs). Copy it for later usage.
  - In your GitHub repository, click “Settings”, and then “Secrets”.
  - Click the button “New repository secret”, name the secret `BUMP_TOKEN` and paste your Bump.sh token in the value field.
- `file`: Relative path to the documentation file. _Default: `api-contract.yml`_
- `hub` (optional): Hub slug or id. Needed when deploying to a documentation attached to a Hub. Can be found in the hub settings on <https://bump.sh>
- `branch` (optional): Branch name used during `deploy` or `diff` commands. This can be useful to maintain multiple API reference history and make it available in your API documentation.
- `command`: Bump.sh command to execute. _Default: `deploy`_
  - `deploy`: deploy a new version of the documentation
  - `diff`: automatically comment your pull request with the API diff
  - `dry-run`: dry-run a deployment of the documentation file
  - `preview`: create a temporary preview
- `expires` (optional): Specify a longer expiration date for **public diffs** (defaults to 1 day). Use iso8601 format to provide a date, or you can use `never` to keep the result live indefinitely.
- `fail_on_breaking` (optional): Mark the action as failed when a breaking change is detected with the diff command. This is only valid with `diff` command.

## Contributing

Bug reports and pull requests are welcome on GitHub at [https://github.com/bump-sh/github-action](https://github.com/bump-sh/github-action). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The scripts and documentation in this project are released under the [MIT License](http://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Bump `github-action` project codebase, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/bump-sh/github-action/blob/master/CODE_OF_CONDUCT).

