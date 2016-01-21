'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

exports.__esModule = true;

var _reduxRouterLibConstants = require('redux-router/lib/constants');

// returns a promise which resolves when all the required preload()s are resolved
var get_data_dependencies = function get_data_dependencies(components, getState, dispatch, location, params) {
	var options = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

	var method_name = options.deferred ? 'preload_deferred' : 'preload';

	return components.filter(function (component) {
		return component[method_name];
	}) // only look at ones with a static preload()
	.map(function (component) {
		return component[method_name];
	}) // pull out fetch data methods
	.map(function (preload) {
		return preload(dispatch, getState, location, params);
	}); // call fetch data methods and save promises
};

var locations_are_equal = function locations_are_equal(a, b) {
	return a.pathname === b.pathname && a.search === b.search;
};

exports['default'] = function (server) {
	return function (_ref) {
		var getState = _ref.getState;
		var dispatch = _ref.dispatch;
		return function (next) {
			return function (action) {
				// on navigation
				if (action.type !== _reduxRouterLibConstants.ROUTER_DID_CHANGE) {
					// proceed
					return next(action);
				}

				// do nothing if it's taking place on the client and the location hasn't changed
				if (getState().router && locations_are_equal(action.payload.location, getState().router.location)) {
					return next(action);
				}

				var _action$payload = action.payload;
				var components = _action$payload.components;
				var location = _action$payload.location;
				var params = _action$payload.params;

				var promise = new _Promise(function (resolve) {
					// preload all the required data
					_Promise.all(get_data_dependencies(components, getState, dispatch, location, params))
					// check for errors
					['catch'](function (error) {
						return console.error(error.stack || error);
					})
					// then
					.then(function () {
						// proceed
						next(action);
						// preload all the deferred required data (if any)
						_Promise.all(get_data_dependencies(components, getState, dispatch, location, params, { deferred: true }))
						// check for errors
						['catch'](function (error) {
							return console.error(error.stack || error);
						})
						// done
						.then(resolve);
					});
				});

				if (server) {
					// router state is null until ReduxRouter is created (on the client)
					// so we can use router state variable to store the promise
					// to let the server know when it can render
					getState().router = promise;
				}

				// preload() then proceed
				//
				// returning promise from a middleware is not required.
				// can be used like: store.dispatch({ ... }).then(...)
				return promise;
			};
		};
	};
};

module.exports = exports['default'];
//# sourceMappingURL=transition middleware.js.map