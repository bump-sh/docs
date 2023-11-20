---
title: Changes notification
---

- TOC
{:toc}

Your API consumers and organization members don't want to miss any changes in your API. Bump.sh offers several tools and solutions to be notified of its evolution.

## How to get notifications

### GitHub integration

With our [Github Action](/help/continuous-integration/github-actions), you can receive automatic API diff comments directly in your pull requests. This pull request comment will include:

- a diff summary
- information about the breaking change status

### Slack integration

Integrating Bump.sh with Slack can be done in three steps.

1. From your Slack workspace admin, [create a webhook](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks): this allows you to specify where Bump.sh should send change notifications.
2. Once you have the webhook, go to the settings of your documentation, in the Integrations tab, enable the Slack option, and provide the previously obtained webhook.
3. Mention the channels where you want to receive notifications.

After configuration, remember to test the proper reception of notifications with the test button.

![](/images/help/slack-integration.png)

### Email

Your API consumers can subscribe to a weekly summary of changes to your API via email by clicking on `Get Updates` from the changelog page.

> The emails collected in this way will only be used for sending this changelog summary and nothing else.
{: .info}

![](/images/help/get-updates.png)


### Webhooks

You can define as many webhooks as you wish to receive structural changes when they occur on your documentations.

A webhook is a way for an app to get instant notifications from other applications. Webhooks are automated messages (also called payloads) sent to a specific URL. Unlike a classic call to an API, webhooks are more efficient than just polling it.

Webhooks help integrate Bump into your current workflows. The chosen URLs will receive an HTTP request automatically when Bump notices a structural change in your documentation.

Notifications can be sent to several URLs, allowing better integration with your existing tools.

#### Setup

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

#### Payload content

Details about the payload content sent for each setup webhooks is available in our [Bump.sh API documentation](https://developers.bump.sh/#webhook-documentation-change).

#### Delete a webhook

To stop receiving notifications, you can delete a webhook by selecting it from the Integrations section and then confirm the deletion in the Danger zone.