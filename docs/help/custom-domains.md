# Custom domains

Your docs are hosted on Bump.sh. However you can set a custom domain: visitors of your docs will then stay within your own name. For this, you'll use a CNAME.

A CNAME, or Canonical Name, is a Domain Name System (DNS) entry. It serves as an alias, and maps a domain name to another. In our use case, it lets you set a domain name for your users to access your API docs, that they will use and see instead of the Bump.sh domain name.

## Setting a CNAME record

First, you'll need to create a CNAME record pointing to `custom.bump.sh`, at your domain name provider.

For instance, if you want to host your documentation under the `developers.example.com` domain, you will create the following record:

```undefined
developers.example.com. 3600 IN CNAME custom.bump.sh.
```

Once this is done, you can set your custom domain in Bump.sh.

## Setting a custom domain in Bump.sh

1. Click on the chosen **Documentation** **>** **Settings**
2. Check the **Setup a custom domain **box.
3. Enter your custom domain.
4. Click **Update global settings**.

That's it. SSL certificates are automatically issued.

Note: DNS entries may take a moment to propagate. Outdated entries may lead to the fact that visitors will not be able to access your docs via your custom domain immediately. You may need to wait up to 1 hour before your new domain name entry is available to all users. If you still have troubles accessing your doc after 24 hours please contact us.
