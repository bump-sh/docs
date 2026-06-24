---
title: Custom domains
---

- TOC
{:toc}

Your MCP server is hosted on Bump.sh under our domain name. By default, accessing your MCP server will be possible via a URL such as `https://run.bump.sh/<organization_slug>/<server_slug>/mcp`.

To extend your brand experience to users adding your MCP server to AI tools, you can use your own domain to replace our default URL by setting up a specific CNAME record.

## Setting a CNAME record

First, you'll need to create a CNAME record pointing to `custom.run.bump.sh`, at your domain name provider.

For instance, if you want to host your MCP server under the `mcp.example.com` domain, you will create the following record:

```
mcp.example.com. 3600 IN CNAME custom.run.bump.sh.
```

> The configuration of the CNAME record can vary from one hosting provider to another. Feel free to contact your hosting provider if you have any questions at this stage.
{: .info}

Once this is done, you can set your custom domain in Bump.sh.

## Setting a custom domain in Bump.sh

From the settings of your MCP server, check the "Custom domain" box. You will then be asked to enter the URL of your custom domain, which has been configured on your end in the previous step. Confirm by selecting "Update general settings". SSL certificates are automatically issued at this step.

> It may take some time for your custom domain update to propagate. This delay is normal and is not dependent on Bump.sh or your hosting provider.
During this period, AI tools trying to connect to your MCP server may have difficulty reaching it.
{: .info}