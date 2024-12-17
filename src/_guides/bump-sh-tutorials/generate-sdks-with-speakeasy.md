---
title: Generate SDKs with Speakeasy
authors: phil
excerpt: Improve the integration experience for your API users with SDKs in every major.
date: 2024-12-17
---

The quicker a customer can integrate with your API, the quicker your business will be making money or solving problems. Some users will be happy to integrate directly with the API, but many prefer the ease of working within the programming language through Software Development Kits (SDKs). These can be a lot of work to build and keep up to date, but if you've got OpenAPI you really don't need to do all that manually. Generate them automatically with Speakeasy, and publish the code samples to your Bump.sh API documentation! 

## What is Speakeasy

Speakeasy is Software-as-a-Service similar to Bump.sh, but instead of focusing on documentation they focus on SDK generation. In the past you'd have to use cumbersome Java-based open-source tooling and generally develop your own templates, but with Speakeasy you can simply upload an OpenAPI description document and get type-safe SDKs that your team will be proud of: include OAuth2.0, retries, pagination, custom code, and more.

## Step 1: Set up Speakeasy

Head over the [Speakeasy Quickstart](https://www.speakeasy.com/docs/create-client-sdks) or if you'd like to go a little slower you can go through the [Speakeasy Introduction](https://www.speakeasy.com/docs/introduction/introduction). The main thing is to start with installing the Speakeasy CLI which you can do with popular package managers like Homebrew and Chocolatey.

## Step 2: Create Your First SDK

Once you've got Speakeasy CLI set up, run the `speakeasy quickstart` command. You'll be prompted to generate a workspace on their [dashboard](https://app.speakeasy.com/) if you haven't already.

The CLI quickstart wizard will walk you through the process of creating the first SDK, by asking you to point to your OpenAPI document and pick the first language. 

For the sake of the tutorial we're going with TypeScript, but you can pick from Python, Go, Java, PHP, C#, Ruby, Swift, and more. 

![](/images/guides/generaate-sdks-speakeasy/quickstart-2.webp)

Generally, you'll have the "central" repository which has your OpenAPI in it, and create a new repository for each SDK you generate. This repository will hold all the code and the relevant configuration to keep it all running, separate from your main OpenAPI and source code.

![](/images/guides/generaate-sdks-speakeasy/new-sdk-repo.png)

For example, if you ran the `speakeasy quickstart` from `/Users/phil/src/train-travel-api`, you might make a new repository for the TypeScript SDK next to that directory in `/Users/phil/src/train-travel-sdk-ts`. 

Enter a path like that into the quickstart, and the local Git repository will be created for you. You can add, commit, and push everything to a new GitHub repository of your choosing. 

```
cd ~/src/train-travel-sdk-ts
git remote add origin git@github.com:bump-sh-examples/train-travel-sdk-ts.git
git add --all
git commit -m "initial commit"
git push origin main
```



## Step 3: Configure GitHub

Once you've got everything inside this lovely new generated codebase pushed to GitHub, you can create GitHub Actions to automatically create pull requests when changes are detected on the OpenAPI, which means you don't have to manually mess around with releasing SDKs as your API and the OpenAPI that describes it evolve over time.

```
$ speakeasy configure github
```

This create a new `.github/workflows/sdk_generation.yaml` which will do a few things. It's main job is to set up a cron job which will open pull requests to generate a new SDK for you once a day if there are changes.  To make it work check the output of that command which outlines a bunch of steps, from creating an `SPEAKEASY_API_KEY` environment variables, and allowing the GitHub Action to open up pull requests. 

One other thing, to make this work on GitHub instead of just working locally, is to update the "target" in the Speakeasy SDK workflow document: `.speakeasy/workflow.yaml`. 

By default it was set to the following:

```yaml
sources:
  Train Travel API:
    inputs:
      - location: ../train-travel-api/openapi.yaml
```

This was causing some confusion for the Speakeasy GitHub action because it was literally looking for that local path when the GitHub Action was being run, and that's the folder structure on the local machine which isn't there. To make this work on GitHub you can grab the public "raw" URL:

```yaml
sources:
  Train Travel API:
    inputs:
      - location: https://raw.githubusercontent.com/bump-sh-examples/train-travel-api/refs/heads/main/openapi.yaml
```

Public URLs like this will only work for public GitHub repos, but if you cannot make the repo public you can pop this onto S3 or somewhere else.

**Please do all of these steps or things will not work.**

Commit and push all of these changes to main, and the repository is in good shape. 

## Step 4: Publish Code to Package Managers

Once GitHub is automatically creating pull requests to update the codebase in your repository, you might want to do something with that code, like publish that code as a package to package managers like NPM, PyPI, Packagist, NuGet, and Maven.

For the sake of the tutorial, we're publishing to NPM. The easiest way is to follow the standard process of creating a NPM package, by doing it manually at first, then letting Speakeasy take over after.

```
npm login
npm publish
```

If this all worked then count to 100 and you should see your new package! 

![](/images/guides/generaate-sdks-speakeasy/publish-to-npm.png)

Now our `train-travel-sdk` actually exists online, and you can [see how it's going from here](https://www.npmjs.com/package/train-travel-sdk).

To save somebody having to run a command to publish this SDK (and every other SDK you end up making) every time anything changes, we can ask GitHub and Speakeasy to handle all of that for us.

```
$ speakeasy configure publishing
```

This will create another github workflow which will help publish the package automatically, and should look a bit like this:

```yaml
name: Publish
permissions:
  checks: write
  contents: write
  pull-requests: write
  statuses: write
  id-token: write
"on":
  push:
    branches:
      - main
    paths:
      - .speakeasy/gen.lock
  workflow_dispatch: {}
jobs:
  publish:
    uses: speakeasy-api/sdk-generation-action/.github/workflows/sdk-publish.yaml@v15
    with:
      target: train-travel-sdk
    secrets:
      github_access_token: ${{ secrets.GITHUB_TOKEN }}
      npm_token: ${{ secrets.NPM_TOKEN }}
      speakeasy_api_key: ${{ secrets.SPEAKEASY_API_KEY }}

```

Notice it is still using the SPEAKEASY_API_KEY that we used in the generate workflow, but now there's a `NPM_TOKEN` we'll need to add. Grab that from your NPM account under Access Tokens, make sure it has write permission for packages, and save it as `NPM_TOKEN` in your repo GitHub repository Actions secrets.

Now if you push to main or merge a PR it will automatically publish to npm, and if its an automated change it will bump the version number for you so you don't have to! 

![](/images/guides/generaate-sdks-speakeasy/npm-new-version.png)

From here, if you change anything relevant in the SDK repo, it'll publish a new SDK, and if the central OpenAPI changes it will also publish a new SDK. Everything is entirely automated now, so let's leave the SDK to itself, and figure out how to tell everyone about how amazing it is.

## Step 5: Integrating Code Samples into Bump.sh API Docs

In the past people would either have completely seperate "API Docs" and "SDK Docs", or they would spend countless hours copying and pasting SDK examples into the API Docs. 

No more! 

You can grab the latest SDK code samples right from Speakeasy, and merge them into your Bump.sh API documentation using [OpenAPI Overlays](https://docs.bump.sh/guides/technical-writing/efficient-tech-writing-process/) which Speakeasy create for you.

If you don't know what Overlays are, that's ok, you don't really need to. Simply, they are a list of changes that should be applied to an OpenAPI document, and Speakeasy has done the hard work of making them already, so all you need to do is grab a URL. To do this, head to the API registry and look for something like "train-travel-api-typescript-code-samples". 

![](/images/guides/generaate-sdks-speakeasy/api-registries.png)

Check the private/public toggle on, and copy the URL. Paste it into your browser to see how it looks, and you should see something like this:

![](/images/guides/generaate-sdks-speakeasy/overlays.png)

This overlay document will show you exactly what it's trying to do. It has a series of `actions`, which look for a specific `target` within the OpenAPI, and update the `x-codeSamples` with a perfect example of the SDK in action.

```
overlay: 1.0.0
info:
  title: CodeSamples overlay for typescript target
  version: 0.0.0
actions:
  - target: $["paths"]["/bookings"]["get"]
    update:
      x-codeSamples:
        - lang: typescript
          label: bookings
          source: |-
            import { TrainTravelSDK } from "train-travel-sdk";

            const trainTravelSDK = new TrainTravelSDK({
              oAuth2: process.env["TRAINTRAVELSDK_O_AUTH2"] ?? "",
            });

            async function run() {
              const result = await trainTravelSDK.bookings.list({
                page: 1,
                limit: 10,
              });

              // Handle the result
              console.log(result);
            }

            run();
```

Now, how do you normally deploy your OpenAPI documents to Bump.sh? 
