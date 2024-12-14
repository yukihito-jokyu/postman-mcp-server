## Security Features

### API Security Validation
- API definition security validation (`POST /security/api-validation`)
  - OWASP security rules integration
  - Maximum definition size: 10 MB
  - Automated schema validation

### Secret Scanner (Enterprise)
- Get secret types (`GET /secret-types`)
- Search detected secrets (`POST /detected-secrets-queries`)
- Update secret resolution status (`PUT /detected-secrets/{secretId}`)
- Get detected secrets locations (`GET /detected-secrets/{secretId}/locations`)

### Audit Logs (Enterprise)
- Get team audit logs (`GET /audit/logs`)
  - Comprehensive event tracking
  - Filtering by date range
  - Pagination support
