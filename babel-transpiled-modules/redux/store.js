'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _redux = require('redux');

var _asynchronousMiddleware = require('./asynchronous middleware');

var _asynchronousMiddleware2 = _interopRequireDefault(_asynchronousMiddleware);

var _transitionMiddleware = require('./transition middleware');

var _transitionMiddleware2 = _interopRequireDefault(_transitionMiddleware);

var _devTools = require('./dev tools');

var _devTools2 = _interopRequireDefault(_devTools);

var _httpClient = require('../http client');

var _httpClient2 = _interopRequireDefault(_httpClient);

var _reduxRouter = require('redux-router');

var _reactRouterLibRouteUtils = require('react-router/lib/RouteUtils');

var _reduxRouterServer = require('redux-router/server');

var _historyLibCreateMemoryHistory = require('history/lib/createMemoryHistory');

var _historyLibCreateMemoryHistory2 = _interopRequireDefault(_historyLibCreateMemoryHistory);

var _historyLibCreateBrowserHistory = require('history/lib/createBrowserHistory');

var _historyLibCreateBrowserHistory2 = _interopRequireDefault(_historyLibCreateBrowserHistory);

// Three different types of scroll behavior available.
// Documented at https://github.com/rackt/scroll-behavior
//
// Possibly currently doesn't make any difference

var _scrollBehaviorLibUseStandardScroll = require('scroll-behavior/lib/useStandardScroll');

var _scrollBehaviorLibUseStandardScroll2 = _interopRequireDefault(_scrollBehaviorLibUseStandardScroll);

// @stevoland wrote this for `react-redux-universal-hot-example`.
// I'm not sure if it's needed anymore.
//
// Wrap the hooks so they don't fire if they're called before
// the store is initialised. This only happens when doing the first
// client render of a route that has an onEnter hook
function makeHooksSafe(routes, store) {
	if (Array.isArray(routes)) {
		return routes.map(function (route) {
			return makeHooksSafe(route, store);
		});
	}

	var onEnter = routes.onEnter;

	if (onEnter) {
		routes.onEnter = function safeOnEnter() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			try {
				store.getState();
			} catch (err) {
				if (onEnter.length === 3) {
					args[2]();
				}

				// There's no store yet so ignore the hook
				return;
			}

			onEnter.apply(null, args);
		};
	}

	if (routes.childRoutes) {
		makeHooksSafe(routes.childRoutes, store);
	}

	if (routes.indexRoute) {
		makeHooksSafe(routes.indexRoute, store);
	}

	return routes;
}

// @stevoland wrote this for `react-redux-universal-hot-example`.
// I'm not sure if it's needed anymore.
function makeRouteHooksSafe(create_routes) {
	return function (store) {
		return makeHooksSafe(_reactRouterLibRouteUtils.createRoutes(create_routes(store)), store);
	};
}

exports['default'] = function (get_reducers, _ref) {
	var development = _ref.development;
	var development_tools = _ref.development_tools;
	var server = _ref.server;
	var data = _ref.data;
	var create_routes = _ref.create_routes;
	var http_request = _ref.http_request;
	var host = _ref.host;
	var port = _ref.port;

	// whether to return a `reload()` function to hot reload store
	var reloadable = true;

	// allows simplified store creation
	// (with reducer object instead of a function returning reducer object)
	if (typeof get_reducers !== 'function') {
		(function () {
			// generate proper `get_reducers` function
			var reducers = get_reducers;
			get_reducers = function () {
				return reducers;
			};

			// no way to reload store in this case
			// (or if there is the open an issue on github)
			reloadable = false;
		})();
	}

	// server-side and client-side specifics
	create_routes = server ? create_routes : makeRouteHooksSafe(create_routes);
	var reduxReactRouter = server ? _reduxRouterServer.reduxReactRouter : _reduxRouter.reduxReactRouter;
	var createHistory = server ? _historyLibCreateMemoryHistory2['default'] : _scrollBehaviorLibUseStandardScroll2['default'](_historyLibCreateBrowserHistory2['default']);

	// Redux middleware
	var middleware = [_asynchronousMiddleware2['default'](new _httpClient2['default']({ host: host, port: port, clone_request: http_request })), _transitionMiddleware2['default'](server)];

	// Store creation function
	var create_store = undefined;

	// Generate store creation function
	if (development && !server && development_tools) {
		var _require = require('redux-devtools');

		var persistState = _require.persistState;

		create_store = _redux.compose(_redux.applyMiddleware.apply(undefined, middleware),
		// Provides support for DevTools:
		_devTools2['default'].instrument(),
		// Lets you write ?debug_session=<name> in address bar to persist debug sessions
		persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)))(_redux.createStore);
	} else {
		create_store = _redux.applyMiddleware.apply(undefined, middleware)(_redux.createStore);
	}

	// keeps react-router state in Redux
	create_store = reduxReactRouter({ getRoutes: create_routes, createHistory: createHistory })(create_store);

	// adds redux-router reducers to the list of all reducers
	var overall_reducer = function overall_reducer() {
		var model = get_reducers();
		model.router = _reduxRouter.routerStateReducer;
		return _redux.combineReducers(model);
	};

	// create store
	var store = create_store(overall_reducer(), data);

	// // client side hot module reload for Redux reducers attempt
	// // (won't work because it's not an immediate parent module for the reducers)
	// // https://github.com/webpack/webpack/issues/1790
	// if (development && module.hot)
	// {
	// 	module.hot.accept(reducers_path, () =>
	// 	{
	// 		store.replaceReducer(overall_reducer())
	// 	})
	// }

	if (!reloadable) {
		return store;
	}

	return { store: store, reload: function reload() {
			return store.replaceReducer(overall_reducer());
		} };
};

module.exports = exports['default'];
//# sourceMappingURL=store.js.map