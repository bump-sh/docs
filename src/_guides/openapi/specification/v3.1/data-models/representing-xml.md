---
title: Representing XML
authors: phil
excerpt: OpenAPI can describe XML APIs with a little work, learn how!
date: 2024-07-24
---

- TOC
{:toc}

OpenAPI is set up with the assumption that you're most likely describing JSON, because that's what over 80% of APIs are using, but XML is still in the game and you could be using both in the same API. OpenAPI supports this with the `xml` keyword, which helps when XML output is using XML-specific syntax like attributes and wrapped arrays.

By combining [schema composition](_guides/openapi/specification/v3.1/data-models/schema-composition.md) and [references](_guides/openapi/specification/v3.1/advanced/splitting-documents-with-ref.md), it's possible to create reusable components that be used for both JSON and XML output, like this simplistic example below.

```yaml
openapi: 3.1.0
info:
  title: Representing XML
  description: An API that supports advanced XML
  version: 1.0.0
paths:
  /stations:
    get:
      description: Get a list of train stations
      operationId: get-stations
      responses:
        '200':
          description: OK
          content:
            application/xml:
              schema:
                $ref: '#/components/schemas/Stations'
components:
  schemas:
    Stations:
      type: array
      items:
        $ref: "#/components/schemas/Station"

    Station:
      type: object
      xml:
        name: stations
      properties:
        id:
          type: string
          format: uuid
          examples:
          - b2e783e1-c824-4d63-b37a-d8d698862f1d
        name:
          type: string
          description: The name of the station
          examples:
          - Paris Gare du Nord
        address:
          type: string
          examples:
          - 18 Rue de Dunkerque 75010 Paris, France
        country_code:
          type: string
          format: iso-country-code
          examples:
          - FR
```

This OpenAPI would be used to describe XML data that looked like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Station xmlns="http://example.com/xml/namespace">
  <id>b2e783e1-c824-4d63-b37a-d8d698862f1d</id>
  <name>Paris Gare du Nord</name>
  <address>18 Rue de Dunkerque 75010 Paris, France</address>
  <country_code>FR</country_code>
</Station>
```

When using `$ref` and components like this, most tools will grab the tag name from the $ref, which is how we got `Stations`.

If you want to control that name, you can set the `xml.name` keyword on the schema, and change it.

```yaml
components:
  schemas:
   Stations:
      type: array
      items:
        $ref: "#/components/schemas/Station"

    Station:
      type: object
      xml:
        name: station
      properties:
        # ...
```

```
<?xml version="1.0" encoding="UTF-8"?>
<station>
	<id>b2e783e1-c824-4d63-b37a-d8d698862f1d</id>
	<name>Paris Gare du Nord</name>
	<address>18 Rue de Dunkerque 75010 Paris, France</address>
	<country_code>FR</country_code>
</station>
```

Better! Lowercase looks better, now lets get it wrapped in a tag so we can have multiple using the `xml.wrapped` property.

```yaml
components:
  schemas:
    Stations:
      type: array
      xml:
        name: data
        wrapped: true
      items:
        $ref: "#/components/schemas/Station"

    Station:
      type: object
      xml:
        name: station
```

That looks like this: 


```xml
<?xml version="1.0" encoding="UTF-8"?>
<data>
	<station>
		<id>b2e783e1-c824-4d63-b37a-d8d698862f1d</id>
		<name>Paris Gare du Nord</name>
		<address>18 Rue de Dunkerque 75010 Paris, France</address>
		<country_code>FR</country_code>
	</station>
</data>
```

Now the XML looks a bit more ready for action, but if that's not enough to get your API and OpenAPI on the same page about your XML structure there are plenty of keywords to play with:

## The XML Object

Inside the `xml` object you can use any of these keywords:

- **name:** (string) Replaces the name of the element/attribute used for the described schema property. When defined within items, it will affect the name of the individual XML elements within the list. When defined alongside type being array (outside the items), it will affect the wrapping element and only if wrapped is `true`. If wrapped is `false`, it will be ignored.
- **namespace:** (string) The URI of the namespace definition. This MUST be in the form of an absolute URI.
- **prefix:** (string) The prefix to be used for the name.
- **attribute:** (boolean) Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
- **wrapped:** (boolean) MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside type being array (outside the items).
 
## Examples of the XML Object

Here are a few examples of how the `xml` object can be used in OpenAPI.

### Changing the Element Name

You can use the `name` keyword to change the name of a single property too. for example changing the name of the id property in XML only.

```yaml
components:
  schemas:
    Station:
      type: object
      properties:
        id:
          type: string
          format: uuid
          xml:
            name: stationId
        ...
```

This will result in the following XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<station>
  <stationId>b2e783e1-c824-4d63-b37a-d8d698862f1d</stationId>
  ...
</station>
```

### Using Namespaces

If you need to define a namespace for your XML elements, you can use the `namespace` keyword. Here's an example:

```yaml
components:
  schemas:
    Stations:
      type: array
      xml:
        name: data
        namespace: http://example.com/xml/namespace
        wrapped: true
        # ...
```

The resulting XML will include the namespace declaration:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<data xmlns="http://example.com/xml/namespace">
	<station>
    ...
```

### Using Attributes

To define an XML attribute instead of an element, you can use the `attribute` keyword. Here's an example:

```yaml
components:
  schemas:
    Stations:
      type: array
      xml:
        name: data
        wrapped: true
      items:
        $ref: "#/components/schemas/Station"

    Station:
      type: object
      xml:
        name: station
      properties:
        id:
          type: string
          format: uuid
          xml:
            attribute: true
        # ...
```

This will result in the following XML, where the `id` is now an attribute:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<data>
	<station id="b2e783e1-c824-4d63-b37a-d8d698862f1d">
		<name>Paris Gare du Nord</name>
		<address>18 Rue de Dunkerque 75010 Paris, France</address>
		<country_code>FR</country_code>
	</station>
</data>
```

These are just a few examples of how you can use the `xml` object in OpenAPI to customize the representation of XML data. Explore all the options and see how it looks in various API documentation tools until you get the hang of it.
