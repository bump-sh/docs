# Custom domains

Your docs are hosted on Bump.sh. However you can set a custom domain: visitors of your docs will stay within your brand experience.

## Setting a CNAME record

First, you'll need to create a CNAME record pointing to `custom.bump.sh`, at your domain name provider.

For instance, if you want to host your documentation under the `developers.example.com `domain, you will create the following record:

```undefined
developers.example.com. 3600 IN CNAME custom.bump.sh.
```

Once this is done, you can set your custom domain in Bump.sh.

## Setting a custom domain in Bump.sh

1. Click on the chosen **Documentation** **>** **Settings**
2. Check the **Setup a custom domain **box.
3. Enter your custom domain.
4. Click **Update global settings**.

That's it. SSL certificates are automatically issued. Note: DNS caches may take a moment to update.

