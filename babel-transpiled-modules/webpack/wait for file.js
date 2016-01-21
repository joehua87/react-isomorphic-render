'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

// Waits for `assets/webpage_rendering_server.js` to be created
// after Webpack build process finishes
//
// The callback is called when `assets/webpage_rendering_server.js` has been found
// (it's needed for development because `webpack-dev-server`
//  and your application server are run in parallel).
//

exports['default'] = function (path, done) {
	// condition check interval
	var check_interval = 300; // in milliseconds
	var message_interval = 2000; // in milliseconds

	// show the message not too often
	var message_timer = 0;

	// waits for condition to be met, then proceeds
	function wait_for(condition, proceed) {
		function check() {
			// if the condition is met, then proceed
			if (condition()) {
				return proceed();
			}

			message_timer += check_interval;

			if (message_timer >= message_interval) {
				message_timer = 0;

				console.log('("' + path + '" not found)');
				console.log('(waiting for the first Webpack build to finish)');
			}

			setTimeout(check, check_interval);
		}

		check();
	}

	// wait for webpack-assets.json to be written to disk by Webpack
	wait_for(function () {
		return _fs2['default'].existsSync(path);
	}, done);
};

module.exports = exports['default'];
//# sourceMappingURL=wait for file.js.map