---
title: Bump diff from your Command Line Interface or your Continuous Integration platform
tags: [New]
---

Our [new bump `diff` command](https://www.npmjs.com/package/bump-cli#bump-diff-file) has landed in our CLI. <br/>
_Make sure to [upgrade your `bump-cli` package](https://github.com/bump-sh/cli/releases/tag/v2.1.0) to at least `v2.1.0` to test it._

Now, straight from your CLI, you are able to describe the changes made in your contract:

```sh
> bump diff --doc users-account api-specification.yaml
Updated: GET /account
  Response modified: 200
    Body attribute added: ticket_ids
Added: GET /tickets/{ticket_id}
```

The new command will output a quick summary of what has changed between your latest deployed API contract and the file you have changed locally.

If you use Github Actions to launch your automation workflows, we have some more good news for you: [we now offer a stable `bump-sh/github-action@v1` action](https://github.com/bump-sh/github-action/releases/tag/v1.0.0). And this latest release includes **automatic API contract changelog pushed as a comment for each pull request**.

Check [our help page](/help/continuous-integration/github-actions/#diff-on-pull-requests-only) to get you started with team collaboration on API design.
