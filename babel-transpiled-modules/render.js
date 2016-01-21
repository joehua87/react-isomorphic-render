'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.client = client;
exports.server = server;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactDomServer = require('react-dom/server');

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

// returns React component (for the element that was rendered).
//
// renders directly to the "to" DOM element.
// (to allow for faster DOM mutations instead of simple slow Html code replacement)

function client(_ref) {
	var development = _ref.development;
	var element = _ref.element;
	var to = _ref.to;

	var component = _reactDom2['default'].render(element, to);

	if (development) {
		window.React = _react2['default']; // enable debugger

		if (!to || !to.firstChild || !to.firstChild.attributes || !to.firstChild.attributes['data-react-checksum']) {
			console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
		}
	}

	return component;
}

// returns Html code.

function server(_ref2) {
	var render_html = _ref2.render_html;

	return '<!doctype html>\n' + _reactDomServer2['default'].renderToString(render_html());
}
//# sourceMappingURL=render.js.map