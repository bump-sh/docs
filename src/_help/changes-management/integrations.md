---
title: Integrations
---

- TOC
{:toc}

## Slack integration

Bump.sh integration with Slack allows you to notify team members working with your API of its latest changes, through dedicated channels, for example.

1. From your Slack workspace admin, [create a webhook](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks): this allows you to specify where Bump.sh should send change notifications.
2. Once you have copied the webhook URL, go to the settings of your documentation, in the Integrations tab, enable the Slack option, and provide the previously obtained webhook URL.
3. Mention the channels where you want to receive notifications.

After configuration, remember to test the proper reception of notifications with the test button.

![](/docs/images/help/slack-integration.png)

## Webhooks

When your API evolves, you may want to automatically trigger some related tasks: rebuilding your API client, updating your security test suite, your integration tests, etc.

This can be achieved through Bump.sh webhooks.
It will send a specific request to the URLs you have configured every time it detects a change in your API structure.
You can define as many webhooks as you need.

Notifications can be sent to several URLs, allowing better integration with your existing tools.

### Setup

Webhooks can be configured from the Integrations tab in your documentation settings.

![](/docs/images/help/add-webhook.png)

After adding your webhook, a confirmation will be displayed. From this screen, you can modify the payload URL and find the secret token to be used (which helps securing requests coming from Bump).

![](/docs/images/help/webhook-secret-token.png)

Here is a pseudo-code (in Ruby language) which you should implement in your server if you want to check the authenticity of the received payload:

```ruby
def verify_signature(payload_body)
  signature = "sha256=" + OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new("sha256"), ENV["SECRET_TOKEN"], payload_body)
  return halt 500, "Signatures didn't match!" unless Rack::Utils.secure_compare(signature, request.env["HTTP_X_BUMP_SIGNATURE_256"])
end
```

Finally, you can check from this same page if your setup is working correctly by clicking on the `Test webhook` button.

### Payload content

Details about the payload content sent for each setup webhooks is available in our [Bump.sh API documentation](https://developers.bump.sh/#webhook-documentation-change).

### Delete a webhook

To stop receiving notifications, you can delete a webhook by selecting it from the Integrations section and then confirm the deletion in the Danger zone.
