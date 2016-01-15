'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = configure;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashExtend = require('lodash/extend');

var _lodashExtend2 = _interopRequireDefault(_lodashExtend);

var _lodashSize = require('lodash/size');

var _lodashSize2 = _interopRequireDefault(_lodashSize);

var _lodashIsString = require('lodash/isString');

var _lodashIsString2 = _interopRequireDefault(_lodashIsString);

var RequestModifier = (function () {
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
      (0, _lodashExtend2['default'])(this.queries, attrs);
    }
  }, {
    key: 'setHeader',
    value: function setHeader(attributes, value) {
      var attrs = {};
      if (arguments.length === 2) attrs[attributes] = value;else attrs = attributes;
      (0, _lodashExtend2['default'])(this.headers, attrs);
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
})();

var request_modifier = null;

function configure(superagent, options) {
  request_modifier = new RequestModifier(options);

  // Patch superagents .end()
  var __original_SuperAgent_end = superagent.Request.prototype.end;
  superagent.Request.prototype.end = function end() {
    if (request_modifier.owns(this.url)) {

      // add queries
      if ((0, _lodashSize2['default'])(request_modifier.queries)) {
        var queries = {};

        for (var key in request_modifier.queries) {
          if (!this.url.match(new RegExp('[?&]' + key))) {
            var val = request_modifier.queries[key];
            queries[key] = (0, _lodashIsString2['default'])(val) ? val : JSON.stringify(val);
          }
        }

        this.query(queries);
      }
      // add headers
      if ((0, _lodashSize2['default'])(request_modifier.headers)) this.set(request_modifier.headers);
    }

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    __original_SuperAgent_end.apply(this, args);
  };

  return request_modifier;
}

module.exports = exports['default'];