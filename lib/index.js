'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = configure;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestModifier = function () {
  function RequestModifier() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, RequestModifier);

    this.queries = options.queries || {};
    this.headers = options.headers || {};
    this.hostname = options.hostname;
  }

  _createClass(RequestModifier, [{
    key: 'setQuery',
    value: function setQuery(attributes, value) {
      var attrs = {};
      if (arguments.length === 2) attrs[attributes] = value;else attrs = attributes;
      _lodash2.default.extend(this.queries, attrs);
    }
  }, {
    key: 'setHeader',
    value: function setHeader(attributes, value) {
      var attrs = {};
      if (arguments.length === 2) attrs[attributes] = value;else attrs = attributes;
      _lodash2.default.extend(this.headers, attrs);
    }
  }, {
    key: 'owns',
    value: function owns(url) {
      this.re = this.re || new RegExp('//' + this.hostname);
      return this.re.test(url);
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.queries = {};
      this.headers = {};
    }
  }]);

  return RequestModifier;
}();

var requestModifier = null;
function configure(superagent, options) {
  requestModifier = new RequestModifier(options);

  // Patch superagents .end()
  var __originalSuperAgentEnd = superagent.Request.prototype.end;
  superagent.Request.prototype.end = function end() {
    if (requestModifier.owns(this.url)) {

      // add queries
      if (_lodash2.default.size(requestModifier.queries)) {
        var queries = {};

        for (var key in requestModifier.queries) {
          if (!this.url.match(new RegExp('[?&]' + key))) {
            var val = requestModifier.queries[key];
            queries[key] = _lodash2.default.isString(val) ? val : JSON.stringify(val);
          }
        }

        this.query(queries);
      }
      // add headers
      if (_lodash2.default.size(requestModifier.headers)) this.set(requestModifier.headers);
    }

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    __originalSuperAgentEnd.apply(this, args);
  };

  return requestModifier;
}