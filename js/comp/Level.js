'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define(function (require) {

	var Grid = require('Grid'),
	    Piece = require('Piece'),
	    GPoint = require('GPoint');

	var Level = (function () {
		function Level(levelData) {
			_classCallCheck(this, Level);

			this.levelData = levelData;

			this.setup();
		}

		_createClass(Level, [{
			key: 'setup',
			value: function setup() {
				var levelData = this.levelData;
				this.name = levelData.name;

				var rows = levelData.grid[0];
				var cols = levelData.grid[1];

				this.grid = new Grid(rows, cols);
				this.startPoint = null;
				this.endPoint = null;

				var maxPieces = rows * cols;

				var pcsStr = levelData.pieces;
				var pcs = pcsStr.split('+');

				for (var i = 0, num = pcs.length; i < num; i++) {
					var pc = pcs[i];

					var parts = pc.split(':');

					var coords = parts[0];
					coords = coords.split(',');
					var row = parseInt(coords[0]);
					var col = parseInt(coords[1]);

					var pt = new GPoint(row, col);
					var len = parseInt(parts[1]);
					var piece = new Piece(len, pt);

					if (i === 0) {
						this.startPiece = piece;
						this.startPoint = piece.pt;
					} else if (i === num - 1) {
						this.endPiece = piece;
						this.endPoint = piece.pt;
					}

					this.grid.addPiece(piece);
				}
			}
		}, {
			key: 'getStartPt',
			value: function getStartPt() {
				return this.startPoint;
			}
		}, {
			key: 'getEndPt',
			value: function getEndPt() {
				return this.endPoint;
			}
		}, {
			key: 'serialize',

			//list all pieces locations and sizes
			value: function serialize() {
				return 'Level: ' + this.grid.serialize();
			}
		}, {
			key: 'slideOut',
			value: function slideOut(callback) {}
		}, {
			key: 'remove',
			value: function remove() {
				this.grid.remove();
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'Level: ' + this.name;
			}
		}]);

		return Level;
	})();

	;

	return Level;
});
