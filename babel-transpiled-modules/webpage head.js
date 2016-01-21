'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.webpage_title = webpage_title;
exports.webpage_head = webpage_head;
exports.server_generated_webpage_head = server_generated_webpage_head;

var _reactDocumentMeta = require('react-document-meta');

var _reactDocumentMeta2 = _interopRequireDefault(_reactDocumentMeta);

// fixes strange bug: "ReferenceError: React is not defined"

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function webpage_title(title) {
	return _react2['default'].createElement(_reactDocumentMeta2['default'], { title: title, extend: true });
}

function webpage_head(title, description, meta) {
	var metadata = {
		title: title,
		description: description,
		meta: meta
	};

	return _react2['default'].createElement(_reactDocumentMeta2['default'], metadata);
}

function server_generated_webpage_head() {
	return _reactDocumentMeta2['default'].renderAsReact();
}
//# sourceMappingURL=webpage head.js.map