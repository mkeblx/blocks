'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define(function (require) {

	var GPoint = require('GPoint'),
	    Level = require('Level'),
	    Grid = require('Grid');

	//Functions for testing if levels are: valid, solvable, equivalent, and determining complexity

	var LevelTester = (function () {
		function LevelTester() {
			_classCallCheck(this, LevelTester);

			this.errors = [];
		}

		_createClass(LevelTester, [{
			key: 'validate',

			//validate a level given as a string
			//where valid means pieces fit on board and under maxSize (size of board)
			//str example: ""
			/*
   no duplicate pieces at same place on grid
   pieces in order from row first, column second
   */
			value: function validate(str, size) {
				var pieces = str.split('+');

				//pc: [r,c]:4

				var piecesArr = [];

				if (pieces.length > size * size) return false;

				//basic check of format
				for (var i = 0; i < pieces.length; i++) {
					var pcStr = pieces[i];
					var parts = pcStr.split(':');

					if (parts.length !== 2) {
						this.errors = 'Improper piece format, : seperator';
						return false;
					}

					var pcLen = Number(parts[1]);
					if (pcLen > size) {
						this.errors.push('Improper piece format, piece two long for board');
						return false;
					}

					var coords = parts[0];
					//coords = coords.substring(1,coords.length-1);

					coords = coords.split(',');
					if (coords.length !== 2) {
						this.errors.push('Improper piece format, point format');
						return false;
					}

					var row = Number(coords[0]);
					var col = Number(coords[1]);

					if (row >= size || col >= size || row < 0 || col < 0) {
						this.errors.push('Improper piece location: not on board');
						return false;
					}

					piecesArr.push({ x: row, y: col, len: pcLen });
				}

				//check for piece ordering
				//pieces should be ordered, so must check to be sure

				if (piecesArr.length === 1) return true;

				for (var j = 0; j < piecesArr.length - 1; j++) {
					var pc = piecesArr[j];
					var pc2 = piecesArr[j + 1];

					var pcG = pc.x * size + pc.y;
					var pc2G = pc2.x * size + pc2.y;

					if (pcG === pc2G) //occupy same spot
						return false;

					if (pc2G < pcG) return false;
				}

				//all good
				return true;
			}
		}, {
			key: 'normalize',

			//normalize a level string
			value: function normalize(lvlStr) {
				return lvlStr;
			}
		}, {
			key: 'equivalent',

			//test whether two levels are equivalent
			//equivalent: same except for rotations, unreachable pieces, reflections
			//for now => exact same
			value: function equivalent(lvlStr, lvlStr2) {
				var eq = false;
				if (lvlStr === lvlStr2) eq = true;

				//

				return eq;
			}
		}, {
			key: 'solvable',

			//test whether a level is solvable
			//this is a bigger guy
			value: function solvable(lvlStr) {
				return true;
			}
		}, {
			key: 'complexity',

			//generate some kind of determination of the complexity
			//of a level based on a number of factors: # or moves required, choices have to make, etc
			value: function complexity(lvlStr) {
				return 0; //single numeric?
			}
		}, {
			key: 'getLastError',
			value: function getLastError() {
				if (this.errors.length) return this.errors.pop();
				return false;
			}
		}]);

		return LevelTester;
	})();

	;

	return LevelTester;
});
