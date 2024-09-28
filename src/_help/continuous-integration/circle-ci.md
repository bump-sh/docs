---
title: Circle CI
---

- TOC
{:toc}

## Bump.sh continuous integration examples

Bump.sh offers a lot of flexibility to let you configure how it should interact with your CI pipelines.

All our generic build processes are stored in a dedicated [public repository called `bump-ci-example`](https://github.com/bump-sh/bump-ci-example/blob/master/.gitlab-ci.yml). Those processes are defined thanks to dedicated configuration files and scripts which uses the [Bump.sh CLI](/help/continuous-integration/cli/) under the hood.

For more advanced needs, consider using [our API](/help/continuous-integration/api/).

## Generate your API documentation with Circle CI

The CircleCI example we provide helps to **validate** your definition file on pull requests, and then **deploy** a definition file change merged in your `main` branch.

Copy-paste the following directory in your own project to see the builds running:
- [`.circleci/` directory](https://github.com/bump-sh/bump-ci-example/blob/master/.circleci/config.yml)

> If you encounter an issue or have suggestions on those examples, please do [file a ticket on the dedicated repo](https://github.com/bump-sh/bump-ci-example/issues) we would love to hear your feedback.
{: .info}