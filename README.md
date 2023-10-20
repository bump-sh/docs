# Bridgetown Website README

Welcome to your new Bridgetown website! You can update this README file to provide additional context and setup information for yourself or other contributors.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Development](#development)
- [Commands](#commands)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Prerequisites

- [GCC](https://gcc.gnu.org/install/)
- [Make](https://www.gnu.org/software/make/)
- [Ruby](https://www.ruby-lang.org/en/downloads/)
  - `>= 2.7`
- [Bridgetown Gem](https://rubygems.org/gems/bridgetown)
  - `gem install bridgetown -N`
- [Node](https://nodejs.org)
  - `>= 12`
- [Yarn](https://yarnpkg.com)

## Install

```sh
cd bridgetown-site-folder
bundle install && yarn install
```
> Learn more: [Bridgetown Getting Started Documentation](https://www.bridgetownrb.com/docs/).

## Development

To start your site in development mode, run `bin/bridgetown start` and navigate to [localhost:4000](https://localhost:4000/)!

Use a [theme](https://github.com/topics/bridgetown-theme) or add some [plugins](https://www.bridgetownrb.com/plugins/) to get started quickly.

### Commands

```sh
# running locally
bin/bridgetown start

# build & deploy to production
bin/bridgetown deploy

# load the site up within a Ruby console (IRB)
bin/bridgetown console
```

> Learn more: [Bridgetown CLI Documentation](https://www.bridgetownrb.com/docs/command-line-usage)

## Deployment

You can deploy Bridgetown sites on hosts like Render or Vercel as well as traditional web servers by simply building and copying the output folder to your HTML root.

> Read the [Bridgetown Deployment Documentation](https://www.bridgetownrb.com/docs/deployment) for more information.

## Contributing

Hi and thanks for helping us providing a better understanding of Bump.sh and the API ecosystem!

### Creating a pull request

1. Fork it
2. Clone the fork using `git clone` to your local development machine.
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new Pull Request

### Guides

We'd be thrilled to have you submitting community guides!

#### Folder structure

Guides are located in [`src/_guides`](https://github.com/bump-sh/docs/tree/main/src/_guides).

Under this folder you should find a few folders that act as categories.
These categories are fixed as they are the ones we want to show on our guide index.

If however you think your submission doesn't fit in any of the provided categories, you can create a new folder to put it in.

This folder will require a `_default.yml` file at its root where you'll add the new category name. `categories: [Tips and tricks]`
The folder name should be the slugified name of your category: `Tips and tricks -> tips-and-tricks`.

However, guides can freely be added into subfolders and their url would follow the folder path.
For example, `src/_guides/bump-sh-tutorials/cli/mastering-bump-command-line.md` will show under `https://docs.bump.sh/guides/bump-sh-tutorials/cli/mastering-bump-command-line`.

#### Writing the guide

Guides should have a frontmatter containing at least a title, a list of authors and an excerpt.
```
title: Donde esta la biblioteca
authors: [Troy Barnes, Abed Nadir]
excerpt: Discoteca, muñeca, la biblioteca. Es en bigote grande, perro, manteca.
```

The key `authors` will first lookup to a list of known authors defined in [`src/_data/authors.yml`](https://github.com/bump-sh/docs/blob/main/src/_data/authors.yml).
If you wish to share more information about you, you can add a key of your choice in this file in this form, especially if you intend to submit many posts:
```
your_preferred_name_key:
  name: <your_name>
  title: A kind soul that loves sharing knowledge to the world
  url: <url_to_your_github_profile>
  image_url: <url_to_your_avatar>
  email: <your_email_address>
```
If this is a one-time submission and you don't want to bother, you can just add your full name (or nickname, anything works).

The excerpt is a small description of the guide content that will show on the guide list so users can have a glimpse of what the guide is about. Be clear and concise!

Images go under [`src/images`](https://github.com/bump-sh/docs/tree/main/src/images) and can be called with `![](/images/guides/<your_image_name>)`.

Then you can let your ~~pen~~ keyboard handle the content!
