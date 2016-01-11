# superagent-request-modifier

Patch superagent to add headers or queries to each request on a given host.

Use this to e.g. send access tokens with mobile api requests

##### Usage:

```javascript
import request from 'superagent'
import configureModifier from 'superagent-request-modifier'

// All requests to localhost will have {access_token: 'asdf1234'} added as a header
configureModifier(request, {hostname: 'localhost', headers: {access_token: 'asdf1234'}})

// All requests to example.com will have ?access_token="asdf1234" added to the url as a query string
configureModifier(request, {hostname: 'example.com', query: {access_token: 'asdf1234'}})
```
