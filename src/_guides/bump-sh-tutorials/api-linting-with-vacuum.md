---
title: API Linting with Vacuum
authors: phil
excerpt: 
date: 2024-12-23
---

Whether you're just starting to build an API and want some feedback early on, or you've got an old API you're doing an audit on to see if it's secure, consistent, and up to scratch, how you go about doing this is likely the same: API linting.

The idea of API linting is much like linting your source code or running a spelling/grammar checker on your documentation: let's set some rules, and see if your JSON/YAML are actually following them.

1. Is the YAML/JSON valid.
2. Is the OpenAPI or AsyncAPI valid against their respective specifications.
3. Is the API following industry standards and best practices.
4. Is the API following relevant security practices.
5. If you have your own API Style Guide, is it following that? 

Checking all of this manually once is hard enough, but keeping everything in mind after every single change made by anyone becomes impossible, especially if there are hundreds of developers working on different pieces of the API ecosystem all the time.

If you're following the [API design-first workflow](_guides/api-basics/dev-guide-api-design-first.md) you can save a lot of time and money by using API linting on brand new APIs as they're being created, and make sure they're completely up to scratch before you start.

## Brief History of API Linting

For decades the highest standard of API quality control was writing up an "API Style Guide", which was usually a Wiki, PDF, or Word document, which listed all the things people thought meant an API good. What naming convention to use, what authentication methods were preferred, how to structure data in requests and responses, etc. These documents would become huge. Sometimes they were read by API developers, sometimes not, but even when they were it was impossible to remember everything in there, and sometimes it would change, so people were acting off of old memories of outdated interpretations. 

This was obviously not ideal, so folks set out to automate the process, and over the last decade they succeeded in getting API linting and "Automated API Style Guides" from a concept to a best practice. Tools like [Speccy](https://github.com/wework/speccy) got the ball rolling, [Spectral](https://github.com/stoplightio/spectral/) drastically expanded the functionality people expected from an API linter, and [Vacuum](https://github.com/daveshanley/vacuum) took the Spectral format, creating something even more powerful and considerably more efficient.

## What is Vacuum?

Vacuum is completely free and open-source, built in Go and engineered from the ground up to be performant, avoiding some of the tricky legacy decisions that lead to Spectral not exactly being a race horse. Whilst there are other linters around, Vacuum has the best of both worlds, it's very quick, and it supports Spectral "rulesets", so you can have maximum portability for anything you produce or [want to use](https://github.com/stoplightio/spectral-rulesets).

## Using Vacuum to improve your Bump.sh APIs

Let's set up a workflow where Vacuum can give us feedback on an API in pull requests. The goal is to make sure that any changes being made to the API are valid, correct, and useful, regardless of who the contributor is, or how much experience they have.

### Step 1: Install Vacuum CLI

You can install Vacuum as a command-line tool using Brew, NPM, Curl, or Docker, so there's something for everyone.

This guide will install Vacuum with NPM, and pop it into the [Train Travel API](https://github.com/bump-sh-examples/train-travel-api) so we can see how it all works live. Using NPM will also allow us to run it in GitHub Actions easier later on. Feel free to clone the repository and follow along.

```bash
cd ~/src/train-travel-api

npm install @quobix/vacuum --include=dev
```

If you install Vacuum like this, you can run `npx vacuum --help` to see if it's there and ready to be used. Other methods simply run `vacuum --help`. 

### Step 2: Try Vacuum Out Locally

Let's try running vacuum to see how the API does before we worry about any further integrations.

We'll run it in wherever our OpenAPI is living. If you don't have any OpenAPI available, download or clone the [Train Travel API](https://github.com/bump-sh-examples/train-travel-api) and follow along with that to get the hang of things.

```bash
npx vacuum lint -d openapi.yaml
```

The output can get quite large, as Vacuum comes with a lot of useful rules baked in (so that every user doesn't have to invent them all by themselves every time.)

![](/images/guides/api-linting-with-vacuum/cli-output-warnings.png)

### Step 3: Configure Rules/Rulesets

If there is anything fundamentally broken with the API description then Vacuum will consider that an "Error", but in this instance it looks like the Train Travel API is missing quite a few `examples`. Maybe that's not something I'm too worried about if I'm not using this OpenAPI document for API documentation or [mock servers](./mocking-with-microcks.md), and if that's the case for you you can turn off that rule.

To configure Vacuum, create a `.vacuum.conf.yaml` file in your working directory (ideally the root of a Git repository).

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

### Step 4: Keep Your Perfect Score

Once everything is fixed, wouldn't it be nice to keep it that way? 

Adding a new GitHub Action can help us do this, and we don't need to get things mixed up with existing GitHub Actions you may have for deploying Bump.sh API documentation, updating mock servers, or generating SDKs, it can just be its own new `lint.yml` workflow.

```yaml
# .github/workflows/lint.yml
name: Lint

"on":
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
      contents: read
      packages: read
      # To report GitHub Actions status checks
      statuses: write
      # To display Annotations and Comment on PR
      checks: write
      pull-requests: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Lint API
        run: npx vacuum report --junit openapi.yaml lint-results

      - name: Publish Test Results
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: |
            lint-results-*.xml
```

The main work is happening here in the "Lint API" and "Publish Test Results" stages. 

Instead of using `npx vacuum lint` this workflow uses the `npx vacuum report` command, which is intended to generate a report of whats passing and whats failing. To create the report in a standard that can be understood by tooling, you can create it in JUnit with `--junit`, and then we give it the `lint-results` prefix to distinguish from any other test results being created.

Finally, the workflow reads those results using the [Publish Test Results](https://github.com/marketplace/actions/publish-test-results) GitHub Action, which will display a summary, and even annotate the pull request changes with specific failures on the changes files.
