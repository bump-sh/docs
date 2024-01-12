---
title: "Code-first: How to Generate OpenAPI from Code"
authors: phil
image: images/guides/code_first_openapi.png
canonical_url: https://bump.sh/blog/code-first-openapi
excerpt: Learn how to generate OpenAPI from an existing codebase.
---

API Code-first is the art of building an API, and then popping some annotations or metadata in there to output API documentation in an API description format like OpenAPI. There are a few conceptually different ways to do this, with new tools popping up to help make everything easier, so this guide will show you how those different types of tool work.

For those of you used to the API Code-first here are the three main workflows you should be thinking about going forwards. If you've been documenting your APIs entirely manually with some sort of content management system, wiki, or Word Document, then these ideas might save you from that nightmare.

- [Annotations](#annotations)
- [OpenAPI-aware Frameworks](#openapi-aware-frameworks)
- [Traffic Sniffing](#traffic-sniffing)
- [Move to API Design-first](#move-to-api-design-first)

## Annotations 

The classic approach to the API Code-first workflow is to use code comments (or some other form of annotations) as extensions or plugins to write OpenAPI mixed in with the code it's describing. 

Here's how these annotations look in Go:

```go
// @title           Swagger Example API
// @version         1.0
// @description     This is a sample server celler server.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @host      localhost:8080
// @BasePath  /api/v1

// @securityDefinitions.basic  BasicAuth

func main() {
	r := gin.Default()

	c := controller.NewController()

	v1 := r.Group("/api/v1")
	{
		accounts := v1.Group("/accounts")
		{
			accounts.GET(":id", c.ShowAccount)
			accounts.GET("", c.ListAccounts)
			accounts.POST("", c.AddAccount)
		}
    //...
	}
}
```

Then the schema level descriptions are mixed in with the code responsible for outputting resources like this:

```go
type Account struct {
    ID   int    `json:"id" example:"1"`
    Name string `json:"name" example:"account name"`
}
```

Once the API, endpoints, and resources have all the appropriate annotations there is usually some sort of command you can run to get an OpenAPI document out of it, and that machine-readable document can be used to deploy documentation to Bump.sh or wherever your API documentation lives.

```
swag init --outputTypes yaml

bump deploy swagger.yaml \
  --doc my-documentation-name \
  --token my-documentation-token
```

This approach has been popular for years, with the main selling point being the idea that keeping OpenAPI metadata near the code will hopefully mean developers keep it up to date as they work on the code. This is not always the case, which is one of a few reasons this practice is dying out. 

The other is that many of the annotation tools are stuck on older less useful versions of OpenAPI, namely v2.0 instead of v3.0, or the latest and greatest: v3.1.

- **Go** 
	- [swag](https://github.com/swaggo/swag) (OAS 2.0)
	- [go-swagger](https://github.com/go-swagger/go-swagger) (OAS 2.0)
- **PHP**
	- [Swagger PHP](https://zircote.github.io/swagger-php/) (OAS 3.1 & 3.0)
- **‌Java/Scala** 
	- [Swagger Core](https://github.com/swagger-api/swagger-core) (OAS 3.1 & 3.0)  
- **C#**
	- [NSwag](https://github.com/RicoSuter/NSwag) (OAS 3.0 & 2.0)
	- [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.WebApi) (OAS 2.0)
- **Node.JS**
	- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) (OAS 3.1, 3.0, & 2.0)
  - [express-openapi](https://www.npmjs.com/package/express-openapi) (OAS 3.0, & 2.0)
- **Ruby on Rails**
	- [rswag](https://github.com/rswag/rswag/) (OAS 3.0 & 2.0)
	- [OpenAPI-Rails](https://github.com/slate-studio/openapi-rails) (OAS 2.0)
- **Python**
	- [drf-spectacular](https://github.com/tfranzel/drf-spectacular) (OAS 3.1 & 3.0)
	- Django-REST-Swagger (OAS 2.0, abandoned)
	- Flask-RESTplus (OAS 2.0, abandoned)
- **Spring**
	- [SpringFox](https://github.com/springfox/springfox) (OAS 3.0)

Depending on your language and framework choices you may or may not have an option for working with modern OpenAPI, but the lack of modern tooling has been a driving force in people giving up on this approach and looking for alternative workflows. Let's have a look at some others.

## OpenAPI-aware Frameworks

There's a new breed of API-centric backend application frameworks popping up which take an exciting approach. Instead of asking you to tack the annotations in around the existing codebase, the frameworks simply produce OpenAPI for you from the actual code you're writing. 

Your application is already declaring routes, defining parameters and incoming validation logic, and helping serialize output. It makes a lot of sense for the framework to help produce this machine readable format for you, from the code you're already writing. 

There are not as many tools that work this way, but this is likely to be a trend that continues as OpenAPI becomes the dominant API description format.

- **Go** - [Huma](https://huma.rocks/) ([Guide](/guides/bump-sh-tutorials/huma/))
- **PHP** - [API Platform](https://api-platform.com/) ([Guide](/guides/bump-sh-tutorials/api-platform/))
- **Python** - [FastAPI](https://fastapi.tiangolo.com/) ([Guide](/guides/bump-sh-tutorials/fastapi/))

Just like annotations you can usually run a command to extract the OpenAPI document, or you can run the web server and pull it down over HTTP.

```
$ go run .

$ bump deploy http://127.0.0.1:8888/openapi.yaml \
  --doc my-documentation-name \
  --token my-documentation-token
```

## Traffic Sniffing

If there's no annotations approach, and you have an existing codebase which cannot be rebuilt with one of these OpenAPI-aware application frameworks, there is another powerful option: sniffing web traffic. 

There's [a whole category of tools](https://openapi.tools/#learning) popping up, which refer to this functionality as "Recording" or "Learning". 

Basically you run an instance of your API somewhere (could be local, test, staging, or even production) and put as much web traffic through it as possible. It will then learn how all the requests and responses look, and produce the best composite OpenAPI that it possibly can.

This is mostly useful as a one-off, a way to produce a bunch of OpenAPI that you then manage and maintain yourself, because running this forever is not a sensible workflow and will generally only get things 90% right. You need to do the work to get to 100%, but at least you didn't have to do all of the work of making that initial OpenAPI for an API that already exists. That's going to be arduous, boring, and likely rife with human error.

## Code-first usually needs enhancing

Whether you're generating from annotations, the framework, or HTTP traffic, there's a strong chance that you'll need to put some work in to improve the quality of that OpenAPI. It's going to be missing long form descriptions, the sort of content that tech writers often produce, and depending on the tool used it's probably going to be missing examples too. In order to improve this you can use OpenAPI Overlays to enrich the generated OpenAPI with your own logic, and avoid it being overridden the next time OpenAPI is generated.

## Move to API Design-first

With so many of the annotations approaches being outdated, and people usually unable to rebuild an entire codebase to use a framework that happens to emit OpenAPI, a lot of people have given up on the whole code-first approach. 

This is not just an opinion. Searching around the Go community for code-first tooling, most of the "How do I do Code-first in Go" search results show people talking about how they moved to API Design-first and massively prefer the approach.

The main idea is that instead of writing loads of code and sprinkling in some annotations later to create docs, you create the OpenAPI document before writing any code at all. This is usually in the form of JSON/YAML, but that does not need to be written by hand. There are lots of visual editors to help you build this all up through buttons and forms, with an increasing amount of intelligence to create things. If you're using VS Code then Copilot is actually incredibly good for instance.

Once you have the OpenAPI document you can leverage it at every step of the API lifecycle, producing mock APIs for clients to test assumptions with, produce client libraries without writing any code, make really effective contract testing, even generate backend code to get the application teams started once the contract is all signed off. API Design-first is a bit more work up front with a massive payoff in productivity going forwards and forever.

The main concern with API Design-first is "drift", where the code and schema diverge over time. The annotations approach only pretended to solve this problem, confusing proximity with accuracy. The comments above code could still completely fail to accurately describe the code below, but nobody would ever notice until a user complained about it. 

The OpenAPI-aware Framework approach does solve this by making the code a single source of truth, but the Design-first approach can be used to make any framework OpenAPI aware, with a source of truth that exists before the code, and continues to be useful after the code is built.

Server-side validation with OpenAPI can avoid the need to write lots of request validation, using middleware to compare incoming HTTP requests against the contract defined in the OpenAPI description and automatically return validation errors instead of having to build that all our yourself.

- **Java**
	- [openapi-request-response-validation](https://github.com/gcatanese/openapi-request-response-validation)
- **JavaScript**
	- [express-openapi-validator](https://www.npmjs.com/package/express-openapi-validator)
	- [fastify-openapi-glue](https://www.npmjs.com/package/fastify-openapi-glue)
	- [openapi-enforcer](https://www.npmjs.com/package/openapi-enforcer)
	- [openapi-validator-middleware](https://www.npmjs.com/package/openapi-validator-middleware)
- **Perl**
	- [JSONSchema Validator](https://metacpan.org/pod/JSONSchema::Validator)
- **PHP**
	- [openapi-psr7-validator](https://github.com/thephpleague/openapi-psr7-validator)
- **Ruby**
    - [openapi_first](https://github.com/ahx/openapi_first)
	- [committee](https://rubygems.org/gems/committee)

Responses can be validated using any existing test suite, with all popular testing frameworks supporting OpenAPI by extension. 

- **JavaScript** 
	- [chai-openapi-response-validator](https://www.npmjs.com/package/chai-openapi-response-validator)
	- [jest-openapi](https://www.npmjs.com/package/jest-openapi)
- **PHP**
	- [Spectator](https://github.com/hotmeteor/spectator)
- **Ruby**
	- [openapi_contracts](https://github.com/mkon/openapi_contracts/)

Years ago the API Design-first workflow was a rough approach, but thankfully a whole bunch of tooling developers spent those years making things excellent, and now it's easier than ever. Bump.sh adds to that legacy by adding amazing [change detection](/help/changes-management/), helping check the OpenAPI in your git repository for changes that would be breaking for end users, [letting you know in the pull request](/help/continuous-integration/github-actions/) when there's a problem, providing beyond a shadow of a doubt that having your OpenAPI as a source of truth in a git repository along with your source code is not only handy, but probably the best way to go for many teams. 
