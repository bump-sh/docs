# What is a reference?

A reference can be either a pointer to another part of your current specification or a pointer to an external file or URL. This lets you re-use part of a specification instead of duplicating it across your file(s).

A reference is always described as follows in YAML:

```yaml
$ref: path/to/reference
```

You should note that OpenAPI and AsyncAPI specifications don't allow you to use references anywhere. However, Bump will resolve all the references found in your files, even if you didn't respect your specification.

# The two types of references

## Internal references

Use this when you want to point to another part of your current file. Internal references always start with `#/`.

Example:

```yaml
paths:
  /ping:
    description: Test your API status
    responses:
      200:
        $ref: "#/responses/pong"
```

Internal references are always expanded by Bump. If a reference points on an empty path, the reference is just ignored.

## External references

Using external references is particularly useful as it can point to external resources like full definitions, components, models, etc... External references let you reuse your components across multiple projects without duplicating your specification code.

You can find two kinds of external reference locations supported by Bump:

- URI: a resource hosted online and accessible through HTTP
- File system path: a resource located on the same file system as your definition

```yaml
# URI
$ref: https://example.com/api/specification.yml

# File system path
$ref: ./models/user.yml
```

Bump supports absolute and relative paths for file system references.

An external reference can also point to a subpart of the resource by adding a relative path after the absolute location:

```yaml
# URI
$ref: https://example.com/api.yml#/models/user

# File system path
$ref: ./models.yml#/user
```

You can use recursive references if needed but we limit up to 5 recursive reference maximum.

# How to deploy a specification with external references

Bump does support external references from any channel, so you can deploy a specification including them through the web app, the CLI, our GitHub action, or our API.

Some limitations apply when using the web application though. Only references pointing to resources accessible by our servers will be resolved. This means that **file system paths and protected URI will be ignored**.

If you need to deploy a specification using this kind of external references, please use [our CLI](undefined) or our [GitHub Action](undefined)

