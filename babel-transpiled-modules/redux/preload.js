'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

/*
  Note:
    When this decorator is used, it MUST be the first (outermost) decorator.
    Otherwise, we cannot find and call the preload and preload_deferred methods.
*/

exports['default'] = function (preload, preload_deferred) {
	return function (Wrapped) {
		var Wrapper = (function (_Component) {
			_inherits(Wrapper, _Component);

			function Wrapper() {
				_classCallCheck(this, Wrapper);

				_Component.apply(this, arguments);
			}

			Wrapper.prototype.render = function render() {
				return _react2['default'].createElement(Wrapped, this.props);
			};

			return Wrapper;
		})(_react.Component);

		Wrapper.preload = preload;
		Wrapper.preload_deferred = preload_deferred;

		return _hoistNonReactStatics2['default'](Wrapper, Wrapped);
	};
};

module.exports = exports['default'];
//# sourceMappingURL=preload.js.map