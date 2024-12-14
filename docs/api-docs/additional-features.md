## Additional Features

### Private API Network (Enterprise)
- Get all elements and folders (`GET /network/private`)
- Add element or folder (`POST /network/private`)
- Update element or folder (`PUT /network/private/{elementType}/{elementId}`)
- Remove element or folder (`DELETE /network/private/{elementType}/{elementId}`)
- Get element add requests (`GET /network/private/network-entity/request/all`)
- Respond to element add request (`PUT /network/private/network-entity/request/{requestId}`)

### Webhooks
- Create webhook (`POST /webhooks`)
  - Custom payload support
  - Collection trigger integration

### Tags (Enterprise)
- Get elements by tag (`GET /tags/{slug}/entities`)
- Get/Update workspace tags (`GET/PUT /workspaces/{workspaceId}/tags`)
- Get/Update collection tags (`GET/PUT /collections/{collectionId}/tags`)
- Get/Update API tags (`GET/PUT /apis/{apiId}/tags`)
