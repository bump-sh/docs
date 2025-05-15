---
title: Uploading a File
authors: phil
excerpt: Dive into the world of API file uploads in OpenAPI.
date: 2024-08-07
---

- TOC
{:toc}

APIs can handle file uploads in a variety of ways, and OpenAPI can help you describe any of them. The two most common methods are directly accepting the file based on the content-type of the request, e.g.: a HTTP request with `image/png`, `image/jpeg`, `text/csv`, etc., or a HTTP request with a `multipart/form-data` content type which allows you to combine text and file data in a single request. 

Here's an example of accepting a CSV file being directly passed in the request body, showing how the HTTP request would look, then how that would be described in OpenAPI v3.1.

```http
GET /upload HTTP/1.1
Host: api.example.org
Content-Type: text/csv

Planted On,Longitude,Latitude,Unit Type,Species
4/1/23,-3.88628,56.17454,tree,Aspen
4/1/23,-3.8863,56.17455,tree,Silver Birch
```

```yaml
paths:
  /upload:
    post:
      summary: Upload a CSV file
      requestBody:
        required: true
        content:
          text/csv: {}
```

The `text/csv` does not need to declare a schema if its transferred in a binary (octet-stream), as that is the default. The same goes for images.

```yaml
content:
    image/png:
        schema:
            type: string
            contentMediaType: image/png
            contentEncoding: base64
```

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
              type: object
              properties:
                file:
                  type: string
                  contentMediaType: text/csv
```

In this example, the `requestBody` object specifies that the request body is required and should be in the `multipart/form-data` format. The schema defines an object with a single property `file`, which represents the uploaded file. The `type` is set to `string` and the `format` is set to `binary` to indicate that it is a binary file.

To upload images and a CSV file using the `contentEncoding` keyword, you can modify the schema as follows:

```yaml
paths:
  /upload:
    post:
      summary: Upload files
      description: Endpoint to upload images and a CSV file
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image1:
                  type: string
                  format: binary
                  contentEncoding: base64
                image2:
                  type: string
                  format: binary
                  contentEncoding: base64
                csv:
                  type: string
                  contentMediaType: text/csv
```

In this updated example, the schema includes three properties: `image1`, `image2`, and `csv`. Each property has the `type` set to `string`, the `format` set to `binary`, and the `contentEncoding` set to `base64`. This allows you to upload images and a CSV file encoded in base64.

Remember to adjust the endpoint path and other details according to your specific API requirements.
