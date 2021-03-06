// // if the variable is defined
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

exports.__esModule = true;
exports.is_object = is_object;
exports.extend = extend;
exports.merge = merge;
exports.clone = clone;
exports.convert_from_camel_case = convert_from_camel_case;
exports.replace_all = replace_all;
exports.starts_with = starts_with;
exports.ends_with = ends_with;
exports.is_empty = is_empty;
exports.not_empty = not_empty;
exports.repeat = repeat;
exports.is_blank = is_blank;
exports.zip = zip;
exports.get_language_from_locale = get_language_from_locale;
var exists = function exists(what) {
	return typeof what !== 'undefined';
};

exports.exists = exists;
// used for JSON object type checking
var object_constructor = ({}).constructor;

// detects a JSON object

function is_object(object) {
	return exists(object) && object !== null && object.constructor === object_constructor;
}

// extends the first object with
/* istanbul ignore next: some weird transpiled code, not testable */

function extend() {
	var _this = this,
	    _arguments = arguments;

	var _again = true;

	_function: while (_again) {
		_again = false;

		for (var _len = _arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
			objects[_key] = _arguments[_key];
		}

		objects = objects.filter(function (x) {
			return exists(x);
		});

		if (objects.length === 0) {
			return;
		}

		if (objects.length === 1) {
			return objects[0];
		}

		var to = objects[0];
		var from = objects[1];

		if (objects.length > 2) {
			var last = objects.pop();
			var intermediary_result = extend.apply(_this, objects);
			_this = undefined;
			_arguments = [intermediary_result, last];
			_again = true;
			_len = objects = _key = to = from = last = intermediary_result = undefined;
			continue _function;
		}

		for (var _iterator = _Object$keys(from), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var key = _ref;

			if (is_object(from[key])) {
				if (!is_object(to[key])) {
					to[key] = {};
				}

				extend(to[key], from[key]);
			} else if (Array.isArray(from[key])) {
				if (!Array.isArray(to[key])) {
					to[key] = [];
				}

				to[key] = to[key].concat(clone(from[key]));
			} else {
				to[key] = from[key];
			}
		}

		return to;
	}
}

function merge() {
	var parameters = Array.prototype.slice.call(arguments, 0);
	parameters.unshift({});
	return extend.apply(this, parameters);
}

function clone(object) {
	if (is_object(object)) {
		return merge({}, object);
	} else if (Array.isArray(object)) {
		return object.map(function (x) {
			return clone(x);
		});
	} else {
		return object;
	}
}

// creates camelCased aliases for all the keys of an object

function convert_from_camel_case(object) {
	for (var _iterator2 = _Object$keys(object), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);;) {
		var _ref2;

		if (_isArray2) {
			if (_i2 >= _iterator2.length) break;
			_ref2 = _iterator2[_i2++];
		} else {
			_i2 = _iterator2.next();
			if (_i2.done) break;
			_ref2 = _i2.value;
		}

		var key = _ref2;

		if (/[A-Z]/.test(key))
			// if (key.indexOf('_') >= 0)
			{
				// const camel_cased_key = key.replace(/_(.)/g, function(match, group_1)
				// {
				// 	return group_1.toUpperCase()
				// })

				// if (!exists(object[camel_cased_key]))
				// {
				// 	object[camel_cased_key] = object[key]
				// 	delete object[key]
				// }

				var lo_dashed_key = key.replace(/([A-Z])/g, function (match, group_1) {
					return '_' + group_1.toLowerCase();
				});

				if (!exists(object[lo_dashed_key])) {
					object[lo_dashed_key] = object[key];
					delete object[key];
				}
			}
	}

	return object;
}

function escape_regexp(string) {
	var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", 'g');
	return string.replace(specials, "\\$&");
}

function replace_all(where, what, with_what) {
	var regexp = new RegExp(escape_regexp(what), 'g');
	return where.replace(regexp, with_what);
}

function starts_with(string, substring) {
	return string.indexOf(substring) === 0;
}

function ends_with(string, substring) {
	var i = string.length;
	var j = substring.length;

	if (j > i) {
		return false;
	}

	while (j > 0) {
		i--;
		j--;

		if (string[i] !== substring[j]) {
			return false;
		}
	}

	return true;

	// const index = string.lastIndexOf(substring)
	// return index >= 0 && index === string.length - substring.length
}

function is_empty(array) {
	return array.length === 0;
}

function not_empty(array) {
	return array.length > 0;
}

// repeat string N times

function repeat(what, times) {
	var result = '';
	while (times > 0) {
		result += what;
		times--;
	}
	return result;
}

// if the text is blank

function is_blank(text) {
	return !exists(text) || !text.replace(/\s/g, '');
}

// zips two arrays

function zip(a, b) {
	return a.map(function (_, index) {
		return [a[index], b[index]];
	});
}

function get_language_from_locale(locale) {
	var dash_index = locale.indexOf('-');
	if (dash_index >= 0) {
		return locale.substring(0, dash_index);
	}
	return locale;
}
//# sourceMappingURL=helpers.js.map