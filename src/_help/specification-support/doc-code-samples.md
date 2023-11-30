---
title: Custom code samples
---

- TOC
{:toc}

Even though we generate a basic `cURL` code sample by default in your documentation, you might want to customize the example provided and share even more specific language code samples to your API consumers. This is why we added this custom property.

Use the `x-codeSamples` property inside an Operation OpenAPI object. The `x-codeSamples` property accepts an array of code sample objects which are defined as such:

| Property | Type   | Description                                                                                                  |
|----------|--------|--------------------------------------------------------------------------------------------------------------|
| lang *   | String | Code sample programming language name.                                                                       |
| label    | String | A label which will be used as a title in the code sample bloc. Defaults to the `lang` value if not provided. |
| source * | String | The source code sample content.                                                                              |

> Bump.sh relies on the [Highlight.js lib](https://github.com/highlightjs/highlight.js#supported-languages) to color your code. If your language is not supported, the source code will be displayed anyway, just without color syntax.
{: .info}

## Example usage

The following screen capture shows the rendering of adding two code samples `cURL` and `Ruby` to your Operation.

![x-codesamples.gif](/images/help/x-codesamples.gif)

This is done by adding the following `x-codeSamples` array to your API definition:

```yaml
paths:
  /users:
    get:
      summary: Retrieve a user
      operationId: getUserPath
      responses: [...]
      parameters: [...]
      x-codeSamples:
        - lang: cURL
          label: Custom cURL
          source: |
            curl \
              --user "name:password" \
              --request GET \
              --url 'https://api.example.com/v1/users' \
              --header 'Accept: application/json'
        - lang: ruby
          label: Ruby library
          source: |
            require "http"
             
            request = HTTP
              .basic_auth(:user => "name", :pass => "password")
              .headers(:accept => "application/json")
             
            response = request.get("https://api.example.com/v1/users")
            if response.status.success?
              # Work with the response.body
            else
              # Handle error cases
            end
```
