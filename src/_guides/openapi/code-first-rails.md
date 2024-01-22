---
title: Generating OpenAPI docs for Ruby on Rails with RSwag
authors: phil
excerpt: This guide describes, in a code-first approach and RoR codebase, how to generate OpenAPI description documents, enhancing it with contextual information and deploying it to Bump.sh.
---

API Code-first is the art of building an API, and then popping some annotations or metadata in there to output API documentation in an API description format like [OpenAPI](https://spec.openapis.org/oas/latest.html).

The most popular API Code-first approach in Ruby on Rails uses a tool called [RSwag](https://github.com/rswag/rswag/).
With RSwag you write the OpenAPI for each API endpoint into special tests, which help to confirm your responses are matching the OpenAPI you've just written.

## Creating OpenAPI with RSwag

_This guide assumes you want to use `RSpec` as your testing framework in your application._

**Step 1:** Add the rswag dependencies to the `Gemfile`.

  ```ruby
  # Gemfile
  gem 'rspec-rails'
  gem 'rswag'
  ```

**Step 2:** Install the new dependencies and run the rswag generator.
  ```bash
  bundle install
  ```
  You'll need to run the [rspec](https://rspec.info/) generator if it's the first time you use rspec.
  ```
  rails generate rspec:install
  ```
  Then run the rswag generator.
  ```
  rails generate rswag:install
  ```

**Step 3:** You'll need some controllers/models to describe, which your application probably already has. If you need to make some, use the following scaffold command to add everything Rails related.

```
rails generate scaffold Widget name:string

rails db:migrate
```

**Step 4:** With controllers and models in the app, we can use the `rspec:swagger` generator referencing a valid controller class name to make an OpenAPI test. _If you're wondering why its called "Swagger", that's the old name for OpenAPI, and with some tools it's just stuck.

```
rails generate rspec:swagger WidgetsController
```

**Step 5:** This will create `spec/requests/widgets_spec.rb` which will look like this:

```ruby
require 'swagger_helper'

RSpec.describe 'widgets', type: :request do

  path '/widgets' do

    get('list widgets') do
      response(200, 'successful') do

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end

    post('create widget') do
      response(200, 'successful') do

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end
  end

  path '/widgets/{id}' do
    # You'll want to customize the parameter types...
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('show widget') do
      response(200, 'successful') do
        let(:id) { '123' }

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end

    put('update widget') do
      response(200, 'successful') do
        let(:id) { '123' }

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end

    # snipped patch and delete for readability
end
```

**Step 6:** All of this test is not just checking the code is doing what we expect, but it's actually able to produce OpenAPI for us. Let's see what we've got so far.

```
$ rake rswag

Generating Swagger docs ...
Swagger doc generated at /Users/phil/src/rails-code-first/swagger/v1/swagger.yaml
```

**Step 7:** OpenAPI being generated means we can deploy it to Bump.sh.

> Deploying OpenAPI documentation to Bump.sh.
> - [Create and name](https://bump.sh/docs/new?utm_source=bump&utm_medium=content_hub&utm_campaign=getting_started) your first API documentation.
> - Then, retrieve the name and token of this documentation from the _CI deployment_ settings page.
{: .info}


**Step 8:** Install the Bump.sh CLI with [npm](https://docs.npmjs.com/cli/v9/configuring-npm/install?v=true).

```bash
npm install -g bump-cli
```

**Step 9:** The moment you've been waiting for, deploying your OpenAPI to Bump.sh to generated beautiful hosted documentation!

```bash
$ bump deploy swagger/v1/swagger.yaml \
  --doc my-documentation-name \
  --token my-documentation-token

* Your new documentation version will soon be ready at https://bump.sh/bump-examples/hub/code-samples/doc/rails-hello-openapi
```

**Step 10:** Head over to your documentation and see how it looks at this early stage.

![Bare bones of an OpenAPI document rendered by the Bump.sh hosted API documentation interface](/images/guides/code-first-rails-initial.png)

It looks like a start, but it's missing a whole lot of the what, and the why, which is crucial to making API documentation useful, relevant, and readable. Time to learn a bit more about [the RSwag DSL](https://github.com/rswag/rswag/#the-rspec-dsl) and get more data into our docs.

**Step 11:** Going back to `spec/requests/widgets_spec.rb` we leverage the DSL to improve our tests, and improve our OpenAPI. Lets add some headers, a schema to explain how the object is going to look, and a few error responses.

  ```ruby
    path '/widgets' do

    get 'list widgets'  do
      produces 'application/json'

      response 200, 'successful' do
        header 'Cache-Control', schema: { type: :string }, description: <<~HEADER
          This header declares the cacheability of the content so you can skip repeating requests.

          Values can be `max-age`, `must-revalidate` and `private`. It can also combine any of those separated by a comma. E.g. `Cache-Control: max-age=604800, must-revalidate`
        HEADER

        schema type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              title: {
                type: 'string',
                example: 'Neuralyzer',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
              },
            }
          }

        example 'application/json', :example_key, [
          {
            id: 1,
            title: 'Neuralyzer',
          }
        ]
        run_test!
      end

      response 429, 'too many requests' do
        header 'X-Rate-Limit-Limit', schema: { type: :integer }, description: 'The number of allowed requests in the current period'
        header 'X-Rate-Limit-Remaining', schema: { type: :integer }, description: 'The number of remaining requests in the current period'
        header 'X-Rate-Limit-Reset', schema: { type: :integer }, description: 'The number of seconds left in the current period'

        run_test!
      end
    end
  ```

This is a lot, but let's walk through some of those changes.

The `produces: application/json` explains that the output is JSON, and seems to fix a bug in rswag where a lot of other OpenAPI won't show up.

Then in the 200 response we've described headers, including this one for cache controls so clients know they can use [client caching middleware](https://apisyouwonthate.com/blog/http-client-response-caching/) if they want to cut down on wasteful repeat requests. Please note we have used a multiline text to describe the header in the OpenAPI document and that it supports Markdown.

```ruby
response 200, 'successful' do
  header 'Cache-Control', schema: { type: :string }, description: <<~HEADER
    This header declares the cacheability of the content so you can skip repeating requests.

    Values can be `max-age`, `must-revalidate` and `private`. It can also combine any of those separated by a comma. E.g. `Cache-Control: max-age=604800, must-revalidate`
  HEADER
```

The schema block is OpenAPI, but written in Ruby syntax instead of JSON or YAML so we can cut down on some of the parenthesis. This explains what properties can be expected in the response body, and what format they'll use (UUID, date time instead of unix, etc.) You can even provide an example for the property, to help Bump automatically construct an example for the whole response body to avoid needing to do that yourself.

```ruby
schema type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      title: {
        type: 'string',
        example: 'Neuralyzer',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
      },
    }
  }
```

Try making similar changes yourself and running `rake rswag` again to update `swagger/v1/swagger.yaml`. Then either use `bump deploy` to update your hosted documentation, or `bump preview --live --open swagger/v1/swagger.yaml` to see how it looks without deploying it everytime your make a change in your spec file.

The [RSwag DSL documentation](https://github.com/rswag/rswag/#the-rspec-dsl) can help you with all sorts of improvements, including creating examples, adding security schemes, and using `$ref` to [reduce repetition in your OpenAPI](/guides/openapi/advanced-ref-usage/).

## Sample Code

The sample code for this guide is published on GitHub so you can try that if you're having trouble adding it to your application: [rails-code-first](https://github.com/bump-sh-examples/rails-code-first), and the [deployed documentation](https://bump.sh/bump-examples/hub/code-samples/doc/rails-hello-openapi) is over here.

## Honorable Mentions

If rswag is not working out for you, take a look at some of these tools.

- [ZRO: OpenAPI Generator for Rails](https://github.com/zhandao/zero-rails_openapi)
- [rspec-openapi](https://rubygems.org/gems/rspec-openapi/)
