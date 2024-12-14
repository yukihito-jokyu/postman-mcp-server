## Mocks

### Implemented Operations
- Get all mock servers (`GET /mocks`)
  - Parameters:
    - `#/components/parameters/teamIdResultsQuery`
    - `#/components/parameters/workspaceResultsQuery`
  - Responses:
    - 200: `#/components/responses/getMocks`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Create mock server (`POST /mocks`)
  - Parameters:
    - `#/components/parameters/workspaceIdQuery`
  - Responses:
    - 200: `#/components/responses/mockCreateUpdate`
    - 400: `#/components/responses/paramMissing400Error`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Get specific mock server (`GET /mocks/{mockId}`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
  - Responses:
    - 200: `#/components/responses/getMock`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

- Update mock server (`PUT /mocks/{mockId}`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
  - Responses:
    - 200: `#/components/responses/mockCreateUpdate`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

- Delete mock server (`DELETE /mocks/{mockId}`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
  - Responses:
    - 200: `#/components/responses/deleteMock`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

- Get mock call logs (`GET /mocks/{mockId}/call-logs`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
    - `#/components/parameters/limitDefault100`
    - `#/components/parameters/cursor`
    - `#/components/parameters/until`
    - `#/components/parameters/since`
    - `#/components/parameters/mockResponseStatusCode`
    - `#/components/parameters/mockResponseType`
    - `#/components/parameters/mockRequestMethod`
    - `#/components/parameters/mockRequestPath`
    - `#/components/parameters/mockSortServedAt`
    - `#/components/parameters/direction`
    - `#/components/parameters/mockInclude`
  - Responses:
    - 200: `#/components/responses/getMockCallLogs`
    - 400: `#/components/responses/mock400ErrorLogRetentionPeriodExceeded`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

- Publish mock server (`POST /mocks/{mockId}/publish`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
  - Responses:
    - 200: `#/components/responses/publishMock`
    - 400: `#/components/responses/mock400ErrorAlreadyPublished`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

- Unpublish mock server (`DELETE /mocks/{mockId}/unpublish`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
  - Responses:
    - 200: `#/components/responses/unpublishMock`
    - 400: `#/components/responses/mock400ErrorAlreadyUnpublished`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

#### Server Responses
- Get all server responses (`GET /mocks/{mockId}/server-responses`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
  - Responses:
    - 200: `#/components/responses/getMockServerResponses`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

- Create server response (`POST /mocks/{mockId}/server-responses`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
  - Responses:
    - 200: `#/components/responses/mockServerResponse`
    - 400: `#/components/responses/paramMissing400Error`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Get server response (`GET /mocks/{mockId}/server-responses/{serverResponseId}`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
    - `#/components/parameters/serverResponseId` (required)
  - Responses:
    - 200: `#/components/responses/mockServerResponse`
    - 400: `#/components/responses/serverResponseNotFound400Error`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

- Update server response (`PUT /mocks/{mockId}/server-responses/{serverResponseId}`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
    - `#/components/parameters/serverResponseId` (required)
  - Responses:
    - 200: `#/components/responses/mockServerResponse`
    - 400: `#/components/responses/paramMissing400Error`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Delete server response (`DELETE /mocks/{mockId}/server-responses/{serverResponseId}`)
  - Parameters:
    - `#/components/parameters/mockId` (required)
    - `#/components/parameters/serverResponseId` (required)
  - Responses:
    - 200: `#/components/responses/deleteMockServerResponse`
    - 400: `#/components/responses/serverResponseNotFound400Error`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/mock400ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

### Key Features
- Mock server management
- Call logging and history
- Custom server responses
- Public/private visibility control
- Response simulation (5xx errors)
