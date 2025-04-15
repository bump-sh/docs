---
title: API Design Reviews Don’t Have to be Hard
authors: phil
excerpt: 
date: 2025-03-06
---

An API Design Review is one of a few parts of a larger API Governance program, where various people review changes to an API to make sure its a good choice for the architecture and wider ecosystem. This often involves a wide variety of persona, including API designers, API developers, technical writers, system architects, and maybe even a dedicated [governance team](_guides/openapi/leveraging-the-openapi-specification-for-api-governance.md).

Design reviews are generally done for an API overall when its first form is created, then with following iterations as new endpoints and other changes are made. Beyond the basic tire-kicking, a design review is important to ensure the API is well-designed, compliant with standards and style guides, meets the needs of its consumers, and does not introduce problems to the wider ecosystem.

- **Consistency and Standards Compliance** - Ensure the API follows established design standards and conventions, covering naming conventions, Hypermedia formats, authentication strategies, etc.

- **Clarity** - Verify that the API endpoints, parameters, and responses are clearly documented. Ensure descriptions are meaningful and useful for developers of both the API and its consumers.

- **Functionality and Usability** - Make sure the API endpoints provide the necessary functionality, evaluating the ease of use for developers integrating with the API.

- **Performance and Scalability** - Evaluate the API design for potential performance bottlenecks. Are consumers going to need to load 1,000 endpoints to solve the main use-case, or is data being computed on load which might slow things down? 

- **Backward Compatibility** - Identify any breaking changes that could affect existing consumers of the API. Ensure that changes are backward compatible or properly versioned.

- **Forwards Compatibility** - Is this change going to work properly and fit in with future changes that are either planned to happen, or likely to happen within the wider ecosystem, to avoid conflicts or duplication.

- **Security and Privacy** - Check that authentication and authorization mechanisms are present and appropriate for the task at hand, and personal/private information is not being leaked by URL fiddling.

- **Error Handling and Responses** - Ensure that error responses are sensible, following the right standards, and are both meaningful and insightful for developers and potentially any end-users who end up seeing the error messages directly.

- **Impact on Documentation** - Determine how changes will affect existing documentation (reference docs, guiders, tutorials, etc). Ensure that documentation is updated to reflect any changes in the API before the change is made to avoid anything getting out of sync. 

It seems like a whole lot to think about but that is why design reviews pull in
multiple people from various departments or walks of life. Getting all these
aspects nailed down during a design review means you can make sure the API is
useful, well-documented, consistent and standards compliant, hopefully not
riddled with security holes, and generally reduce the chances of problematic API
changes getting into production.

## Where do design reviews happen?

There are countless ways people try to handle this. One of the most complicated
came from a famous API thought leader who suggested folks email Word documents
full of feedback around with spreadsheets to track them... 

A far more common approach is to put the review process through the same Pull
Request workflow that developers are already using to review code changes on
GitHub, GitLab, Azure Devops, etc.

To know the best way forward it's helpful to know the history of the pull
request because it hasn't been around all that long. For decades developers
would email around a diff file (short for difference) called `new-function.diff`
and people would chat about that technical change on their IRC channels or
around the water cooler. 

It was a massive faff and multiple diffs could conflict, so when Git gained
popularity and added the
[git-request-pull](https://git-scm.com/docs/git-request-pull) command, that
eventually ended up in GitHub as a Pull Request and the whole code review
process matured.

As the pull request matured it became the home for everything, allowing everyone
can see a summary of changes, view source code if they want, see previews,
comment on specific lines, suggest changes, and people could checkout the
changes if they felt like playing around. All of these abilities gave far more
people the option to interact with changes in their own preferred way, to see
what is changing, and if it matters to them.

This is exactly how code changes should be managed, but API design reviews are
not code reviews. The design review is more interested in the interface being
built by the API than the source code on the inside, and forcing people to read
code to work out what that might mean in terms of HTTP and JSON is not helpful.

Only the developers should be worrying about the code, the system architects,
governance teams, and technical writers want to have a higher level view instead
of having to learn every single teams' favourite web application frameworks
conventions and syntax.

This is where API descriptions like OpenAPI and AsyncAPI come in. When stored
together with the source code (and used for this like contract testing to ensure
the code and description match perfectly) it means these discussions can be had
around the YAML/JSON that describes the API instead of getting everyone pouring
over the source code.

A huge step in the right direction, but reviewing hundreds of lines of YAML
changes is not easy or fun. Some tooling has appeared trying to move the whole
API design review process into a rough approximation of Git that's all trapped
in their walled garden and requires constant syncing, but Bump.sh instead
focuses on allowing design reviews happen in the pull request.

## Diffs Aren't Design Reviews

Technical writers often report difficulty staring directly into a pull request
that's making loads of changes to massive OpenAPI documents. 

A single pull request might involve anything from reordering some parameters,
complete reorganization of the file structure of infinite `$ref`'ed YAML, to a
breaking change that could the vast majority of integrations API consumers. It
can all be lost in a sea of red and green changes in the "diff" view. 

Technical writers shouldn’t need to learn YAML and stare into the void like
this, nor should they need to use complex CLI tools or anything else just to see
what has changed in an API. Nobody should need to do that.

Bump.sh helps simplify this process by analyzing OpenAPI documents and
identifying meaningful changes so tech writers can focus on relevant updates
without getting lost in unnecessary details.

## Why Not All Changes Matter

Some changes in OpenAPI documents have no impact on API consumers, such as:

- [Splitting larger documents](_guides/openapi/specification/v3.1/advanced/splitting-documents-with-ref.md) into smaller pieces with `$ref`.
- Renaming referenced files.
- Renaming component names (e.g. renaming `components.schemas.Something` which
  does not change the actual API)
- Reformatting YAML for consistency because some documents were an awkward
  mixture of 2 spaces and 4 spaces. 🤢

These modifications might make the OpenAPI documents cleaner, but do not alter
the API’s behavior. The huge wall of changes would look like loads of change is
happening, and maybe some changes have been sprinkled into what was otherwise
just a formatting change. 

Here's a change which looks like it's probably not going to break anything, it's
just moving an inline definition of a parameter into a reference, and adding a
new optional parameter.

![](/images/guides/design-reviews/replaced-with-ref.png)

Unfortunately when copying and pasting some of the reusable parameter
definitions elsewhere something was changed, and that would be hard to spot
without having both definitions open on two different monitors and comparing the
two closely. Thankfully Bump.sh can handle that tedious work for you.

![](/images/guides/design-reviews/breaking-change-detected.png)

Bump.sh automatically filters out inconsequential YAML/JSON changes and automates all of the following:

- **See only relevant changes** – Filtering out noise from YAML/JSON
  restructuring and internal updates.
- **Get automatic pull request comments** – Highlighting meaningful updates
  directly in pull requests.
- **Be alerted to breaking changes** – Clearly identifying changes that impact
  API consumers.
- **Track API history over time** – Keep a clear record of modifications without
  manually digging into commits.

## Handling API Design Reviews

Ok so we've got the theory down, how do you actually do this?

### 1. Get Bump.sh into Pull Requests

First of all lets get Bump.sh running on pull requests. Bump.sh users working
with GitHub may already have a `.github/workflows/bump.yml` workflow, but if not
add one. Other [continuous integration](_help/continuous-integration/index.md)
providers are supported but we'll stick to [GitHub
Actions](_help/continuous-integration/github-actions.md) for this guide.


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
  deploy-doc: #optional
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: openapi.yaml

  api-diff:
    if: ${{ github.event_name == 'pull_request' }}
    name: Check API diff on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Comment pull request with API diff
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: openapi.yaml
          command: diff
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

The `deploy-docs` job is doing what it suggests, deploying API documentation
when merged to `main`. That's the standard workflow and can be removed if you
don't need that right now. 

The important part here is the `api-diff` job. Once you've updated
`<BUMP_DOC_ID>` to the ID found in the Bump.sh API settings page, popped in the
`token` hopefully via the Secrets interface on GitHub, and pointed the `file:
openapi.yaml` to where the OpenAPI or AsyncAPI document lives, Bump.sh will
start adding summaries of changes to pull requests as comments.

### 2. Reviewing Changes

Whenever a pull request is made, or changes are pushed to that pull request,
Bump.sh will automatically scan the changes being made to the OpenAPI/AsyncAPI
documents. Any consequential changes will be highlighted in the summary of
changes.

- New endpoints or properties.
- New query string parameters added.

Breaking changes will be flagged so they're hard to miss.

- Removing or renaming API endpoints.
- Making an optional property required.
- Altering response structures.

Raising breaking change warnings like this can help system architects and other
reviewers decide on a level of panic. It could well be that property has been
deprecated for a long time and everyone knows no consumers are actually using it
any more, so Panic Level 0, carry on.

If the summary flags up something that's not immediately clear, adds a new
endpoint that needs more review, etc. then the Preview feature can be used.

### 3. Preview changes

When Bump.sh comments on a pull request with the summary of changes, there is
also a little link on there marked Preview and this is pretty magical. 

![](/images/guides/design-reviews/preview.png)

Instead of just reviewing the YAML changes and hoping the docs look good when
you merge, you can go and review the docs to make sure all is good before you
merge. 

Technical writers can use this to make sure descriptions are good enough, or if
developers won't do it tech writers can make sure their [overlays are improving
descriptions](_guides/openapi/augmenting-generated-openapi.md) correctly.

System architects can make sure that new endpoints look solid, with appropriate
data being accepted and returned to solve the needs for clients.

Everyone can all review the parts of the changes they are interested in, and
comment back with concerns, or use GitHub Suggestions to make improvements.

### 4. Approve Changes

If everything is fine then reviewers can hit Approve on the pull request. When
API code and API descriptions are in the same repository can be a little
confusing as it feels like a technical writer is approving a code change, but
this can be solved with [Code Owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) 
in GitHub.

By assigning the API descriptions to the appropriate review teams, and the code
is assigned to the code, you can make sure both relevant groups have approved
the changes to stop problems squeaking by.

Create a new file called `CODEOWNERS` in `.github/` or the root of the
repository, and use the following syntax.

```yaml
# CODEOWNERS

docs/* @org/review-team

src/* @org/dev-team
```

This says that changes made to `docs/openapi.yaml` or any of the other
referenced bits of description should be approved by the review team, and any
code changes will need to be made by the dev team. You can then go into branch
settings and make sure that pull reviews are approved by code owners before
progressing.

You can get as creative as you like with this, and have all stakeholders
involved so there system architects and the governance teams all get their say
before things progress. 

Make sure its possible to bypass this in emergencies, like pushing a hotfix, but
generally speaking this should help to make sure things always get better and
things don't sneak through.

### 5. Linting to reduce repetition

These reviews can end up with a fair amount of repetition, with folks arguing
over things like which naming conventions to use or whether there should be full
stops at the end of descriptions or not. Everything is far more efficient when
rules are written down, and that tedious stuff can be automated away with [API
linting](_guides/bump-sh-tutorials/api-linting-with-vacuum.md) using tools like
vacuum so that its already handled before even getting humans involved with the
design review.

![Screenshot from GitHub.com, showing the "GitHub Actions / API Lint Results" check result outputting annotations.](/images/guides/api-linting-with-vacuum/vacuum-annotations.png)

With Bump.sh spotting changes and offering previews, vacuum highlighting
concerns automatically, API design reviews should be a pretty simple affair. 

API design reviews don’t have to be a struggle for tech writers. With Bump.sh,
you can automate the process of detecting relevant changes, stay on top of
breaking updates, and manage API documentation efficiently. All of this can be
done without needing to deep dive into YAML or complex IDEs. 

Let machines do the heavy lifting so you can focus on delivering great
documentation, and steer the evolution of your APIs to make them useful and
profitable.
