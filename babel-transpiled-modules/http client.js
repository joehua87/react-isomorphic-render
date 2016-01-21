'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var http_client = (function () {
	// Constructs a new instance of Api Client.
	// Optionally takes an Http Request as a reference to mimic (for example, cookies).
	// This feature is used for Api calls during server side rendering
	// (this way server side Http Api calls mimic client side Http Api calls).

	function http_client(_ref2) {
		var _this = this;

		var host = _ref2.host;
		var port = _ref2.port;
		var prefix = _ref2.prefix;
		var clone_request = _ref2.clone_request;

		_classCallCheck(this, http_client);

		if (typeof clone_request === 'string') {
			prefix = clone_request;
			clone_request = undefined;
		}

		if (clone_request) {
			this.server = true;
		}

		this.host = host;
		this.port = port || 80;
		this.prefix = prefix || '';

		var http = {};

		var http_methods = {
			get: 'get',
			post: 'post',
			call: 'post',
			create: 'post',
			put: 'put',
			update: 'put',
			patch: 'patch',
			'delete': 'del'
		};

		var _loop = function () {
			if (_isArray) {
				if (_i >= _iterator.length) return 'break';
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) return 'break';
				_ref = _i.value;
			}

			var method = _ref;

			_this[method] = function (path, data, options) {
				// options = options || {}

				var http_method = http_methods[method];

				if (!http_method) {
					throw new Error('Api method not found: ' + method);
				}

				var url = _this.format_url(path);

				return new _Promise(function (resolve, reject) {
					var request = _superagent2['default'][http_method](url);

					if (data) {
						if (http_method === 'post') {
							request.send(data);
						} else {
							request.query(data);
						}
					}

					// server side only
					// (copies user authentication cookies to retain session specific data)
					if (clone_request) {
						if (clone_request.get('cookie')) {
							request.set('cookie', clone_request.get('cookie'));
						}
					}

					if (options && options.locale) {
						request.set('accept-language', locale);
					}

					request.end(function (error, response) {
						if (error) {
							// superagent would have already output the error to console
							// console.error(error.stack)

							return reject(error); // (response && response.body) ||
						}

						resolve(response.body);
					});
				});
			};
		};

		for (var _iterator = _Object$keys(http_methods), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
			var _ref;

			var _ret = _loop();

			if (_ret === 'break') break;
		}
	}

	http_client.prototype.format_url = function format_url(path) {
		// add slash in the beginning
		var normalized_path = path[0] !== '/' ? '/' + path : path;

		if (this.server) {
			// Prepend host and port of the API server to the path.
			return 'http://' + this.host + ':' + this.port + this.prefix + normalized_path;
		}

		// Prepend prefix to relative URL, to proxy to API server.
		return this.prefix + normalized_path;
	};

	return http_client;
})();

exports['default'] = http_client;
module.exports = exports['default'];
//# sourceMappingURL=http client.js.map