---
title: Customize operation URL
categories: [Improvement]
---

OpenAPI provides field `servers` on OperationObject, as an alternative url to service an operation.
> If an alternative server object is specified at the Path Item Object or Root level, it will be overridden by this value. cf [OpenAPI-Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#operationObject)

From now on, Operations `servers` are supported to customize your operations examples (in definition and curl example).
