---
title: API Linting with vacuum
authors: phil
canonical_url: https://bump.sh/blog/api-linting-with-vacuum
excerpt: Validate API descriptions against rules and policies before releasing new versions in Bump.sh.
date: 2025-01-30
---

Whether just starting to build an API and looking for feedback, or improving auditing an old API to see if it's secure, consistent, and up to scratch, the approach is likely the same: API linting.

The idea of API linting is much like linting source code or running a spelling/grammar checker on documentation: let's set some rules, and see if the JSON/YAML is actually following them.

1. Is the YAML/JSON valid.
2. Is the OpenAPI or AsyncAPI valid against their respective specifications.
3. Is the API following industry standards and best practices.
4. Is the API following relevant security practices.
5. If an organization has an API Style Guide, is it following that? 

Checking all of this manually once is hard enough, but keeping everything in mind after every single change made by anyone becomes impossible, especially if there are hundreds of developers working on different pieces of the API ecosystem all the time.

Following the [API design-first workflow](_guides/api-basics/dev-guide-api-design-first.md) can save a lot of time and money by using API linting on brand new APIs as they're being created, and make sure they're completely up to scratch before coding begins.

## Brief history of API linting

For decades the highest standard of API quality control was writing up an "API Style Guide", which was usually a Wiki, PDF, or Word document, which listed all the things people thought meant an API good. What naming convention to use, what authentication methods were preferred, how to structure data in requests and responses, etc. These documents would become huge. Sometimes they were read by API developers, sometimes not, but even when they were it was impossible to remember everything in there, and sometimes it would change, so people were acting off of old memories of outdated interpretations. 

This was obviously not ideal, so folks set out to automate the process, and over the last decade they succeeded in getting API linting and "Automated API Style Guides" from a concept to a best practice. Tools like [Speccy](https://github.com/wework/speccy) got the ball rolling, [Spectral](https://github.com/stoplightio/spectral/) drastically expanded the functionality people expected from an API linter, and [vacuum](https://github.com/daveshanley/vacuum) took the Spectral format, creating something even more powerful and considerably more efficient.

## What is vacuum?

vacuum is completely free and open-source, built in Go and engineered from the ground up to be performant, avoiding some of the tricky legacy decisions that lead to Spectral not exactly being a race horse. Whilst there are other linters around, vacuum has the best of both worlds, it's very quick, and it supports Spectral "rulesets", so giving the best portability for rulesets being created or [reused from elsewhere](https://github.com/stoplightio/spectral-rulesets).

## Using vacuum to improve Bump.sh API documentation

Let's set up a workflow where vacuum can give us feedback on an API in pull requests. The goal is to make sure that any changes being made to the API are valid, correct, and useful, regardless of who the contributor is, or how much experience they have.

### Step 1: Install vacuum CLI

You can install vacuum as a command-line tool using Brew, NPM, Curl, or Docker, so there's something for everyone.

This guide will install vacuum with NPM, and pop it into the [Train Travel API](https://github.com/bump-sh-examples/train-travel-api) so we can see how it all works live. Using NPM will also allow us to run it in GitHub Actions easier later on. Feel free to clone the repository and follow along.

```bash
cd ~/src/train-travel-api

npm install @quobix/vacuum --include=dev
```

When installing vacuum like this, run `npx vacuum --help` confirm it's installed correctly. For other methods run `vacuum --help`. 

### Step 2: Running vacuum locally

Let's try running vacuum to see how the API does before we worry about any further integrations.

Run vacuum on any OpenAPI available, or download the [Train Travel API](https://github.com/bump-sh-examples/train-travel-api) to use that OpenAPI.

```bash
npx vacuum lint -d openapi.yaml
```

The output can get quite large, as vacuum comes with a lot of useful rules baked in (so that every user doesn't have to invent them all by themselves every time.)

![](/images/guides/api-linting-with-vacuum/cli-output-warnings.png)

### Step 3: Configure rules/rulesets

If there is anything fundamentally broken with the API description then vacuum will consider that an "Error", but in this instance it looks like the Train Travel API is missing quite a few `examples`. Maybe that's not something I'm too worried about if I'm not using this OpenAPI document for API documentation or [mock servers](_guides/bump-sh-tutorials/mocking-with-microcks.md), and if that's the case for you you can turn off that rule.

To configure vacuum, create a `.vacuum.conf.yaml` file in your working directory (ideally the root of a Git repository).

```yaml
# .vacuum.conf.yaml
ruleset: ./.vacuum/ruleset.yaml
```

Now let's go make that `./.vacuum` directory file and pop a new file in it.

```yaml
# .vacuum/ruleset.yaml
extends: 
  - spectral:oas

rules:
  oas3-missing-example: off
```

By default we're using the Spectral "OAS" (OpenAPI Specification) ruleset, which is where all these rules are defined. Creating this config file and new ruleset is overriding the default functionality, but doing something very similar. We're extending the ruleset so we have all the rules, then turning off only the `oas3-missing-example` rule. 

Running the lint command again should be a little cleaner.

![](/images/guides/api-linting-with-vacuum/cli-output-fewer-problems.png)

If you spot an error in here you would like to fix, you can use the `Location` to find out exactly where it is. `openapi.yaml:1049:5` means it's in `openapi.yaml` on line `1049` and it's taken a stab at guessing which character of the problem, which in this case is 4 spaces of indent plus where is the thing in the 5th character... no worries, close enough.

![](/images/guides/api-linting-with-vacuum/go-to-line.png)

The problem here was a lack of a description, so pop something in like `description: The link to the booking resource.` and run it again to see if that fixed the error. 

Once everything is fixed or ignored, you should get a perfect run.

![](/images/guides/api-linting-with-vacuum/perfect-score.png)

### Step 4: Keep that perfect score

Once everything is fixed, wouldn't it be nice to keep it that way? 

Adding a new GitHub Action can help us do this, and we don't need to get things mixed up with existing GitHub Actions you may have for deploying Bump.sh API documentation, updating mock servers, or generating SDKs, it can just be its own new `lint.yml` workflow.

```yaml
# .github/workflows/lint.yml
name: Lint

on:
  pull_request: {}
  push:
    branches: [main]
    paths-ignore:
      - 'README.md'
      - 'src/**'

jobs:
  build:
    name: API Linting
    runs-on: ubuntu-latest

    permissions:
      statuses: write
      checks: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Lint API
        run: npm exec vacuum report -- --junit openapi.yaml lint-results

      - name: Publish Lint Results
        if: success() || failure()
        uses: mikepenz/action-junit-report@v5
        with:
          check_name: API Lint Results
          report_paths: lint-results-*.xml
```

The main work is happening here in the "Lint API" and "Publish Lint Results" stages. 

Instead of using `npx vacuum lint` this workflow uses the `npx vacuum report` command, which is intended to generate a report of whats passing and whats failing. To create the report in a standard that can be understood by tooling, you can create it in JUnit with `--junit`, and then we give it the `lint-results` prefix to distinguish from any other test suite results that may be created.

Finally, the "Publish Lint Results" step reads those results using the [JUnit Report GitHub Action](https://github.com/marketplace/actions/junit-report-action). As pull requests are made to the API, warnings and errors will start showing up, giving people the chance to fix the mistakes. These can be set up as "Checks" to block a pull request if there are errors, annotations to show other problems including warnings, or both, depending on various permissions configurations.

![Screenshot from GitHub.com, showing the "GitHub Actions / API Lint Results" check result outputting annotations.](/images/guides/api-linting-with-vacuum/vacuum-annotations.png)

Blocking the build on OpenAPI errors stops contributors from accidentally breaking the OpenAPI document, which will cause all sorts of problems, not least the lack of updates for Bump.sh API Documentation!

See how to [configure the JUnit report action](https://github.com/marketplace/actions/junit-report-action#inputs) to suit any setup.

## Summary

Teams are more efficient when rules are written down. Vacuum speeds up API design reviews, acts as one very small but helpful step towards an API governance program, and can make sure errors are not being introduced to your Bump.sh API documentation, or even the API itself, and when leveraging rulesets like the [OWASP ruleset](https://quobix.com/vacuum/rules/owasp/) it can even help avoid costly security mistakes.

Setup [vacuum](https://quobix.com/vacuum/) for your Bump.sh API today, and see what score it gets.
