'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = configure;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var RequestModifier = (function () {
  function RequestModifier() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, RequestModifier);

    this.queries = options.queries || {};
    this.headers = options.headers || {};
    this.hostname = options.hostname;
  }

  RequestModifier.prototype.setQuery = function setQuery(attributes, value) {
    var attrs = {};
    if (arguments.length === 2) attrs[attributes] = value;else attrs = attributes;
    _lodash2['default'].extend(this.queries, attrs);
  };

  RequestModifier.prototype.setHeader = function setHeader(attributes, value) {
    var attrs = {};
    if (arguments.length === 2) attrs[attributes] = value;else attrs = attributes;
    _lodash2['default'].extend(this.headers, attrs);
  };

  RequestModifier.prototype.owns = function owns(url) {
    this.re = this.re || new RegExp('//' + this.hostname);
    return this.re.test(url);
  };

  RequestModifier.prototype.reset = function reset() {
    this.queries = {};
    this.headers = {};
  };

  return RequestModifier;
})();

var requestModifier = null;

function configure(superagent, options) {
  requestModifier = new RequestModifier(options);

  // Patch superagents .end()
  var __originalSuperAgentEnd = superagent.Request.prototype.end;
  superagent.Request.prototype.end = function end() {
    if (requestModifier.owns(this.url)) {

      // add queries
      if (_lodash2['default'].size(requestModifier.queries)) {
        var queries = {};

        for (var key in requestModifier.queries) {
          if (!this.url.match(new RegExp('[?&]' + key))) {
            var val = requestModifier.queries[key];
            queries[key] = _lodash2['default'].isString(val) ? val : JSON.stringify(val);
          }
        }

        this.query(queries);
      }
      // add headers
      if (_lodash2['default'].size(requestModifier.headers)) this.set(requestModifier.headers);
    }

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    __originalSuperAgentEnd.apply(this, args);
  };

  return requestModifier;
}

module.exports = exports['default'];