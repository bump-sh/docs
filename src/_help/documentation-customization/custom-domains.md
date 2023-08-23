---
title: Custom domains
---

- TOC
{:toc}

Your docs are hosted on Bump.sh. However you can set a custom domain: visitors of your docs will stay within your brand experience. For this, you'll use a CNAME.

A CNAME, or Canonical Name, is a Domain Name System (DNS) entry. It serves as an alias, and maps a domain name to another. In our use case, it lets you set a domain name for your users to access your API docs, that they will use and see instead of the Bump.sh domain name.

## Setting a CNAME record

First, you'll need to create a CNAME record pointing to `custom.bump.sh`, at your domain name provider.

For instance, if you want to host your documentation under the `developers.example.com` domain, you will create the following record:

```shell
developers.example.com. 3600 IN CNAME custom.bump.sh.
```

Once this is done, you can set your custom domain in Bump.sh.

## Setting a custom domain in Bump.sh

1. Click on the chosen **Documentation** **>** **Settings**
2. Check the **Setup a custom domain** box.
3. Enter your custom domain.
4. Click **Update global settings**.

That's it. SSL certificates are automatically issued. 

Note: DNS caches may take a moment to update. Outdated caches may lead to the fact that visitors will not be able to access your docs via your custom domain. Those caches are user-side, which means that 1. you can flush it on your local computer 2. people who never visited your doc will not face any issue.
