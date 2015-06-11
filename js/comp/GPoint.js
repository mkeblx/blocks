'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define(function () {
	var GPoint = (function () {
		function GPoint(x, y) {
			_classCallCheck(this, GPoint);

			this.x = x;
			this.y = y;
		}

		_createClass(GPoint, [{
			key: 'copy',
			value: function copy() {
				return new GPoint(this.x, this.y);
			}
		}, {
			key: 'addX',
			value: function addX(n) {
				this.x += n;
			}
		}, {
			key: 'addY',
			value: function addY(n) {
				this.y += n;
			}
		}, {
			key: 'add',
			value: function add(pt) {
				this.x += pt.x;
				this.y += pt.y;
				return this;
			}
		}, {
			key: 'mult',

			//scalar
			value: function mult(s) {
				this.x *= s;
				this.y *= s;
				return this;
			}
		}, {
			key: 'set',
			value: function set(pt, y) {
				if (this.arguments === 1) {
					this.x = pt.x;
					this.y = pt.y;
				} else {
					this.x = pt;
					this.y = y;
				}
				return this;
			}
		}, {
			key: 'compare',

			//compare two pieces for ordering
			value: function compare(b) {
				return 0;
			}
		}, {
			key: 'equals',
			value: function equals(pt) {
				return this.x === pt.x && this.y === pt.y;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[' + this.x + ',' + this.y + ']';
			}
		}]);

		return GPoint;
	})();

	;

	return GPoint;
});
