'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.client = client;
exports.server = server;

var _render = require('../render');

var _reduxRouterServer = require('redux-router/server');

var _reduxRouter = require('redux-router');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require('react-dom/server');

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

// returns a Promise for React component.
//
// renders directly to the "to" DOM element.
// (to allow for faster DOM mutations instead of simple slow Html code replacement)

function client(_ref) {
	var development = _ref.development;
	var render = _ref.render;
	var create_routes = _ref.create_routes;
	var store = _ref.store;
	var to = _ref.to;

	var router_element = _react2['default'].createElement(_reduxRouter.ReduxRouter, { routes: create_routes({ store: store }) });

	return render(router_element, { store: store }).then(function (element) {
		return _render.client({
			development: development,
			element: element,
			to: to
		});
	});
}

// returns a Promise resolving to Html code.

function server(_ref2) {
	var disable_server_side_rendering = _ref2.disable_server_side_rendering;
	var render = _ref2.render;
	var render_html = _ref2.render_html;
	var url = _ref2.url;
	var store = _ref2.store;

	if (disable_server_side_rendering) {
		return _Promise.resolve({ markup: _render.server({ html: html }) });
	}

	return new _Promise(function (resolve, reject) {
		store.dispatch(_reduxRouterServer.match(url, function (error, redirect_location, router_state) {
			if (redirect_location) {
				return resolve({
					redirect: redirect_location.pathname + redirect_location.search
				});
			}

			if (error) {
				return reject(error);
			}

			if (!router_state) {
				return reject(new Error('No router state'));
			}

			// Workaround redux-router query string issue:
			// https://github.com/rackt/redux-router/issues/106
			if (router_state.location.search && !router_state.location.query) {
				router_state.location.query = query_string.parse(router_state.location.search);
			}

			var get_status_from_routes = function get_status_from_routes(matched_routes) {
				return matched_routes.reduce(function (previous, current) {
					return current && current.status || previous && current.status;
				});
			};

			store.getState().router.then(function () {
				var child_element = _react2['default'].createElement(_reduxRouter.ReduxRouter, null);

				var status = get_status_from_routes(router_state.routes);

				resolve({ status: status, markup: '<!doctype html>\n' + _reactDomServer2['default'].renderToString(render_html(render(child_element, { store: store }))) });
			})['catch'](function (error) {
				// log.error(error)
				error.markup = _render.server({ render_html: render_html }); // let client render error page or re-request data
				throw error;
			});
		}));
	});
}
//# sourceMappingURL=render.js.map