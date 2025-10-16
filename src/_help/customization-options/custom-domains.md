---
title: Custom domains
---

- TOC
{:toc}

Your API documentation is hosted on Bump.sh under our domain name. By default, accessing your documentation will be possible via a URL such as `https://bump.sh/<organization_slug>/doc/<doc_slug>`.

To extend your brand experience to visitors and API consumers, you can use your own domain to replace our default URL by setting up a specific CNAME record.

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

From the settings of your documentation, check the "Custom domain" box. You will then be asked to enter the URL of your custom domain, which has been configured on your end in the previous step. Confirm by selecting "Update General Settings". SSL certificates are automatically issued at this step.

![](/images/help/custom-domains.png)

> It may take some time for your custom domain update to propagate. This delay is normal and is not dependent on Bump.sh or your hosting provider.
During this period, visitors returning to access your documentation may have difficulty accessing it. It is recommended to try again later or clear your cache before making another attempt.
{: .info}
