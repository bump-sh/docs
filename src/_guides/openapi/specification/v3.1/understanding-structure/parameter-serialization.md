---
title: Parameter Serialization
authors: John Charman
excerpt: Follow through examples of how your parameters will be serialized.
date: 2024-07-04
---

[Parameters](parameters.md) not only define what inputs your API accepts, they also define the format your API expects to receive them in, i.e. how you would like it serialized.

There are two keywords concerning serialization:

## Explode

`explode` defines whether parameters should be broken into logical components.

It takes a boolean value:
- If `true`; a parameter with multiple values will be serialized as if each of its values were separate parameters.  
  - What separates each parameter is determined by the `style`.
- If `false`; a parameter is a single parameter, regardless of how many values it has.

In practice, this means only parameters of `type:array` or `type:object` are affected by `explode`.
- For an array, each value becomes its own parameter.
- For an object, each key-value pair is concatenated into its own parameter as "key=value".
  - For any `style` other than `form`, if the value is an empty string, then it drops the equals and becomes "key"

For a more verbose description of `explode`, refer to [RFC6750's Variable Expansion](https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.1).

Its default value depends on the `style` of serialization:
- `explode:true` is the default for `style:form` 
- `explode:false` for anything else.

## Style

`style` defines how your API expects the parameter to be serialized.  

It takes a string value: The options defined depend on the location your parameter is `in`:
- [`in:path`](#path-parameters) defaults to [`simple`](#simple) but can also be [`label`](#label) or [`matrix`](#matrix).
- [`in:query`](#query-parameters) defaults to [`form`](#form) but can also be [`spaceDelimited`](#space-delimited), [`pipeDelimited`](#pipe-delimited) or [`deepObject`](#deep-object).
- [`in:header`](#header-parameters) defaults to [`simple`](#simple).
- [`in:cookie`](#cookie-parameters) defaults to [`form`](#form).

Each `style` will be explained in more depth per location; examples will make use of the following two parameters.

"pets" which depending on its `type` has one of the following values:

```
bool   -> true
int    -> 2
string -> "dog"
array  -> ["cat","dog"]
object -> {"age":2,"type":"dog"}
```

"hats" which depending on its `type` has one of the following values:

```
bool   -> false
int    -> 1,
string -> "fedora"
array  -> ["fedora"]
object -> {"type":"fedora"}
```

### Path Parameters

For parameters `in:path` there are three defined values for `style`:

- `simple`: defined by [RFC6750's Simple String Expansion](https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.2).
- `label`: defined by [RFC6750's Label Expansion with Dot-Prefix](https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.5).
- `matrix`: defined by [RFC6750's Path-Style Parameter Expansion](https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.7).

The defaults `in:path` are:
- `style:simple`
- `explode:false`

Every `style` `in:path` follows [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750) so the effects of `explode` are well-defined by [RFC6570's Variable Expansion](https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.1). 

#### Simple
`style:simple` with its default of `explode:false`, would serialize your parameters like this:

| `empty` | `bool` | `int` | `string` | `array`    | `object`       |
|---------|--------|-------|----------|------------|----------------|
|         | true   | 2     | dog      | cat,dog    | age,2,type,dog |

- Single values are unchanged.
- An `array` with multiple values is concatenated into a comma-delimited list.
- An `object`has its key-value pairs concatenated into comma-delimited pairs, then each pair is concatenated into a comma-delimited list.

If you set `explode:true`, then the seperator used is also a comma: ",":

| `empty` | `bool` | `int` | `string` | `array`    | `object`       |
|---------|--------|-------|----------|------------|----------------|
|         | true   | 2     | dog      | cat,dog    | age=2,type=dog |

- Single values remain unchanged.
- Surprisingly, an `array` with multiple values seems unchanged. Though it treated each value as a separate parameter, it still had to separate them with a comma. So it still ends up as a comma-delimited list.
- To understand what happened for an `object` looking back at the rules on [`explode`](#explode) we see it concatenates key-value pairs into their own parameters as "key=value". Then it has to separate each parameter with a comma.

#### Label

`style:label` with its default of `explode:false`, would  serialize your parameters like this:

| `empty` | `bool` | `int` | `string` | `array`  | `object`        |
|---------|--------|-------|----------|----------|-----------------|
|         | .true  | .2    | .dog     | .cat,dog | .age,2,type,dog |

Everything is the same as `style:simple` except all parameters were prefixed with ".". 

If you set `explode:true`, then the seperator used is a period: ".":

| `empty` | `bool` | `int` | `string` | `array`  | `object`        |
|---------|--------|-------|----------|----------|-----------------|
|         | .true  | .2    | .dog     | .cat.dog | .age=2.type=dog |

- Single values remain unchanged.
- An `array` becomes a period-delimited list.
- An `object` concatenates key-value pairs into their own parameters as "key=value". Then it separates each parameter with a period.

#### Matrix

`style:matrix` with its default of `explode:false`, would  serialize your parameters like this:

| `empty` | `bool`     | `int`   | `string`  | `array`       | `object`             |
|---------|------------|---------|-----------|---------------|----------------------|
|         | ;pets=true | ;pets=2 | ;pets=dog | ;pets=cat,dog | ;pets=age,2,type,dog |

Everything is the same as `style:simple` except all parameters were prefixed with a semicolon: ";pets=" where "pets" is the parameter's name.

If you set `explode:true`, then the seperator used is a semicolon: ";".

| `empty` | `bool`     | `int`   | `string`  | `array`            | `object`        |
|---------|------------|---------|-----------|--------------------|-----------------|
|         | ;pets=true | ;pets=2 | ;pets=dog | ;pets=cat;pets=dog | ;age=2;type=dog |

- Single values remain unchanged.
- An `array` has its values treated as separate parameters. Because they're now treated separately, every value is prefixed with ";pets="
- An `object` is the exception, it does not get prefixed with "pets=", but it still has to separated by a semicolon: ";".

### Query Parameters

For parameters `in:query` there are four defined values for `style`.

- `form`: It is defined by [RFC6750's Form-Style Query Expansion](https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.8), if there are multiple 
- `spaceDelimited`: An addition by popular demand.
- `pipeDelimited`: An addition by popular demand.
- `deepObject`: An addition by popular demand.

The defaults `in:query` are:
- `style:form`
- `explode:true`

Only `style:form` follows [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750) so the effects of `explode` are only well-defined by [RFC6570's Variable Expansion](https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.1) for `style:form`. 

An informal, general rule of thumb is:
- Query strings start with a question-mark, this is how you separate the first `query` parameter from the rest of the URI.
- Subsequent parameters `in:query` are separated by an ampersand "&".

Just be aware that `spaceDelimited`, `pipeDelimited` and `deepObject` are not defined by [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750).
There are caveats to their usage, if you intend to use them, make sure you read their sections carefully.

#### Form

With `style:form`, if you set `explode:false`, would serialize your parameters like this:

| `empty` | `bool`                | `int`          | `string`              | `array`                   | `object`                              |
|---------|-----------------------|----------------|-----------------------|---------------------------|---------------------------------------|
|         | ?pets=true            | ?pets=2        | ?pets=dog             | ?pets=cat,dog             | ?pets=age,2,type,dog                  |
|         | ?pets=true&hats=false | ?pets=2&hats=1 | ?pets=dog&hats=fedora | ?pets=cat,dog&hats=fedora | ?pets=age,2,type,dog&hats=type,fedora |

You'll notice this looks almost identical to [`style:matrix`](#matrix). 
There's only one difference to be
  - If it's the first parameter, the separator from the rest of the URI by a question-mark like above `?pets=true`
  - If it's the second parameter, the separator is an ampersand, you might have a query string like this `?hats=false&pets=true`

If you stick with the default of `explode:true`, then the seperator used is also a comma: ",":

| `empty` | `bool`                | `int`          | `string`              | `array`                        | `object`                                                   |
|---------|-----------------------|----------------|-----------------------|--------------------------------|------------------------------------------------------------|
|         | ?pets=true            | ?pets=2        | ?pets=dog             | ?pets=cat&pets=dog             | ?age=2&type=dog                                            |
|         | ?pets=true&hats=false | ?pets=2&hats=1 | ?pets=dog&hats=fedora | ?pets=cat&pets=dog&hats=fedora | <span style="color:red">?age=2&type=dog&type=fedora</span> |

Notice one example is highlighted in red. The OpenAPI Specification states that [A Unique Parameter](https://spec.openapis.org/oas/latest.html#parameter-object) is a combination of `name` and (`in`).
Both "pets" and "hats" would be considered unique parameters, but they both have the property "type". When `explode` is `true` their properties are serialized as if they were separate parameters. It is as if we have two different parameters both with `name:type`, `in:query`, they are no longer unique and one cannot be unambiguously distinguished from the other. 

This conflict is entirely avoided if you explicitly set `explode:false` on parameters of `type:object`, but if that's not an option, remain vigil for possible conflicts.

#### Space Delimited

`style:spaceDelimited` with its default of `explode:false`, would  serialize your parameters like this:

| `array`                     | `object`                                      |
|-----------------------------|-----------------------------------------------|
| ?pets=cat%20dog             | ?pets=age%202%20type%20dog                    |
| ?pets=cat%20dog&hats=fedora | ?pets=age%202%20type%20dog&hats=type%20fedora |

It's basically identical to `style:form` with `explode:false`. The difference being, the separator used is not a comma, but a percent-encoded space "%20".

You'll notice there are no examples for any `type` that would be a single value. This is because its behaviour is undefined for single values. One could assume it would be identical to `style:form`, but if your parameter is going to be a single value, there is no need to explicitly define it as `spaceDelimited`.

`style:spaceDelimited` is not defined by [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750) and there is no defined behaviour for `explode:true`. You could assume it would be identical to the well-defined `in:query` default of `style:form` with `explode:true`. That said, if you're making that assumption, you're better off leaving it on the well-defined default.

#### Pipe Delimited

`style:pipeDelimited` with its default of `explode:false`, would  serialize your parameters like this:

| `array`                     | `object`                                      |
|-----------------------------|-----------------------------------------------|
| ?pets=cat%7Cdog             | ?pets=age%7C2%7Ctype%7Cdog                    |
| ?pets=cat%7Cdog&hats=fedora | ?pets=age%7C2%7Ctype%7Cdog&hats=type%7Cfedora |

It's basically identical to `style:form` with `explode:false`. The difference being, the separator used is not a comma, but a percent-encoded pipe "%7C". You may be able to use a normal pipe "|" but it is not in the list of [RFC3986's Unreserved Characters](https://datatracker.ietf.org/doc/html/rfc3986#section-2.3). As such, it may work in some environments, and not in others.

You'll notice there are no examples for any `type` that would be a single value. This is because its behaviour is undefined for single values. One could assume it would be identical to `style:form`, but if your parameter is going to be a single value, there is no need to explicitly define it as `spaceDelimited`.

`style:pipeDelimited` is not defined by [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750) and there is no defined behaviour for `explode:true`. You could assume it would be identical to the well-defined `in:query` default of `style:form` with `explode:true`. That said, if you're making that assumption, you're better off leaving it on the well-defined default.

#### Deep Object

`style:deepObject` is undefined for its default of `explode:false`. You must explicitly specify `explode:true` for any defined behaviour.

You may be able to use a normal square brackets "[" and "]" but they are in the list of [RFC3986's Reserved Characters](https://datatracker.ietf.org/doc/html/rfc3986#section-2.2). As such, it may not work in some environments. For maximum interoperability it is safer to have them percent-encoded:
- "%5B" for "[" 
- "%5D" for "]".

| `object`                                                  |
|-----------------------------------------------------------|
| ?pets%5Bage%5D=2&pets%5Btype%5D=dog                       |
| ?pets%5Bage%5D=2&pets%5Btype%5D=dog&hats%5Btype%5D=fedora |

Unsurprisingly, it only has defined behaviour for an `object`. This `style` is quite different from any other, even with `explode:true` the `name`, key and value are all specified. This makes it useful for avoiding the potential name conflicts objects could cause with `style:form`, `explode:true`. 

Just bear in mind the name is misleading, despite being called a `deepObject`, there is no defined behaviour for nested arrays or objects. This is the same for every `style` `in:query`.

### Header Parameters

For parameters `in:header` there is only one defined value for `style`: `simple`. 

Naturally, the default value is `style:simple`, with `explode:false`.

It is the [same definition as it would be `in:path`](#simple) except there is a major caveat to be aware of:
- Headers do not require any percent encoding in the same way a URI string would, so it cannot follow the same definitions laid out by [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750).

For this reason it is not recommended to rely on `style`, `explode` and `schema`. 

For parameters `in:header` it is recommended to make use of the parameter's `content` field instead of `schema`. Then use a media type such as `text/plain` and require the application to assemble the correct string. This will be the recommended approach as of OpenAPI Version 3.1.1, with more detail available in Appendix D: Serializing Headers and Cookies.

### Cookie Parameters

For parameters `in:cookie` there is only one defined value for `style`: `form`.

Naturally, the default value is `style:form`, with `explode:true`.

It is the [same definition as it would be `in:query`](#form) except there are several major caveats to be aware of:
- Cookies do not require any percent encoding in the same way a URI string would, so it cannot follow the same definitions laid out by [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750).
- The first parameter is not prefixed with a question-mark "?" like it would `in:query`.
- Any subsequent parameters are not separated by an ampersand "&" like they would `in:query`.
  - Subsequent parameters `in:cookie` are separated by a semicolon followed by a space "; ".

As such `style:form` `in:cookie` is somewhat confusing, and less accurate the more parameters you have to serialize. For this reason it is not recommended to rely on `style`, `explode` and `schema`. 

For parameters `in:cookie` it is recommended to make use of the parameter's `content` field instead of `schema`. Then use a media type such as `text/plain` and require the application to assemble the correct string. This will be the recommended approach as of OpenAPI Version 3.1.1, with more detail available in Appendix D: Serializing Headers and Cookies.
