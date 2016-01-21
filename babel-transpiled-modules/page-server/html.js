'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require('react-dom/server');

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

var _webpageHead = require('../webpage head');

var _helpers = require('../helpers');

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */

var Html = (function (_Component) {
	_inherits(Html, _Component);

	function Html() {
		_classCallCheck(this, Html);

		_Component.apply(this, arguments);
	}

	Html.prototype.render = function render() {
		var _props = this.props;
		var development = _props.development;
		var assets = _props.assets;
		var store = _props.store;
		var head = _props.head;
		var body = _props.body;
		var style = _props.style;
		var locale = _props.locale;
		var entry_point = _props.entry_point;

		// when server-side rendering is disabled, content will be undefined
		// (but server-side rendering is always enabled so this "if" condition may be removed)
		var content_markup = this.props.children ? _reactDomServer2['default'].renderToString(this.props.children) : '';

		var content_element = _react2['default'].createElement('div', { id: 'react_markup', dangerouslySetInnerHTML: { __html: content_markup } });

		if (body) {
			content_element = body(content_element);
		}

		var html = _react2['default'].createElement(
			'html',
			{ lang: locale ? _helpers.get_language_from_locale(locale) : '' },
			_react2['default'].createElement(
				'head',
				null,
				_webpageHead.server_generated_webpage_head(),
				_Object$keys(assets.styles).map(function (style, i) {
					return _react2['default'].createElement('link', {
						href: assets.styles[style],
						key: i,
						media: 'screen, projection',
						rel: 'stylesheet',
						type: 'text/css',
						charSet: 'UTF-8' });
				}),
				development && style ? _react2['default'].createElement('style', { dangerouslySetInnerHTML: { __html: style() }, charSet: 'UTF-8' }) : null,
				head ? head() : null,
				assets.icon ? _react2['default'].createElement('link', { rel: 'shortcut icon', href: assets.icon }) : null
			),
			_react2['default'].createElement(
				'body',
				null,
				content_element,
				_react2['default'].createElement('script', { dangerouslySetInnerHTML: { __html: 'window._locale=' + JSON.stringify(locale) }, charSet: 'UTF-8' }),
				_react2['default'].createElement('script', { dangerouslySetInnerHTML: { __html: 'window._flux_store_data=' + JSON.stringify(store.getState()) }, charSet: 'UTF-8' }),
				assets.javascript && assets.javascript.common ? _react2['default'].createElement('script', { src: assets.javascript.common, charSet: 'UTF-8' }) : null,
				_react2['default'].createElement('script', { src: assets.javascript[entry_point], charSet: 'UTF-8' })
			)
		);

		return html;
	};

	_createClass(Html, null, [{
		key: 'propTypes',
		value: {
			development: _react.PropTypes.bool,
			assets: _react.PropTypes.object.isRequired,
			content: _react.PropTypes.node,
			store: _react.PropTypes.object.isRequired,
			head: _react.PropTypes.func,
			body: _react.PropTypes.func,
			style: _react.PropTypes.func,
			locale: _react.PropTypes.string,
			entry_point: _react.PropTypes.string.isRequired
		},
		enumerable: true
	}]);

	return Html;
})(_react.Component);

exports['default'] = Html;
module.exports = exports['default'];
/* webpage title and various meta tags */ /* (will be done only in production mode
                                              with webpack extract text plugin) 
                                              mount CSS stylesheets for all entry points
                                             (should have been "for the current entry point only")
                                              (currently there is only one entry point: "main";
                                              and also the "common" chunk) */ /* (will be done only in development mode)
                                                                                  resolves the initial style flash (flicker) 
                                                                                 on page load in development mode 
                                                                                 (caused by Webpack style-loader mounting CSS styles 
                                                                                  through javascript after page load)
                                                                                 by mounting the entire CSS stylesheet in a <style/> tag */ /* React page content */ /* locale for international messages */ /* Flux store data will be reloaded into the store on the client */ /* javascripts */ /* the "common.js" chunk (see webpack extract commons plugin) */ /* (needs to be included first (by design)) */ /* current application "entry" point javascript
                                                                                                                                                                                                                                                                                                                                                                                                                      (currently there is only one entry point: "main") */
//# sourceMappingURL=html.js.map