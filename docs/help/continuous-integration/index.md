# Continuous integration

How to integrate your documentation deployment to your CI.

## Integrate with your CI

Here, we are presenting the process recommended to our customers, but feel free to adapt it to your own workflow/requirements.

We recommend two steps in your automation flow: a **validation** one during development, followed by a **deployment** one on production merges.

## 1. API diff & validation of the documentation file

### API diff for each proposed change request

With our [Github Action](github-actions.md), you can receive automatic API diff comments directly on your pull requests. This is done thanks to the `bump diff` command under the hood which will run each time a pull request is created or updated. It will make sure to fail the build if the documentation file is not valid.

### Plain validation

If you don't use Github, for each branch of your code base you can check that your documentation file is still valid and will not fail during deployment. By using the `bump deploy --dry-run`  command each time a branch is pushed you will make sure to fail the build if the documentation file is not valid. You can also use the `bump diff` command to validate your documentation file and to output the API diff in your CI logs.

## 2. Deploy your doc

Once your branch has been merged into your main branch (generally the `master` or `main` one) you will want to deploy your new documentation file and make it live. You will use the `bump deploy` command.

## Add our CLI tool to your project

The simplest way to use our CLI tool is to add a `package.json` file to your project. You can find an example here: [https://github.com/bump-sh/bump-ci-example/blob/master/package.json](https://github.com/bump-sh/bump-ci-example/blob/master/package.json).

If you prefer not using a `package.json`, be sure to install the CLI globally with `npm install -g bump-cli` before calling the `bump`  command.

## Examples

Here are examples for integrating Bump with the most commonly used CI products:

- CircleCI : [https://github.com/bump-sh/bump-ci-example/blob/master/.circleci/config.yml](https://github.com/bump-sh/bump-ci-example/blob/master/.circleci/config.yml)
- Gitlab CI: [https://github.com/bump-sh/bump-ci-example/blob/master/.gitlab-ci.yml ](https://github.com/bump-sh/bump-ci-example/blob/master/.gitlab-ci.yml )
- Travis CI: [ https://github.com/bump-sh/bump-ci-example/blob/master/.travis.yml]( https://github.com/bump-sh/bump-ci-example/blob/master/.travis.yml)
- GitHub Action: [https://github.com/bump-sh/github-action](https://github.com/bump-sh/github-action)

The GitHub action example uses a dedicated action we crafted especially for you. You may find more information on our [GitHub market place](https://github.com/marketplace/actions/api-documentation-on-bump) page.

Note that if you don't want to keep the private token and id in your code base, you should use environment variables. Our CLI automatically recognizes these 3 variables:

- `BUMP_ID`: your documentation public slug or id
- `BUMP_TOKEN`: your documentation private token
- `BUMP_HUB_ID`: if [using hubs](https://help.bump.sh/hubs), your hub public slug or id



