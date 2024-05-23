---
title: Using OpenAPI to simplify building and testing Ruby on Rails APIs
authors: phil
excerpt: In a Design-first approach and RoR API, leverage OpenAPI to verify specific request responses or write a test suite for your complete API contracts.
---

Ruby on Rails developers are blessed with a bunch of great [OpenAPI](https://spec.openapis.org/oas/latest.html) tooling, and can use either of the API Code-First workflow which was popular for a long time, or the follow the newer API Design-first workflow. 

Instead of writing loads of code and sprinkling in some metadata later to create docs, the design-first workflow assumes you create the OpenAPI descriptions before writing any code at all. Once you have the OpenAPI description documents saved in your repository, you can leverage it at every step of the API lifecycle, to produce mock APIs for clients to test assumptions with, build client libraries without writing any code, make really effective contract testing, and even generate backend code to get the application teams started once the contract is all signed off.

This guide is going to look at two specific parts of the API design-first workflow that are most helpful to documentation, and show how to set it up in Rails: request validation automatically, and contract testing responses.

- [Getting OpenAPI & Bump.sh Setup](#getting-openapi--bumpsh-setup)
- [Request Validation powered by OpenAPI](#request-validation-powered-by-openapi)
- [Contract Testing with OpenAPI](#contract-testing-with-openapi)
- [Sample Code](#sample-code)

## Getting OpenAPI & Bump.sh Setup

The API design-first workflow means you'll need to create your OpenAPI description before you start writing all your code, so if you don't have an `openapi.yaml` already that is probably the first step. You can use a wide variety of [graphical editors](https://openapi.tools/#gui-editors), [text editors](https://openapi.tools/#text-editors), or [traffic sniffing](/guides/openapi/code-first/#traffic-sniffing) to generate this OpenAPI, and there is lots of documentation and guides to help you. 

Alternatively you can grab some sample OpenAPI from the API Guru Marketplace, and click JSON or YAML to download their OpenAPI descriptions.

Either way, once you have some an OpenAPI description document, pop it into your Git repository somewhere like `api/openapi.yaml`. 

Building an API for a bunch of clients is always a tricky one, but by deploying the documentation first you can see if people like the look of the API before you waste a bunch of time building it. Then as you progress through, especially if you are adding these tools to an existing codebase, you will continue to find mistakes in your OpenAPI or your actual API code, improving both as you go until you have a perfect match that will never again be broken, solving the "docs vs code" drift problem, and every fix will be deployed to Bump.sh with each commit/merge.

```bash
$ bump deploy api/openapi.yaml \
  --doc rails-design-first \
  --token my-documentation-token

* Your new documentation version will soon be ready at https://bump.sh/bump-examples/hub/code-samples/doc/rails-design-first
```

Instead of using the [CLI](https://github.com/bump-sh/cli#bump-deploy-file) you could use [GitHub Actions](https://github.com/marketplace/actions/bump-sh-api-documentation-changelog), or a bunch of other [Continuous Integration](/help/continuous-integration/).

Once Bump.sh is hooked up, let's look at how we'd teach a Rails API (new, or existing) to be able to handle request validation for us.

## Request Validation powered by OpenAPI

Instead of wasting loads of time writing out validation logic in dry or whatever other DSL, why not just point it at an existing OpenAPI description document and skip repeating yourself? You don't need to spend forever writing out that name is required, email is also required and an email address, date of birth is a date and optional... that's what your OpenAPI description already says, and because it's in a machine readable format you can just use it as code.

**Step 1:** Add the [openapi_first](https://rubygems.org/gems/openapi_first) gems to your `Gemfile`.

  ```ruby
  # Gemfile
  gem 'openapi_first', '~> 1.0'
  ```

**Step 2:** Run `bundle install` in the CLI.

**Step 3:** Add the request validation middleware to the Rails application config.

  ```ruby
  # config/application.rb

  require_relative "boot"

  require "rails/all"

  # Require the gems listed in Gemfile, including any gems
  # you've limited to :test, :development, or :production.
  Bundler.require(*Rails.groups)

  module RailsDesignFirst
    class Application < Rails::Application
      # ...snip... 

      # Add this line
      config.middleware.use OpenapiFirst::Middlewares::RequestValidation, spec: 'api/openapi.yaml'
    end
  end
  ```

**Step 4:** Start your server up and try it out! 

  ```
  $ rails s
  ```
  
**Step 5:** Now using your favourite HTTP client you can try interacting with your API, to see how it works. Presuming you've got an endpoint, if not quickly make some sample controller (or grab ours from the [sample code](https://github.com/bump-sh-examples/rails-design-first)) and make sure the model has some required properties. A basic test is to try sending a request that misses out a required property, to see if that allows the request through or fails it.

  ```
  $ curl -X POST http://localhost:3000/widgets -H "Content-Type: application/json" -d '{}'  | jq .

  {
    "title": "Bad Request Body",
    "status": 400,
    "errors": [
      {
        "message": "object at root is missing required properties: name",
        "pointer": "",
        "code": "required"
      }
    ]
  }
  ```

This error is letting me know I missed the `name` property out of my request. By default these errors are in the format defined by [RFC 9457: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc9457), which is not just a good error format, but it means that various other tools you use throughout your stack can all be in the same format easily.

Anyway, if we try with a valid request now the OpenAPI middleware should let the request through, and the API should respond with a success.

```
$ curl -X POST http://localhost:3000/widgets -H "Content-Type: application/json" -d '{"name":"Replicator"}'  | jq .

{
  "id": 1,
  "name": "Replicator",
  "created_at": "2024-01-08T16:27:14.151Z",
  "updated_at": "2024-01-08T16:27:14.151Z"
}
```

Success! Now, without needing to write any Ruby code at all, your API is rejecting invalid requests, which is not only saving time writing code, but is making sure the OpenAPI and code line up perfectly. It's pretty hard for code and docs to drift when they're sharing a single source of truth like this.

So long as you keep deploying OpenAPI changes to Bump using the CLI or GitHub Actions, now that your code is powered by your API it's impossible to have any OpenAPI drift in your requests. Responses however, they still need to be checked, and we can do that with a regular test suite that you may well have already.

## Contract Testing with OpenAPI

It can also power contract testing in your existing test suite, and [openapi_contracts](https://rubygems.org/gems/openapi_contracts) can help out.

**Step 1:** Add the openapi_first gems to your `Gemfile`.

  ```ruby
  # Gemfile
  gem 'openapi_contracts'
  ```

**Step 2:** Run `bundle install` in the CLI.

**Step 3:** Add this to `spec/rails_helper.rb` to let openapi_contracts know where your OpenAPI lives in the codebase. If this file does not exist make sure RSpec is setup and installed and run `rails generate rspec:install`.

  ```ruby
  # spec/rails_helper.rb
  
  RSpec.configure do |config|
    
    # add this line pointing to your openapi.yaml, mine is `api/openapi.yaml`.
    config.before(:suite) do
      OPENAPI_DOC = OpenapiContracts::Doc.parse(Rails.root.join('api'), 'openapi.yaml')
    end
  end
  ```


**Step 4:** The way openapi_contract works is by adding a single assertion that can be used in [request tests](https://rspec.info/features/6-0/rspec-rails/request-specs/request-spec/). Learn more about request tests with [Rails and RSpec with this tutorial](https://medium.com/@qualitytechgirl/ruby-on-rails-testing-with-rspec-requests-92b09c8057a4), but basically it looks a bit like this. 

```ruby
# spec/requests/widgets_spec.rb

require "rails_helper"

RSpec.describe 'widgets', type: :request do
  
  describe "GET /widgets" do
    it 'responds with 200 and matches the doc' do
      get '/widgets'
      expect(response).to have_http_status(:ok)
      expect(response).to match_openapi_doc(OPENAPI_DOC)
    end
  end

end
```

All the magic is happening in `expect(response).to match_openapi_doc(OPENAPI_DOC)`, where it's looking at the OpenAPI description, seeing which HTTP method and endpoint to look for, then comparing what it sees against the schema for the defined response. 

If you get a response back in a test for a status code that is not defined in OpenAPI it will let you know:


```
Failures:

  1) widgets POST /widgets responds with 400 when invalid
    Failure/Error: expect(response).to match_openapi_doc(OPENAPI_DOC)
      * Undocumented response for "POST /widgets" with http status Bad Request (400)
    # ./spec/requests/widgets_spec.rb:18:in `block (3 levels) in <top (required)>'
```

Various other problems were noticed, like my documentation saying POST /widgets would return with a 201 and an empty body, but the API was returning the entire object of the resource that was just created for no reason.

```
  1) widgets POST /widgets responds with 201 when valid
    Failure/Error: expect(response).to match_openapi_doc(OPENAPI_DOC)
      * Expected empty response body
    # ./spec/requests/widgets_spec.rb:17:in `block (3 levels) in <top (required)>'

```

Keep experimenting with your OpenAPI and code responses until you're happy with it all. See if you can break things, see if you can find uncovered endpoints, and keep making your code and OpenAPI better with every tweak.

## Sample Code

The sample code for this design first guide is published on GitHub, so please
take a look at [rails-design-first](https://github.com/bump-sh-examples/rails-design-first), and the [deployed documentation](https://bump.sh/bump-examples/hub/code-samples/doc/rails-design-first) is over here.
