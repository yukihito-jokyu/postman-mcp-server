## Mocks

### Implemented Operations
- Get all mock servers (`GET /mocks`)
- Create mock server (`POST /mocks`)
- Get specific mock server (`GET /mocks/{mockId}`)
- Update mock server (`PUT /mocks/{mockId}`)
- Delete mock server (`DELETE /mocks/{mockId}`)
- Get mock call logs (`GET /mocks/{mockId}/call-logs`)
- Publish mock server (`POST /mocks/{mockId}/publish`)
- Unpublish mock server (`DELETE /mocks/{mockId}/unpublish`)

#### Server Responses
- Get all server responses (`GET /mocks/{mockId}/server-responses`)
- Create server response (`POST /mocks/{mockId}/server-responses`)
- Get server response (`GET /mocks/{mockId}/server-responses/{serverResponseId}`)
- Update server response (`PUT /mocks/{mockId}/server-responses/{serverResponseId}`)
- Delete server response (`DELETE /mocks/{mockId}/server-responses/{serverResponseId}`)

### Key Features
- Mock server management
- Call logging and history
- Custom server responses
- Public/private visibility control
- Response simulation (5xx errors)
