---
title: Custom domains
---

- TOC
{:toc}

Your API documentation is hosted on Bump.sh under our URL. To extend your brand experience to your visitors and API consumers, you can use a custom domain that replaces our URL. This change is based on a CNAME record.

A CNAME, or Canonical Name, is a Domain Name System (DNS) entry. It serves as an alias, and maps a domain name to another. In our use case, it lets you set a domain name for your users to access your API docs, that they will use and see instead of the Bump.sh domain name.

## Setting a CNAME record

First, you'll need to create a CNAME record pointing to `custom.bump.sh`, at your domain name provider.

For instance, if you want to host your documentation under the `developers.example.com` domain, you will create the following record:

```undefined
developers.example.com. 3600 IN CNAME custom.bump.sh.
```

> The configuration of the CNAME record can vary from one hosting provider to another. Feel free to contact your hosting provider if you have any questions at this stage.
{: .info}

Once this is done, you can set your custom domain in Bump.sh.

## Setting a custom domain in Bump.sh

From the settings of your documentation, check the "Custom domain" box. You will then be asked to enter the URL of your custom domain, which should have been configured on your end in the previous step. Confirm by selecting "Update General Settings".

![](/images/help/custom-domains.png)

SSL certificates are automatically issued. 

> It may take some time for your custom domain update to propagate. This delay is normal and is not dependent on Bump.sh or your hosting provider.
During this period, visitors returning to access your documentation may have difficulty accessing it. It is recommended to try again later or clear your cache before making another attempt.
{: .info}
