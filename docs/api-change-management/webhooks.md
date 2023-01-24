# Webhooks

A webhook is a way for an app to get instant notifications from other applications. Webhooks are automated messages (also called payloads) sent to a specific URL. Unlike a classic call to an API, webhooks are more efficient than just polling it.

Webhooks help integrate Bump into your current workflows. The chosen URLs will receive an HTTP request automatically when Bump notices a structural change in your documentation.

Notifications can be sent to several URLs, allowing better integration with your existing tools.

## Setup

### Step 1:

Select the **Integrations** tab from your Bump’s dashboard to reach the webhook section.

![](/files/N3rDneaswUa7YztE6nH0.png)

### Step 2:

After adding your webhook, a confirmation will be displayed. From this screen, you can modify the payload URL and find the secret token to be used (which helps to secure requests coming from Bump).

![](/files/OE8vOhb9gWGtCiB9bTvZ.png)

Here is a pseudo-code (in Ruby language) which you should implement in your server if you want to check the authenticity of the received payload:

```ruby
def verify_signature(payload_body)
  signature = "sha256=" + OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new("sha256"), ENV["SECRET_TOKEN"], payload_body)
  return halt 500, "Signatures didn't match!" unless Rack::Utils.secure_compare(signature, request.env["HTTP_X_BUMP_SIGNATURE_256"])
end
```

### Step 3:

The **Recent deliveries** section include a **Test Webhook **element that helps you verify that the webhook works correctly. You can also check the 10 last notifications.

![](/files/MMsiIICn5P1iK10bnwO9.png)

### Payload content

Details about the payload content sent for each setup webhooks is available in our [absolutely gorgeous API documentation](https://developers.bump.sh/#webhook-documentation-change).

## Delete a webhook

To stop receiving notifications, you can delete a webhook by selecting it from the **Integrations** section and then confirm the deletion in the **Danger zone**.

![](/files/zv44dbSnFqeaZqgfIvSD.png)

