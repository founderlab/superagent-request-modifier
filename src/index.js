import _ from 'lodash'

class RequestModifier {
  constructor(options={}) {
    this.queries = options.queries || {}
    this.headers = options.headers || {}
    this.hostname = options.hostname
  }

  setQuery(attributes, value) {
    let attrs = {}
    if (arguments.length === 2) attrs[attributes] = value
    else attrs = attributes
    _.extend(this.queries, attrs)
  }

  setHeader(attributes, value) {
    let attrs = {}
    if (arguments.length === 2) attrs[attributes] = value
    else attrs = attributes
    _.extend(this.headers, attrs)
  }

  owns(url) {
    this.re = this.re || new RegExp(`\/\/${this.hostname}`)
    return this.re.test(url)
  }

  reset() {
    this.queries = {}
    this.headers = {}
  }
}

let requestModifier = null
export default function configure(superagent, options) {
  requestModifier = new RequestModifier(options)

  // Patch superagents .end()
  const __originalSuperAgentEnd = superagent.Request.prototype.end
  superagent.Request.prototype.end = function end(...args) {
    if (requestModifier.owns(this.url)) {

      // add queries
      if (_.size(requestModifier.queries)) {
        const queries = {}

        for (const key in requestModifier.queries) {
          if (!this.url.match(new RegExp(`[?&]${key}`))) {
            const val = requestModifier.queries[key]
            queries[key] = _.isString(val) ? val : JSON.stringify(val)
          }
        }

        this.query(queries)
      }
      // add headers
      if (_.size(requestModifier.headers)) this.set(requestModifier.headers)
    }
    __originalSuperAgentEnd.apply(this, args)
  }

  return requestModifier
}
