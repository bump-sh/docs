---
title: Introducing our GitHub action
tags: [New feature]
---

Deploying your API documentation has never been so simple if you are using GitHub. We have just released [our GitHub action](https://github.com/marketplace/actions/api-documentation-on-bump), which lets you super easily control when and how you want to deploy your doc.

All you have to do is configuring your workflow:

```
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - name: Deploy API documentation
    uses: bump-sh/github-action@0.1
    with:
      id: <BUMP_DOC_ID>
      token: <BUMP_DOC_TOKEN>
      file: doc/api-documentation.yml
```

You can see it in action on our [workflow examples](https://github.com/bump-sh/bump-ci-example/tree/master/.github/workflows) 😎
