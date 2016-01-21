// produces wrong line numbers:
// import 'source-map-support/register'

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

var _reduxRender = require('../redux/render');

// isomorphic (universal) rendering (middleware).
// will be used in web_application.use(...)

exports['default'] = function (_ref) {
	var development = _ref.development;
	var localize = _ref.localize;
	var preferred_locale = _ref.preferred_locale;
	var assets = _ref.assets;
	var request = _ref.request;
	var respond = _ref.respond;
	var fail = _ref.fail;
	var redirect = _ref.redirect;
	var disable_server_side_rendering = _ref.disable_server_side_rendering;
	var log = _ref.log;
	var create_store = _ref.create_store;
	var create_routes = _ref.create_routes;
	var markup_wrapper = _ref.markup_wrapper;
	var head = _ref.head;
	var body = _ref.body;
	var style = _ref.style;
	var web_server = _ref.web_server;

	// create Redux store
	var store = create_store({ development: development, create_routes: create_routes, server: true, http_request: request, host: web_server.host, port: web_server.port });

	// internationalization

	var locale = undefined;
	var messages = undefined;

	if (localize) {
		var result = localize(store, preferred_locale);

		locale = result.locale;
		messages = result.messages;
	}

	var entry_point = 'main'; // may examine request.originalUrl to determine Webpack entry point

	// render the web page
	return _reduxRender.server({
		disable_server_side_rendering: disable_server_side_rendering,
		url: request.originalUrl.replace(/\?$/, ''),
		render: function render(child_element, props) {
			if (localize) {
				props.locale = locale;
				props.messages = messages;
			}

			return _react2['default'].createElement(markup_wrapper, props, child_element);
		},
		render_html: function render_html(element) {
			return _react2['default'].createElement(
				_html2['default'],
				{ development: development, assets: assets(), entry_point: entry_point, locale: locale, head: head, body: body, style: style, store: store },
				element
			);
		},
		store: store
	}).then(function (_ref2) {
		var status = _ref2.status;
		var markup = _ref2.markup;
		var redirect_to = _ref2.redirect_to;

		if (redirect_to) {
			return redirect(redirect_to);
		}

		respond({ status: status, markup: markup });
	}, function (error) {
		log.error(error);

		if (error.markup) {
			respond({ markup: error.markup, status: 500 });
		} else {
			fail(error);
		}
	});
};

module.exports = exports['default'];
//# sourceMappingURL=render.js.map