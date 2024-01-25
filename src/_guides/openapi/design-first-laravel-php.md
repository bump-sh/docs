---
title: Using OpenAPI to simplify building and testing Laravel APIs
authors: phil
excerpt: Dive into the API Design-first workflow with Laravel PHP, leveraging OpenAPI to power your server-side request validations, and build a contracting test suite based off that same API contract.
---

Laravel PHP is a powerful framework with loads of handy community extensions for building APIs, and working with [OpenAPI](https://spec.openapis.org/oas/latest.html) tooling.

Some folks may be used to the API code-first workflow, where you write the whole API then sprinkle in some metadata later using swagger-php or something similar. The API design-first workflow is the opposite of that approach.

Instead of rushing into the code, we can build OpenAPI descriptions before writing any code at all, like creating a blueprint before building a house. Once you have the OpenAPI description documents saved (ideally in your source code repository), you can leverage it at every step of the API lifecycle, to produce mock APIs for clients to test assumptions with, build client libraries without writing any code, make really effective contract testing, and even generate backend code to get the application teams started once the contract is all signed off.

This guide is going to look at two specific parts of the API design-first workflow, and show how to set it up in Laravel: request validation, and contract testing responses.

- [Getting OpenAPI \& Bump.sh Setup](#getting-openapi--bumpsh-setup)
- [Request Validation powered by OpenAPI](#request-validation-powered-by-openapi)
- [Contract Testing with OpenAPI](#contract-testing-with-openapi)
- [Sample Code](#sample-code)

## Getting OpenAPI & Bump.sh Setup

The API design-first workflow means you'll need to create your OpenAPI description before you start writing all your code, so if you don't have an `openapi.yaml` already that is probably the first step. You can use a wide variety of [graphical editors](https://openapi.tools/#gui-editors), [text editors](https://openapi.tools/#text-editors), or [traffic sniffing](/guides/openapi/code-first/#traffic-sniffing) to generate this OpenAPI, and there is lots of documentation and guides to help you. 

Alternatively you can grab some sample OpenAPI from the API Guru Marketplace, and click JSON or YAML to download their OpenAPI descriptions.

Either way, once you have an OpenAPI description document, pop it into your Git repository somewhere like `api/openapi.yaml`. 

Building an API for a bunch of clients is always a tricky one, but by deploying the documentation first, you can see if people like the look of the API before you waste time building it. Then, as you progress through, especially if you add these tools to an existing codebase, you will continue to find mistakes in your OpenAPI or your actual API code. Improve both as you go until you have a perfect match that will never again be broken, solving the "docs vs code" drift problem, and every fix will be deployed to Bump.sh with each commit/merge.

```bash
$ bump deploy api/openapi.yaml \
  --doc laravel-design-first \
  --token my-documentation-token

* Your new documentation version will soon be ready at https://bump.sh/hub/code-samples/doc/laravel-design-first
```

Instead of using the [CLI](https://github.com/bump-sh/cli#bump-deploy-file) you could use [GitHub Actions](https://github.com/marketplace/actions/bump-sh), or a bunch of other [Continuous Integration](https://docs.bump.sh/help/continuous-integration/). 

Once Bump.sh is hooked up, let's look at how we'd teach a Laravel API (new, or existing) to be able to handle request validation for us.

## Request Validation powered by OpenAPI

Instead of wasting loads of time writing out validation logic in PHP, why not just point it at an existing OpenAPI description and skip repeating yourself? You don't need to spend forever writing out that name is required, email is also required and looks like an email address, date of birth is a date and optional... that's what your OpenAPI description already says, and because it's in a machine readable format you can just use it as code.

We're working with some [sample code](https://github.com/bump-sh-examples/laravel-design-first) in this guide, which has a basic `POST /widgets` endpoint. If I try to create a widget without providing the required description it will give me this database error.

```
$ curl -X POST http://localhost:8000/api/widgets \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"name":"Replicator"}'

{
    "message": "SQLSTATE[23000]: Integrity constraint violation: 19 NOT NULL constraint failed: widgets.description (Connection: sqlite, SQL: insert into \"widgets\" (\"name\", \"description\", \"updated_at\", \"created_at\") values (Replicator, ?, 2024-01-15 19:50:27, 2024-01-15 19:50:27))",
    "exception": "Illuminate\\Database\\QueryException",
    "file": "/Users/phil/src/laravel-design-first/vendor/laravel/framework/src/Illuminate/Database/Connection.php",
```

Let's get this OpenAPI-based validation working so we don't have to write a million validation rules that we've already written in my OpenAPI description.

**Step 1:** Use Composer to install the [membrane/laravel](https://github.com/membrane-php/membrane-laravel) dependency.

```bash
composer require membrane/laravel
```

**Step 2:** Publish the membrane config so you can control how it works and help it find your OpenAPI.

```bash
php artisan vendor:publish --tag="membrane"
```

**Step 3:** Open `config/membrane.php` which was just created by that command, and update the location of our OpenAPI description documents.


```php
<?php

declare(strict_types=1);

return [

    'api_spec_file' => base_path() . '/api/openapi.yaml',
```

The "entry file" that is usually called `openapi.yaml` can live anywhere, but in this example it lives in the Laravel base path in a `api/` directory.

**Step 4:** Register the middleware in `app/Http/Kernel.php`, adding the following line to the appropriate middleware group.

```php
# app/Http/Kernel.php

    protected $middlewareGroups = [
        'api' => [
            // ... 
            \Membrane\Laravel\Middleware\RequestValidation::class,
            \Membrane\Laravel\Middleware\ResponseJsonFlat::class,
        ],
    ];
```

**Step 5:** Start your server up so we can see if it all works.

```
php artisan serve
```

**Step 6:** Now using your favourite HTTP client you can try interacting with your API, to see how it works. Presuming you've got an endpoint, if not quickly make some sample controller (or grab ours from the [sample code](https://github.com/bump-sh-examples/laravel-design-first)) and make sure the model has some required properties. A basic test is to try sending a request that misses out a required property, to see if that allows the request through or fails it.

```
$ curl -X POST http://localhost:8000/api/widgets \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"name":"Replicator"}'

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

This error is letting me know I missed the `description` property out of my request. By default these errors are in the format defined by [RFC 7807: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807), which is not just a good error format, but it means that various other tools you use throughout your stack can all be in the same format easily.

Anyway, if we try with a valid request now the OpenAPI middleware should let the request through, and the API should respond with a success.

```
$ curl -X POST http://localhost:8000/api/widgets \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"name":"Replicator","description": "A device which can make anything out of recycled biowaste."}'

{
  "data": {
    "id": 2,
    "name": "Replicator",
    "description": "A device which can make anything out of recycled biowaste.",
    "created_at": "2024-01-16T15:14:47.000000Z",
    "updated_at": "2024-01-16T15:14:47.000000Z"
  },
  "links": {
    "self": "http://localhost:8000/api/widgets/2"
  }
}
```

Success! Now, without needing to write any PHP code at all, your API is rejecting invalid requests, which is not only saving time writing code, but is making sure the OpenAPI and code line up perfectly. It's pretty hard for code and docs to drift when they're sharing a single source of truth like this.

## Contract Testing with OpenAPI

For as long as you keep deploying OpenAPI changes to Bump.sh using the CLI or GitHub Actions, and as long as your code is powered by your API, it is impossible to have any OpenAPI drift in your requests. Responses however will still need to be checked, and we can do that within your existing PHPUnit or Pest test suite using a Laravel PHP extension called [Spectator](https://github.com/hotmeteor/spectator).

_This guide will use the Pest test suite, but you can use PHPUnit if you prefer that._

**Step 1:** Use Composer to install Spectator in your Laravel API.

```
composer require hotmeteor/spectator --dev

php artisan vendor:publish --provider="Spectator\SpectatorServiceProvider"
```

**Step 2:** Get a basic test running before we start trying to contract test.

Assuming you've got [Pest set up to work with Laravel](https://dev.to/alphaolomi/step-by-step-to-pest-php-testing-framework-in-laravel-10-6e1), you probably have some tests that look a bit like this one, but if you're missing tests you can make them with `php artisan pest:test WidgetTest`. Either way, a fairly common Laravel API endpoint test might look a bit like this:

```php
# tests/Feature/WidgetTest.php
<?php
use App\Models\Widget;

describe('POST /widgets', function () {
    it('returns a valid record', function () {
        $this
            ->postJson("/api/widgets", [
                'name' => 'Test Widget',
                'description' => 'This is a test widget',
            ])
            ->assertStatus(201);
    });

    it('returns a 400 for invalid record', function () {
        $this
            ->postJson("/api/widgets", [
                'name' => 'Missing a Description',
            ])
            ->assertStatus(400);
    });
});
```

Assuming you've got a test like this, or have made one along with the matching controller and model, then we're all in the same place. Let's get OpenAPI involved.

**Step 4**: Add contract testing to your test suite.

First let's let Spectator know where we keep our API descriptions. We're trying to use the `api/openapi.yaml` document so we can give it a base path that points it to that directory.

```php
# config/spectator.php
<?php

return [

    'default' => env('SPEC_SOURCE', 'local'),

    'sources' => [
        'local' => [
            'source' => 'local',
            'base_path' => './api/',
        ],
    ],
```

Then open up `tests/Pest.php` and tell Spectator which OpenAPI description document it should be using:

```php
# tests/Pest.php
<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Spectator\Spectator;

uses(Tests\TestCase::class)->in('Feature', 'Unit');

uses(RefreshDatabase::class)->in('Feature');

uses()->beforeEach(fn () => Spectator::using('openapi.yaml'))->in('Feature');
```

Once Spectator knows where your OpenAPI lives in the file system it can use it as the basis for contract testing assertions. 

**Step 5:** Update your assertions to be OpenAPI powered.

The way Spectator works is by adding assertionjs that can be used in Laravel Feature tests, which looks like this:

```php
# tests/Feature/WidgetTest.php
<?php
use App\Models\Widget;

describe('POST /widgets', function () {
    it('returns expected response when request is valid', function () {
        $this
            ->postJson("/api/widgets", [
                'name' => 'Test Widget',
                'description' => 'This is a test widget',
            ])
            ->assertValidResponse(201);
    });

    it('returns a 400 for invalid request', function () {
        $this
            ->postJson("/api/widgets", [
                'name' => 'Missing a Description',
            ])
            ->assertValidResponse(400);
    });
});

describe('GET /widgets/{id}', function () {
    it('returns 200 for record that exists', function () {
        $widget = Widget::factory()->create();
        $this
            ->getJson("/api/widgets/{$widget->id}")
            ->assertValidResponse(200);
    });

    it('returns a 404 for missing record', function () {
        Widget::factory()->create();

        $this
            ->getJson("/api/widgets/12345")
            ->assertValidResponse(404);
    });
});

```

All the magic is happening in `assertValidResponse()`, where it's looking at the OpenAPI description, seeing which HTTP method and endpoint being called, then comparing what it sees in the HTTP response coming from postJson against the OpenAPI descriptions response schema.


Immediately Spectator got to work letting me know about mismatches between my code and the API description, and here are some highlights.

```
FAILED  Tests\Feature\WidgetTest > `GET /widgets/{id}` → it returns a 404 for missing record
No response object matching returned status code [404].
```

Oops, I am testing to see if a 404 appears but I have not actually described the 404, which means any API clients looking at the API documentation powered by this OpenAPI will have no idea that a 404 might appear. They might guess, but guesswork isn't how you create a solid understanding of an API. Let's define that.


Spectator also let me know my errors are all the wrong shape. OpenAPI was suggsting `{ errors: { title, description, ... }}` but the actual error format coming back from the API code was `{ title, description, errors: {}}`.

```
FAILED  Tests\Feature\WidgetTest > `POST /widgets` → it returns a 400 for invalid request

The properties must match schema: errors
The data (object) must match the type: array

object++ <== The properties must match schema: errors
    errors: array <== The data (object) must match the type: array
        object++
            title: string
            detail: string
            code: string
```

It shows how easy it can be to make mistakes and mismatches between your API and the OpenAPI description, and it shows how useful tools can be at pointing out the mismatches. Once you get this suite passing 100% you should never have other mismatches, and now you have extensive contract testing which will reduce general issues for your clients interacting with your API, avoid accidentally breaking changes, and you got all of that without having to spend infinite time writing out "and this property should be a string..." over and over again in PHP.

## Sample Code

The sample code for this design first guide is published on GitHub, so please take a look at [laravel-design-first](https://github.com/bump-sh-examples/laravel-design-first), and the [deployed documentation](https://bump.sh/bump-examples/hub/code-samples/doc/laravel-design-first) is over here.
