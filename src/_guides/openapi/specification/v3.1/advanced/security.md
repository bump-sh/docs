```yaml
components:
  securitySchemes:
    # API Key Authentication
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key
    ApiKeyCookie:
      type: apiKey
      in: cookie
      name: key
    
    # HTTP Authentication
    HttpBasicAuth:
      type: http
      scheme: basic
    JWT:
      type: http
      scheme: bearer
      bearerFormat: JWT
   
    # OAuth 2.0 Authentication
    OAuth2ReadWrite:
      type: oauth2
      flows:
        authorizationCode:
          scopes:
            read: Grants read access
            write: Grants write access
          authorizationUrl: https://example.com/oauth/authorize
          tokenUrl: https://example.com/oauth/token
          refreshUrl: https://example.com/oauth/refresh
```
