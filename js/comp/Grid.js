define(['exports', 'module', 'GPoint'], function (exports, module, _GPoint) {
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _GPoint2 = _interopRequireDefault(_GPoint);

	var Grid = (function () {
		function Grid(rows, cols) {
			_classCallCheck(this, Grid);

			this.rows = rows;
			this.cols = cols;
			this.pieces = [];
			this.pcContainer;

			this.matrix = []; //rows=>cols

			this.DIRS = {
				'LEFT': new _GPoint2['default'](-1, 0),
				'UP': new _GPoint2['default'](0, -1),
				'RIGHT': new _GPoint2['default'](1, 0),
				'DOWN': new _GPoint2['default'](0, 1) };

			//0 set where numeric codes have meaning
			for (var i = 0; i < cols * rows; i++) {
				this.matrix.push(0);
			}
		}

		_createClass(Grid, [{
			key: 'onGrid',

			//wether coords are on grid
			value: function onGrid(pt) {
				return !(pt.x >= this.cols || pt.x < 0 || pt.y >= this.rows || pt.y < 0);
			}
		}, {
			key: 'setStateAt',
			value: function setStateAt(pt, state) {
				if (!this.onGrid(pt)) return false;

				this.matrix[pt.y * this.cols + pt.x] = state;
			}
		}, {
			key: 'stateAt',

			//get state of grid at x,y
			value: function stateAt(pt) {
				if (!this.onGrid(pt)) return null;

				var ref = this.matrix[pt.y * this.cols + pt.x];

				return ref;
				//TODO: check type of ref and do with
			}
		}, {
			key: 'emptyAt',

			//return bool if empty at x,y
			value: function emptyAt(pt) {
				return this.stateAt(pt) === 0;
			}
		}, {
			key: 'heightAt',

			//return height at point
			value: function heightAt(pt) {
				var state = this.stateAt(pt);

				if (state === 0) return 0;else if (state === 'PIECE_DOWN') return 1;else if (state === 'PIECE_UP') {
					var pc = this.pieceAt(pt);
					return pc.len;
				} else return null;
			}
		}, {
			key: 'emptyFrom',

			//return bool if empty in direction, by length
			value: function emptyFrom(point, direction, len) {
				var pt = point.copy();

				for (var i = 0; i < len; i++) {
					pt.add(direction);

					if (!this.emptyAt(pt)) {
						console.log('emptyFrom: not empty at: ', pt.x, pt.y);
						return false;
					}
				}
				return true;
			}
		}, {
			key: 'setStateFrom',

			//
			value: function setStateFrom(point, direction, len, state) {
				var pt = point.copy();

				for (var i = 0; i < len; i++) {
					this.setStateAt(pt, state);

					pt.add(direction);
				}
				return true;
			}
		}, {
			key: 'getEmptyPt',

			//look through grid and find empty point
			value: function getEmptyPt() {
				do {
					var x = Math.floor(Math.random() * this.cols);
					var y = Math.floor(Math.random() * this.rows);
				} while (this.stateAt(x, y) !== 0);

				return { x: x, y: y };
			}
		}, {
			key: 'pieceAt',

			//return piece at x,y if possible
			value: function pieceAt(pt) {
				//TODO: use this.matrix somehow

				var numPieces = this.pieces.length;
				for (var i = 0; i < numPieces; i++) {
					var p = this.pieces[i];

					if (p.pt.x == pt.x && p.pt.y == pt.y) return p;
				}

				return null;
			}
		}, {
			key: 'addPiece',
			value: function addPiece(piece) {
				this.pieces.push(piece);

				var pcPt = piece.pt;

				this.matrix[pcPt.y * this.cols + pcPt.x] = 'PIECE_UP';
			}
		}, {
			key: 'draw',
			value: function draw() {
				var gridSize = game.gridSize;
				var tW = gridSize * this.cols;
				var tH = gridSize * this.rows;

				var size = this.rows / 2 * gridSize,
				    step = gridSize;

				var geometry = new THREE.Geometry();

				for (var i = -size; i <= size; i += step) {
					geometry.vertices.push(new THREE.Vector3(-size, 0, i));
					geometry.vertices.push(new THREE.Vector3(size, 0, i));

					geometry.vertices.push(new THREE.Vector3(i, 0, -size));
					geometry.vertices.push(new THREE.Vector3(i, 0, size));
				}

				var material = new THREE.LineBasicMaterial({
					color: 14540253,
					linewidth: 2,
					transparent: false });

				var line = new THREE.Line(geometry, material);
				line.type = THREE.LinePieces;
				window.scene.add(line);
				this.el = line;

				this.drawPieces();
			}
		}, {
			key: 'drawPieces',
			value: function drawPieces() {
				this.pcContainer = new THREE.Object3D();
				for (var p = 0; p < this.pieces.length; p++) {
					var pc = this.pieces[p];
					var pcObj = pc.draw(this.board, p === this.pieces.length - 1 ? true : false, p);
					//this.pcContainer.add(pcObj);
				}
			}
		}, {
			key: 'remove',
			value: function remove() {
				window.scene.remove(this.el);
				this.pcContainer = null;

				for (var p = 0; p < this.pieces.length; p++) {
					var pc = this.pieces[p];
					pc.remove();
				}
			}
		}, {
			key: 'serialize',

			//list all pieces locations and sizes
			value: function serialize() {
				var str = [];
				for (var i = 0; i < this.pieces.length; i++) {
					str.push(this.pieces[i].toString());
				}
				str = str.join('+');
				return str;
			}
		}, {
			key: 'toString',

			//TODO: show matrix
			value: function toString() {
				return 'Grid: ' + this.rows + 'x' + this.cols;
			}
		}]);

		return Grid;
	})();

	;

	Grid.DIRS = {
		'LEFT': new _GPoint2['default'](-1, 0),
		'UP': new _GPoint2['default'](0, -1),
		'RIGHT': new _GPoint2['default'](1, 0),
		'DOWN': new _GPoint2['default'](0, 1) };

	module.exports = Grid;
});
