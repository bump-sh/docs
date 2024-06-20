---
title: Generating OpenAPI docs for Laravel with Swagger-PHP
authors: phil
excerpt: This guide describes, in a code-first approach and Laravel codebase, how to generate OpenAPI description documents, enhancing it with contextual information and deploying it to Bump.sh.
date: 2024-01-25
---

API Code-first is the art of building an API, and then popping some annotations or metadata in there to output API documentation in an API description format like [OpenAPI](https://spec.openapis.org/oas/latest.html).

The most popular API Code-first approach in Laravel uses a tool called [Swagger-PHP](https://zircote.github.io/swagger-php/). With Swagger-PHP you write the OpenAPI for each API endpoint as annotations or PHP attributes, keeping the API description close to the code that it's describing.

## Creating OpenAPI with Swagger-PHP

**Step 1:** Install the zircote/swagger-php Composer dependency.

```
composer require zircote/swagger-php
```

**Step 2:** Add some annotations to your controllers.

Sprinkle metadata around your controllers explaining their paths, responses, and adding some descriptions that will help people understand how things work when the documentation is built. 

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\{WidgetCollection, WidgetResource};
use App\Models\Widget;
use Illuminate\Http\{Request, Response};

use OpenApi\Attributes as OA;

class WidgetController extends Controller
{
    #[OA\Get(path: '/api/widgets', description: 'Display a collection of widgets.')]
    #[OA\Response(response: Response::HTTP_OK, description: 'OK')]
    public function index()
    {
        $widgets = Widget::all();
        return new WidgetCollection($widgets);
    }

    #[OA\Get(path: '/api/widgets/{id}', description: 'Display the specified widget.')]
    #[OA\Response(response: Response::HTTP_OK, description: 'OK')]
    public function show(Widget $widget)
    {
        return new WidgetResource($widget);
    }

    #[OA\Post(path: '/api/widgets', description: 'Created a new widget.')]
    #[OA\Response(response: Response::HTTP_CREATED, description: 'Created')]
    public function store(Request $request)
    {
        $widget = Widget::create([
            'name' => $request->post('name'),
            'description' => $request->post('description'),
        ]);

        return response()->json(new WidgetResource($widget), Response::HTTP_CREATED);
    }

    #[OA\Put(path: '/api/widgets/{id}', description: 'Update the specified widget by replacing all properties.')]
    #[OA\Response(response: Response::HTTP_OK, description: 'OK')]
    public function update(Request $request, Widget $widget)
    {
        $widget->update([
            'name' => $request->post('name'),
            'description' => $request->post('description'),
        ]);
        return response()->json(new WidgetResource($widget), Response::HTTP_OK);
    }

    #[OA\Delete(path: '/api/widgets/{id}', description: 'Delete the specified widget entirely.')]
    #[OA\Response(response: Response::HTTP_NO_CONTENT, description: 'Success')]
    public function destroy(Widget $widget)
    {
        $widget->delete();
        return response()->noContent(Response::HTTP_NO_CONTENT);
    }
}
```

_This metadata uses the PHP 8 [Attributes](https://www.php.net/manual/en/language.attributes.overview.php) syntax, but there is a docblock based syntax if you're stuck on an older version of PHP._

**Step 3:** Export the OpenAPI from your source code.

```
$ vendor/bin/openapi src -o openapi.yaml
```

This outputs a good chunk of OpenAPI for you, so lets take a look and sew what we've got.

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: 'My Widget API'
  version: 1.0.0
paths:
  /api/:
    get:
      description: 'The home resource shows you what can be done with the API.'
      operationId: 14776015d6f5a2e7b4d4eb64c7ae2f1f
      responses:
        '200':
          description: OK
  /api/widgets:
    get:
      description: 'Display a collection of widgets.'
      operationId: 3f6fb451248ef3559606c43b021abfcd
      responses:
        '200':
          description: OK
    post:
      description: 'Created a new widget.'
      operationId: 87fc629a5099009546b979bfbcb47dd2
      responses:
        '201':
          description: Created
  '/api/widgets/{id}':
    get:
      description: 'Display the specified widget.'
      operationId: 12dd67833d3a2d1036437661a4cd8f07
      responses:
        '200':
          description: OK
    put:
      description: 'Update the specified widget by replacing all properties.'
      operationId: 256916253053a8ae669607bc6cc61e63
      responses:
        '200':
          description: OK
    delete:
      description: 'Delete the specified widget entirely.'
      operationId: b1915b538ae8a9a211fe476ed8219673
      responses:
        '204':
          description: Success
```

**Step 4:** OpenAPI being generated means we can deploy it to Bump.sh. # Deploying OpenAPI documentation to Bump.sh. [Create and name](https://bump.sh/docs/new?utm_source=bump&utm_medium=content_hub&utm_campaign=getting_started) your first API documentation. Then, retrieve the name and token of this documentation from the _CI deployment_ settings page.

**Step 5:** Install the Bump.sh CLI with [npm](https://docs.npmjs.com/cli/v9/configuring-npm/install?v=true).
  
```bash
npm install -g bump-cli
```

**Step 6:** The moment you've been waiting for, deploying your OpenAPI to Bump.sh to generated beautiful hosted documentation!

```bash
$ bump deploy openapi.yaml \
  --doc laravel-code-first \
  --token my-documentation-token

* Your new documentation version will soon be ready at https://bump.sh/bump-examples/hub/code-samples/doc/laravel-code-first
```

**Step 7:** Head over to your documentation and see how it looks at this early stage.

![Bare bones of an OpenAPI document rendered by the Bump.sh hosted API documentation interface](/images/guides/code-first-laravel-initial.png)

It looks like a start, but there is so much more we can do, including explaining responses, including longer descriptions, all of which is crucial to making API documentation useful, relevant, and readable. Time to learn a bit more about [Swagger-PHP Annotations](https://zircote.github.io/swagger-php/reference/attributes.html) and get more data into our docs.

For the next trick, let's add parameters and multiple responses to this controller method.

```php
# app/Http/Controllers/Api/WidgetController.php

#[OA\Get(path: '/api/widgets/{id}', description: 'Display the specified widget.')]
#[OA\Parameter(in: "path", name: "id", required: true, schema: new OA\Schema(type: 'string'))]
#[OA\Response(response: Response::HTTP_OK, description: 'OK')]
#[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Not found')]
public function show(Widget $widget)
{
    return new WidgetResource($widget);
}
```

This will improve our generated OpenAPI:

```yaml
  '/api/widgets/{id}':
    get:
      description: 'Display the specified widget.'
      operationId: 12dd67833d3a2d1036437661a4cd8f07
      parameters:
        -
          name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
        '404':
          description: 'Not found'
```

What about adding a schema in so we can see what the response body is going to look like? 

```php
# app/Http/Resources/WidgetResource.php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Schema()]
class WidgetResource extends JsonResource
{
    #[OA\Property(
        description: 'Unique auto-incrementing ID of the Widget.',
        readOnly: true,
    )]
    protected int $id;

    #[OA\Property(
        description: 'The name of a widget in English.',
    )]
    protected string $name;

    #[OA\Property(
        description: 'Optional description of what the widget does, and how it works.',
    )]
    protected ?string $description;

    #[OA\Property(
        description: 'Date the widget was created, in ISO 8601 date time.',
        example: '2024-01-20T09:15:28Z',
        readOnly: true,
    )]
    protected string $created_at;

    #[OA\Property(
        description: 'Date the widget was last updated, in ISO 8601 date time.',,
        readOnly: true,
    )]
    protected string $updated_at;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => [
                'id' => $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ],
            'links' => [
                'self' => route('widgets.show', ['widget' => $this->id]),
            ],
        ];
    }
}
```

Here the Swagger-PHP attributes are working with the reflection API to look at the name of the property and infer the types, so we don't need to define those agai. Rerunning `./vendor/bin/openapi app -o openapi.yaml` will add the following to `openapi.yaml`.

```yaml
openapi: 3.0.0
info:
  title: 'My Widget API'
  version: 1.0.0
paths:
  # snip
components:
  schemas:
    WidgetResource:
      properties:
        id:
          description: 'Unique auto-incrementing ID of the Widget.'
          type: integer
          readOnly: true
        name:
          description: 'The name of a widget in English.'
          type: string
        description:
          description: 'Optional description of what the widget does, and how it works.'
          type: string
          nullable: true
        created_at:
          description: 'Date the widget was created, in ISO 8601 date time.'
          type: string
          readOnly: true
          example: '2024-01-20T09:15:28Z'
        updated_at:
          description: ''
          type: string
          readOnly: true
      type: object
```

Great, but now we need to join it up with the controller and a full response body. 

```php
# app/Http/Controllers/Api/WidgetController.php

  #[OA\Get(path: '/api/widgets/{id}', description: 'Display the specified widget.')]
  #[OA\Parameter(in: "path", name: "id", required: true, schema: new OA\Schema(type: 'string'))]
  #[OA\Response(
      response: Response::HTTP_OK,
      description: 'OK',
      content: new OA\JsonContent(ref: "#/components/schemas/WidgetResource")
  )]
  #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Not found')]
  public function show(Widget $widget)
  {
      return new WidgetResource($widget);
  }
```

Using ref this way feels a little funny at first because you're using a JSON Reference to something in an OpenAPI description you don't really control, but once you get the contention it makes sense. The `"#/components/schemas/WidgetResource"` name is generated from the class we put the `WidgetResource` class that contains a `#[OA\Schema()]`, and together that instructs Swagger-PHP to make shared schema component, and now it's been referenced in your schema controller the whole thing comes together like this:

```yaml
  '/api/widgets/{id}':
    get:
      description: 'Display the specified widget.'
      operationId: 12dd67833d3a2d1036437661a4cd8f07
      parameters:
        -
          name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WidgetResource'
        '404':
          description: 'Not found'
```

There is a lot more work to be done until 100% of your API is covered, but you can use these concepts to build out most things, and if you need any other help the [Swagger-PHP reference documentation](https://zircote.github.io/swagger-php/reference/attributes.html) can help you out.

## Sample Code

The sample code for this guide is published on GitHub so you can try that if you're having trouble adding it to your application: [laravel-code-first](https://github.com/bump-sh/laravel-code-first), and the [deployed documentation](https://bump.sh/bump-examples/hub/code-samples/doc/laravel-code-first) is over here.
