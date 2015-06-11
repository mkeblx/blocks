'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define(function (require) {

	var GPoint = require('GPoint');

	//TODO: need a way of generating the levels in a non-random way
	//enumeration through all the possible combinations
	/*
 
 Very possible based on a few ideas:
 -can generate all levels with a certain number of pieces
 --ie. 1 piece
 
 
 also, enough calls to generate(SIZE) will generate all levels
 */

	var LevelGenerator = (function () {
		function LevelGenerator() {
			_classCallCheck(this, LevelGenerator);

			this.levelsGenerated = 0;
		}

		_createClass(LevelGenerator, [{
			key: 'generate',

			//generate a random level string
			//of form [row,col]:pieceSize+...
			//@param size size of grid (rows==cols)
			value: function generate(size) {
				if (size < 2) {
					console.error('level size too small');
					return false;
				}

				var pcs = [];

				var maxSize = size;

				for (var r = 0; r < size; r++) {
					for (var c = 0; c < size; c++) {
						var pcSize = Math.floor(Math.random() * maxSize);
						if (pcSize > 0) pcs.push('[' + r + ',' + c + ']:' + pcSize);
					}
				}

				str = pcs.join('+');
				this.levelsGenerated++;
				return str;
			}
		}, {
			key: 'generateAllLevelsRandomly',

			// not all, as not enumerating unless testing
			value: function generateAllLevelsRandomly(size) {
				var levels = [];

				for (var n = 0; n < 100; n++) {
					//100 for now
					var lvl = this.generate(size);
				}

				levels.push(lvl);
				return levels;
			}
		}, {
			key: 'generateAllLevels',

			//generate all possible levels for a certain size board
			value: function generateAllLevels(size) {
				var levels = [];

				var lvl = '';
				var maxPieces = size * size;
				var maxLength = size;

				//create all levels from with p pieces p:[0,maxPieces]
				for (var p = 1; p < maxPieces; p++) {
					//generate all levels with p pieces
					lvl = '';
					for (var i = 0; i < p; i++) {

						//iterate through each location
						for (var r = 0; r < size; r++) {
							for (var c = 0; c < size; c++) {

								for (var l = 1; l < maxLength; l++) {
									lvl += '[' + r + ',' + c + ']:' + l;
								}
							}
						}
					}
					levels.push(lvl);
				}

				return levels;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'LevelGenerator: ' + this.levelsGenerated;
			}
		}]);

		return LevelGenerator;
	})();

	;

	return LevelGenerator;
});
