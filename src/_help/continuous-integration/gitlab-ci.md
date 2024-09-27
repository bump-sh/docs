---
title: Gitlab CI
---

- TOC
{:toc}

## Bump.sh CI integration examples

Bump.sh offers a lot of flexibility to let you configure how it should interact with your CI pipelines.

All our generic build processes are stored in a dedicated [public repository called `bump-ci-example`](https://github.com/bump-sh/bump-ci-example/blob/master/.gitlab-ci.yml). Those processes are defined thanks to dedicated configuration files and scripts which uses the [Bump.sh CLI](/help/continuous-integration/cli/) under the hood.

For more advanced needs, consider using [our API](/help/continuous-integration/api/).

## Generate your API documentation & changelog with Gitlab CI

The provided example has is a two stage delivery process:
- The `test` stage will run an API definition **diff** on all your branches except the `main` one, to compare the changed document file with your Bump.sh documentation. It will also comment with the diff content on the related Merge Request on Gitlab if it exists.
- The `deploy` stage will run only on your `main` branch, once your API definition was merged to your `main` branch it will automatically be **deployed** to your Bump.sh documentation.

Copy-paste the following files in your own project to see start your first Bump related pipeline:
- the [`.gitlab-ci.yml` pipeline file](https://github.com/bump-sh/bump-ci-example/blob/master/.gitlab-ci.yml)
- the whole [`.gitlab/` directory](https://github.com/bump-sh/bump-ci-example/tree/master/.gitlab).

> If you encounter an issue or have suggestions on those examples, please do [file a ticket on the dedicated repo](https://github.com/bump-sh/bump-ci-example/issues) we would love to hear your feedback.
{: .info}