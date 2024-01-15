---
title: Deploying docs from Huma
authors: phil
excerpt: Generating OpenAPI for Go APIs
---

[Huma](https://huma.rocks/) is a Golang framework that allows you to create APIs, and automatically generates their documentation, based on the OpenAPI specification.

## Deploying docs from your local machine

The following assumes your local machine is configured with Golang and you have a Huma app running on your local machine, and that your main file is named `main.go`. If you don't have a Huma app set up, follow their [Your First API guide](https://huma.rocks/tutorial/your-first-api/).

1. [Create and name](https://bump.sh/docs/new?utm_source=bump&utm_medium=content_hub&utm_campaign=getting_started) your first API documentation. Then, retrieve the name and token of this documentation from the _CI deployment_ settings page.

2. Install the Bump.sh CLI with [npm](https://docs.npmjs.com/cli/v9/configuring-npm/install?v=true) as below, or use [alternative options](/help/bump-cli), with
  ```bash
  npm install -g bump-cli
  ```

3. Launch your local server with
  ```bash
  go run .
  ```
  This will run not only the application, but it will make API documentation available on <http://127.0.0.1:8000/>.

4. Deploy your doc to Bump.sh.
  ```bash
  bump deploy http://localhost:8888/openapi.yaml \
    --doc my-documentation-name \
    --token my-documentation-token
  ```

## Export OpenAPI for Continuous Integration

Running a web server and deploying that to Bump.sh might be ok locally, but if you'd like to automate everything properly it might become complicated to run an entire server instance on something like GitHub Actions. Let's skip that, and configure Huma to output OpenAPI via a CLI Command.

It's actually designed to do this, and whilst it's not documented currently there is [an example](https://github.com/danielgtaylor/huma/blob/main/examples/spec-cmd/main.go) in the codebase:

Here's the important part:

```go
	cli.Root().AddCommand(&cobra.Command{
		Use:   "openapi",
		Short: "Print the OpenAPI description",
		Run: func(cmd *cobra.Command, args []string) {
			b, _ := yaml.Marshal(api.OpenAPI())
			fmt.Println(string(b))
		},
	})
```

To get this set up you can replace the standard `main.go` with something more like this:

```go
package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	"github.com/goccy/go-yaml"
	"github.com/spf13/cobra"
)

// Options for the CLI.
type Options struct {
	Port int `help:"Port to listen on" default:"8888"`
}

// GreetingInput represents the greeting operation request.
type GreetingInput struct {
	Name string `path:"name" maxLength:"30" example:"world" doc:"Name to greet"`
}

// GreetingOutput represents the greeting operation response.
type GreetingOutput struct {
	Body struct {
		Message string `json:"message" example:"Hello, world!" doc:"Greeting message"`
	}
}

func main() {
	// Store the API so we can access it from other commands later.
	var api huma.API

	// Create a CLI app which takes a port option.
	cli := huma.NewCLI(func(hooks huma.Hooks, options *Options) {
		// Create a new router & API
		router := chi.NewMux()
		api = humachi.New(router, huma.DefaultConfig("My API", "1.0.0"))

		// Register GET /greeting/{name}
		huma.Register(api, huma.Operation{
			OperationID: "get-greeting",
			Summary:     "Get a greeting",
			Method:      http.MethodGet,
			Path:        "/greeting/{name}",
		}, func(ctx context.Context, input *GreetingInput) (*GreetingOutput, error) {
			resp := &GreetingOutput{}
			resp.Body.Message = fmt.Sprintf("Hello, %s!", input.Name)
			return resp, nil
		})

		// Tell the CLI how to start your router.
		hooks.OnStart(func() {
			http.ListenAndServe(fmt.Sprintf(":%d", options.Port), router)
		})
	})

	// Add a command to print the OpenAPI description
	cli.Root().AddCommand(&cobra.Command{
		Use:   "openapi",
		Short: "Print the OpenAPI description",
		Run: func(cmd *cobra.Command, args []string) {
			b, _ := yaml.Marshal(api.OpenAPI())
			fmt.Println(string(b))
		},
	})

	// Run the CLI. When passed no commands, it starts the server.
	cli.Run()
}
```

Once this is set up you can use these commands to work with the OpenAPI without needing to run a web server:

```
# Output OpenAPI description to terminal
go run . openapi

# Save OpenAPI description to a file
go run . openapi > openapi.yaml
```

Deploying to Bump.sh automatically through GitHub Actions now only involves running this command and pointing to the OpenAPI you created. This example will do both the deployment and the diff checking, but you can pick one or the other, or keep both.

```yaml
name: Check & deploy API documentation
permissions:
  contents: read
  pull-requests: write
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  deploy-doc:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v5

      - name: Export OpenAPI to file
        run: go run . openapi > openapi.yaml

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: go-hello-openapi
          token: ${{secrets.BUMP_TOKEN}}
          file: openapi.yaml

  api-diff:
    if: ${{ github.event_name == 'pull_request' }}
    name: Check API diff on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Set up Go
        uses: actions/setup-go@v5
      
      - name: Export OpenAPI to file
        run: go run . openapi > openapi.yaml

      - name: Comment pull request with API diff
        uses: bump-sh/github-action@v1
        with:
          doc: go-hello-openapi
          token: ${{secrets.BUMP_TOKEN}}
          file: openapi.yaml
          command: diff
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

That's it! Enjoy the comfort of Bump.sh to browse through your API doc, and [customize it to your needs](/help/getting-started/quick-start#customization-options).
