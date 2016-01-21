'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

exports['default'] = function (webpack_assets_path, development) {
	var assets = undefined;

	return function () {
		// require() isn't used here to prevent Webpack
		// from including everything in the bundle during build process
		//
		if (development || !assets) {
			// `_webpack_assets_path_` variable will be substituted by Webpack during build process
			assets = JSON.parse(_fs2['default'].readFileSync(webpack_assets_path));
		}

		return assets;
	};
};

module.exports = exports['default'];
//# sourceMappingURL=assets.js.map