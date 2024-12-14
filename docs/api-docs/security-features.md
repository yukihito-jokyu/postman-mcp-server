## Security Features

### API Security Validation
- API definition security validation (`POST /security/api-validation`)
  - Note:
    - Maximum definition size: 10 MB
    - Requires imported and enabled OWASP security rules
  - Responses:
    - 200: `#/components/responses/schemaSecurityValidation`
    - 400: `#/components/responses/schemaSecurityValidation400Error`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/featureUnavailable403Error`
    - 500: `#/components/responses/common500ErrorServerError`

### Secret Scanner (Enterprise)
- Get secret types (`GET /secret-types`)
  - Responses:
    - 200: `#/components/responses/getSecretTypes`
    - 401: `#/components/responses/secretScanner401Error`
    - 403: `#/components/responses/secretScanner403ErrorAndFeatureUnavailable`
    - 500: `#/components/responses/secretScanner500Error`

- Search detected secrets (`POST /detected-secrets-queries`)
  - Parameters:
    - `#/components/parameters/limit`
    - `#/components/parameters/cursor`
    - `#/components/parameters/include`
    - `#/components/parameters/since`
    - `#/components/parameters/until`
  - Responses:
    - 200: `#/components/responses/detectedSecretsQueries`
    - 400: `#/components/responses/detectedSecretsQuery400Errors`
    - 401: `#/components/responses/secretScanner401Error`
    - 403: `#/components/responses/secretScanner403ErrorAndFeatureUnavailable`
    - 500: `#/components/responses/secretScanner500Error`

- Update secret resolution status (`PUT /detected-secrets/{secretId}`)
  - Parameters:
    - `#/components/parameters/secretId` (required)
  - Responses:
    - 200: `#/components/responses/updateSecretResolutions`
    - 400: `#/components/responses/secretScanner400InvalidResolutionError`
    - 401: `#/components/responses/secretScanner401Error`
    - 403: `#/components/responses/secretScanner403ErrorAndFeatureUnavailable`
    - 500: `#/components/responses/secretScanner500Error`

- Get detected secrets locations (`GET /detected-secrets/{secretId}/locations`)
  - Parameters:
    - `#/components/parameters/secretId` (required)
    - `#/components/parameters/limit`
    - `#/components/parameters/cursor`
    - `#/components/parameters/workspaceIdQueryTrue`
    - `#/components/parameters/since`
    - `#/components/parameters/until`
    - `#/components/parameters/resourceType`
  - Responses:
    - 200: `#/components/responses/getSecretsLocations`
    - 400: `#/components/responses/secretScanner400Error`
    - 401: `#/components/responses/secretScanner401Error`
    - 403: `#/components/responses/secretScanner403ErrorAndFeatureUnavailable`
    - 500: `#/components/responses/secretScanner500Error`

### Audit Logs (Enterprise)
- Get team audit logs (`GET /audit/logs`)
  - Parameters:
    - `#/components/parameters/auditLogsSinceQuery`
    - `#/components/parameters/auditLogsUntilQuery`
    - `#/components/parameters/auditLogsLimitQuery`
    - `#/components/parameters/cursor`
    - `#/components/parameters/auditLogsOrderBy`
  - Responses:
    - 200: `#/components/responses/getAuditLogs`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`
