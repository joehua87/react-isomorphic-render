'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = dev_tools;

var _reduxDevtools = require('redux-devtools');

var _reduxDevtoolsLogMonitor = require('redux-devtools-log-monitor');

var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);

var _reduxDevtoolsDockMonitor = require('redux-devtools-dock-monitor');

var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);

function dev_tools() {
	return _reduxDevtools.createDevTools(React.createElement(
		_reduxDevtoolsDockMonitor2['default'],
		{ toggleVisibilityKey: 'H', changePositionKey: 'Q' },
		React.createElement(_reduxDevtoolsLogMonitor2['default'], null)
	));
}

module.exports = exports['default'];
//# sourceMappingURL=dev tools.js.map