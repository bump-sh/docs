# TODO

```yaml
  responses:
    '200':
      description: A list of train stations
      headers:
        RateLimit:
          description: |
            The RateLimit header communicates quota policies. It contains a `limit` to
            convey the expiring limit, `remaining` to convey the remaining quota units,
            and `reset` to convey the time window reset time.
          schema:
            type: string
            examples:
              - limit=10, remaining=0, reset=10

      content:
        application/json:
          schema:
            properties:
              data:
                type: array
                items:
                  $ref: '#/components/schemas/Station'

        application/xml:
          schema:
            allOf:
              data:
                type: array
                xml:
                  name: stations
                  wrapped: true
                items:
                  $ref: '#/components/schemas/Station'

    '400':
      description: Bad Request
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'

        application/problem+xml:
          schema:
            $ref: '#/components/schemas/Problem'
