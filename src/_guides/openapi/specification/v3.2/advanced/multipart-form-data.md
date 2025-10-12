---
title: Multipart Form Data
authors: phil
excerpt: Dive into the world of API file uploads in OpenAPI.
date: 2024-08-06
---

- TOC
{:toc}

Multipart form data is a content type used for HTTP requests to send a combination of text and file data in a single request, allowing for one or more uploaded files to be sent with other form fields. 

In the context of an API, using multipart form data enables clients to send files to the server as part of a single API request, avoiding the need for metadata to be uploaded as one request then linking it back to the file somehow. This is handy when building resources that might have an avatar or a cover image, or sending a PDF that needs a name, description, and list of recipients.

```http
POST /upload HTTP/2
Host: api.example.com
Content-Type: multipart/form-data; boundary=--------------------------1234567890

----------------------------1234567890
Content-Disposition: form-data; name="metadata"
Content-Type: application/json

{
  "name": "My PDF Document",
  "recipients": [
    "andy@example.com",
    "sarah@example.com"
  ]
}
----------------------------1234567890
Content-Disposition: form-data; name="description"

This is a long form text field which can also be sent if JSON is not your thing.
----------------------------1234567890
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/octet-stream

[base64 encoded PDF file data]
----------------------------1234567890--
```

OpenAPI supports APIs using multipart form data in `requestBody`, by specifying the `multipart/form-data` content type. 

```yaml
paths:
  /upload:
    post:
      summary: Upload a file
      description: Endpoint to upload a file
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              # ...
                
```

Within the `schema` property of the `requestBody`, you must define the structure of the multipart form data. When boundaries are used to separate segments of the content being transferred, you will need to describe the Content-Types, or you can leave it with the sensible default values:

- If the property is a primitive, or an array of primitive values, the default `Content-Type` is `text/plain`.
- If the property is complex, or an array of complex values, the default `Content-Type` is `application/json`.
- If the property is a `type: string` with a `contentEncoding`, the default `Content-Type` is `application/octet-stream`.


```yaml
  requestBody:
    required: true
    content:
      multipart/form-data:
        schema:
          type: object
          properties:
            # default Content-Type for objects is `application/json`
            metadata: 
              type: object
              properties: 
                name: 
                  type: string
                recipients:
                  type: array
                  items: 
                    type: string
            # Content-Type for application is `text/plain`
            description:
              type: string
            # Content-Type for a string with a contentEncoding set is `application/octet-stream`
            file:
              type: string
              contentEncoding: base64
```


This OpenAPI declares the schema to match the previous HTTP request example, documenting a JSON object with name and recipient array, a plain text description. No content media types had to be defined for either of those segments because OpenAPI will guess them, and usually guess right. The object is assumed to be JSON. The string with no other information is assumed to be plain text.

Other sorts of segments can be a bit tricker, and need a bit of configuration.

## Content Encoding

By default if a string has a `contentEncoding` set, the default will be `application/octet-stream`, which will accept any sort of file. This API would like a PDF but could also accept images and other files, so that's often just fine, and the server can reject invalid files later on.

The `contentEncoding` is there to help define what form the data is in. Some file uploads are base64 encoded, so that can be described with `contentEncoding: base64`. The `contentEncoding` keyword supports all encodings defined in [RFC4648](https://www.rfc-editor.org/rfc/rfc4648), including `"base64"` and `"base64url"`, as well as `"quoted-printable"` from [RFC2045](https://www.rfc-editor.org/rfc/rfc2045) [Section 6.7](https://www.rfc-editor.org/rfc/rfc2045#section-6.7). 

## Content Media Type

When you need to override the default `contentMediaType` assumptions for any of the multipart segments, you can update the schema for that segment to be as specific as you want.

```yaml
  content:
    multipart/form-data:
      schema:
        type: object
        properties:
          # One specific file type, but still text
          csvSpecifically:
            type: string
            contentMediaType: text/csv
          # Either PNG or JPEG, both encoded as base64
          pngOrJpegImage:
            type: string
            contentMediaType: image/png, image/jpeg
            contentEncoding: base64
          # Any image is fine, but it'll be base64
          anyImage:
            type: string
            contentMediaType: image/*
            contentEncoding: base64
```

You can use a single mime type, a comma separated list, or use a wildcard (`*`) to support multiple.

## Encoding Object

The `contentEncoding` and `contentMediaType` keywords should handle most scenarios, but if you need to get even more involved with describing each of the multipart segments, including even the headers on that segment, take a look at the encoding object.

```yaml
requestBody:
  content:
    multipart/form-data:
      schema:
        type: object
        properties:
          id:
            # default is text/plain
            type: string
            format: uuid
          address:
            # default is application/json
            type: object
            properties: {}
          historyMetadata:
            # need to declare XML format!
            description: metadata in XML format
            type: object
            properties: {}
          profileImage: {}
      encoding:
        historyMetadata:
          # require XML Content-Type in utf-8 encoding
          contentType: application/xml; charset=utf-8
        profileImage:
          # only accept png/jpeg
          contentType: image/png, image/jpeg
          headers:
            X-Rate-Limit-Limit:
              description: The number of allowed requests in the current period
              schema:
                type: integer
```

Take a look at the OpenAPI v3.2 Specification to learn more about the [Encoding Object](https://spec.openapis.org/oas/v3.2.0#encoding-object), and see how to handle custom headers and even "styles" and "explode" to handle complex data expressed in a string form.

> Multipart form data is only one way to handle file uploads, so read the [File Uploads](_guides/openapi/specification/v3.2/advanced/file-uploads.md) guide to see other ways to do it.
{: .info }
