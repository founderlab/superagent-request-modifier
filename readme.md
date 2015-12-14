# superagent-request-modifier

Patch superagent to add headers or queries to each request on a given host.

Use this to e.g. send access tokens with mobile api requests

Usage:
    
    import request from 'superagent'
    import configureModifier from 'superagent-request-modifier'

    configureModifier(request, {hostname: 'localhost', headers: {access_token: 'asdf1234'}})
