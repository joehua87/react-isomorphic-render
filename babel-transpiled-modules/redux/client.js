'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _render = require('./render');

var _devTools = require('./dev tools');

var _devTools2 = _interopRequireDefault(_devTools);

var _helpers = require('../helpers');

exports['default'] = function (_ref) {
	var development = _ref.development;
	var development_tools = _ref.development_tools;
	var to = _ref.to;
	var create_store = _ref.create_store;
	var create_routes = _ref.create_routes;
	var markup_wrapper = _ref.markup_wrapper;
	var load_localized_messages = _ref.load_localized_messages;

	// international

	var locale = window._locale;

	if (locale) {
		delete window._locale;
	}

	// create Redux store
	var store = create_store({ data: window._flux_store_data, create_routes: create_routes });
	delete window._flux_store_data;

	function render_react() {
		// returns a Promise for React component.
		//
		return _render.client({
			development: development,
			render: function render(element, props) {
				return new _Promise(function (resolve, reject) {
					// international
					if (locale) {
						if (!load_localized_messages) {
							throw new Error('You are supposed to pass \n\t\t\t\t\t\t\t\t"load_localized_messages(locale) => Promise" function \n\t\t\t\t\t\t\t\tas a parameter to client-side rendering function call\n\t\t\t\t\t\t\t\tbecause you opted into using internationalization feature');
						}

						load_localized_messages(locale).then(function (messages) {
							props.locale = locale;
							props.messages = messages;

							render();
						});
					} else {
						render();
					}

					function render() {
						var wrapped_element = _react2['default'].createElement(markup_wrapper, props, element);

						if (!development_tools) {
							return resolve(wrapped_element);
						}

						// Render dev tools after initial client render to prevent warning
						// "React attempted to reuse markup in a container but the checksum was invalid"
						// https://github.com/erikras/react-redux-universal-hot-example/pull/210
						//
						// (practically does nothing)
						ReactDOM.render(wrapped_element, content_container);

						console.log('You are gonna see a warning about "React.findDOMNode is deprecated" in the console. It\'s normal: redux_devtools hasn\'t been updated to React 0.14 yet');

						resolve(_react2['default'].createElement(
							'div',
							null,
							wrapped_element,
							_react2['default'].createElement('dev_tools', null)
						));
					}
				});
			},
			create_routes: create_routes,
			store: store,
			to: to || document.getElementById('react_markup')
		});
	}

	// render page (on the client side)
	//
	return render_react().then(function (component) {
		return { rerender: render_react };
	});
};

module.exports = exports['default'];
//# sourceMappingURL=client.js.map