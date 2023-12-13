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

![](/images/help/slack-integration.png)

## Webhooks

You can define as many webhooks as you wish to receive structural changes when they occur on your documentations.

A webhook is a way for an app to get instant notifications from other applications. Webhooks are automated messages (also called payloads) sent to a specific URL. Unlike a classic call to an API, webhooks are more efficient than just polling it. <br>
Webhooks are useful for updating an API client generator, rebuilding an integration, and more, such as through a security suite, etc.

Webhooks help integrate Bump into your current workflows. The chosen URLs will receive an HTTP request automatically when Bump notices a structural change in your documentation.

Notifications can be sent to several URLs, allowing better integration with your existing tools.

### Setup

Webhooks can be configured from the Integrations tab in your documentation settings.

![](/images/help/add-webhook.png)

After adding your webhook, a confirmation will be displayed. From this screen, you can modify the payload URL and find the secret token to be used (which helps securing requests coming from Bump).

![](/images/help/webhook-secret-token.png)

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