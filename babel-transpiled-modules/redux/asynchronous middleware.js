// сработает при вызове dispatch({ promise: ... })
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

exports.__esModule = true;
exports['default'] = middleware;

function middleware(http_client) {
	return function (_ref) {
		var dispatch = _ref.dispatch;
		var getState = _ref.getState;

		return function (next) {
			return function (action) {
				if (typeof action === 'function') {
					// or maybe: next(action)
					return action(dispatch, getState);
				}

				var promise = action.promise;
				var events = action.events;

				var rest = _objectWithoutProperties(action, ['promise', 'events']);

				if (!promise) {
					return next(action);
				}

				// event names
				var Request = events[0];
				var Success = events[1];
				var Failure = events[2];

				// start asynchronous request
				next(_extends({}, rest, { type: Request }));

				// returning promise from a middleware is not required.
				//
				// can be used like: this.props.dispatch(action()).then(...)
				//
				// or most likely as: this.props.bound_action().then(...)
				//
				// or even most likely as:
				//
				// async do_something()
				// {
				// 	try
				// 	{
				// 		const result = await this.props.bound_action({ ... })
				// 	}
				// 	catch (error)
				// 	{
				// 		alert(error.status)
				// 	}
				// }
				//
				return new _Promise(function (resolve, reject) {
					promise(http_client).then(function (result) {
						next(_extends({}, rest, { result: result, type: Success }));
						resolve(result);
					}, function (error) {
						next(_extends({}, rest, { error: error, type: Failure }));
						reject(error);
					});
				});
			};
		};
	};
}

module.exports = exports['default'];
//# sourceMappingURL=asynchronous middleware.js.map