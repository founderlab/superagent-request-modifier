import extend from 'lodash/object/extend'
import size from 'lodash/collection/size'
import isString from 'lodash/lang/isString'

class RequestModifier {
  constructor(options) {
    this.queries = options.queries || {}
    this.headers = options.headers || {}
    this.hostname = options.hostname
  }

  setQuery(attributes, value) {
    let attrs = {}
    if (arguments.length === 2) attrs[attributes] = value
    else attrs = attributes
    extend(this.queries, attrs)
  }

  setHeader(attributes, value) {
    let attrs = {}
    if (arguments.length === 2) attrs[attributes] = value
    else attrs = attributes
    extend(this.headers, attrs)
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

let request_modifier = null
export default function configure(superagent, options) {
  request_modifier = new RequestModifier(options)

  // Patch superagents .end()
  const __original_SuperAgent_end = superagent.Request.prototype.end
  superagent.Request.prototype.end = function end(...args) {
    if (request_modifier.owns(this.url)) {

      // add queries
      if (size(request_modifier.queries)) {
        const queries = {}

        for (const key in request_modifier.queries) {
          if (!this.url.match(new RegExp(`[?&]${key}`))) {
            const val = request_modifier.queries[key]
            queries[key] = isString(val) ? val : JSON.stringify(val)
          }
        }

        this.query(queries)
      }
      // add headers
      if (size(request_modifier.headers)) this.set(request_modifier.headers)
    }
    __original_SuperAgent_end.apply(this, args)
  }

  return request_modifier
}
