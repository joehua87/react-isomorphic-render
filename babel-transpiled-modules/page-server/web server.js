'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = start_web_server;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaLocale = require('koa-locale');

var _koaLocale2 = _interopRequireDefault(_koaLocale);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

function start_web_server(_ref) {
	var marked1$0 = [errors, rendering].map(_regeneratorRuntime.mark);
	var development = _ref.development;
	var localize = _ref.localize;
	var assets = _ref.assets;
	var host = _ref.host;
	var port = _ref.port;
	var web_server = _ref.web_server;
	var log = _ref.log;
	var disable_server_side_rendering = _ref.disable_server_side_rendering;
	var create_store = _ref.create_store;
	var create_routes = _ref.create_routes;
	var markup_wrapper = _ref.markup_wrapper;
	var head = _ref.head;
	var body = _ref.body;
	var style = _ref.style;

	log = log || console;

	var web = _koa2['default']();

	// get locale from Http request
	// (the second parameter is the Http Get parameter name)
	_koaLocale2['default'](web, 'locale');

	// handle errors

	function errors(next) {
		return _regeneratorRuntime.wrap(function errors$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.prev = 0;
					context$2$0.next = 3;
					return next;

				case 3:
					context$2$0.next = 10;
					break;

				case 5:
					context$2$0.prev = 5;
					context$2$0.t0 = context$2$0['catch'](0);

					// log the error
					log.error(context$2$0.t0);

					this.status = typeof context$2$0.t0.code === 'number' ? context$2$0.t0.code : 500;
					this.message = context$2$0.t0.message || 'Internal error';

				case 10:
				case 'end':
					return context$2$0.stop();
			}
		}, marked1$0[0], this, [[0, 5]]);
	}

	web.use(errors);

	// isomorphic rendering

	function rendering() {
		return _regeneratorRuntime.wrap(function rendering$(context$2$0) {
			var _this = this;

			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.next = 2;
					return _render2['default']({
						development: development,

						localize: localize,
						preferred_locale: this.getLocaleFromQuery() || this.getLocaleFromCookie() || this.getLocaleFromHeader(),

						assets: assets,

						request: this.request,
						respond: function respond(_ref2) {
							var markup = _ref2.markup;
							var status = _ref2.status;

							_this.body = markup;

							if (status) {
								_this.status = status;
							}
						},
						fail: function fail(error) {
							return _this['throw'](error);
						},
						redirect: function redirect(to) {
							return _this.redirect(to);
						},

						disable_server_side_rendering: disable_server_side_rendering,
						log: log,

						create_store: create_store,
						create_routes: create_routes,

						markup_wrapper: markup_wrapper,

						head: head,
						body: body,
						style: style,

						web_server: web_server
					});

				case 2:
				case 'end':
					return context$2$0.stop();
			}
		}, marked1$0[1], this);
	}

	web.use(rendering);

	// start http server
	web.listen(port, host, function (error) {
		if (error) {
			return log.error(error);
		}

		log.info('Webpage server is listening at http://' + (host ? host : 'localhost') + ':' + port);
	});
}

module.exports = exports['default'];

// Material-UI asks for this,
// but this isn't right,
// because Node.js serves requests asynchronously
// and therefore two different web browsers
// may be asking for a rendered page simultaneously.
//
// global.navigator = { userAgent: request.headers['user-agent'] }

// these parameters are for Koa app.
// they can be modified to work with Express app if needed.
//# sourceMappingURL=web server.js.map