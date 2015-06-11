define(['exports', 'module'], function (exports, module) {
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Piece = (function () {
		function Piece(length, pt) {
			_classCallCheck(this, Piece);

			this.len = Math.max(length, 1);
			this.pt = pt;
			this.isUp = true;
			this.direction = null;

			this.el = null;
			this.id = 'pc' + String(this.pt.x) + '_' + String(this.pt.y);
		}

		_createClass(Piece, [{
			key: 'copy',
			value: function copy() {
				return new Piece(this.len, this.pt);
			}
		}, {
			key: 'knockDown',

			//handles checking if can knock down, returns true if knocked down
			value: function knockDown(dir) {

				var len = this.len;

				if (len >= game.level.grid.rows || len >= game.level.grid.cols) return false;

				var endPt = this.pt.copy();
				endPt.add(dir.copy().mult(len));

				if (!game.level.grid.onGrid(endPt)) return false;
				if (!game.level.grid.emptyFrom(this.pt, dir, len)) return false;

				//made it here, do the knock down
				this.pt.add(dir);

				this.isUp = false;
				this.direction = dir;

				this.update(endPt);

				return true;
			}
		}, {
			key: 'update',
			value: function update(endPt) {
				var dir = this.direction,
				    len = this.len;
				var gridSize = game.gridSize;

				var p = this.el;
				var c = this.c;

				var axis = 'x',
				    axis2 = 'z',
				    sign = dir.y;
				if (dir.x !== 0) {
					axis = 'z';axis2 = 'x', sign = dir.x;
				}

				var endAngle = dir.x !== 0 ? sign * -90 * Math.deg2rad : sign * 90 * Math.deg2rad;

				var animate = 1;

				var at = { angle: c.rotation[axis] };
				var target = { angle: endAngle };

				var deltaT = 400;

				var tween = new TWEEN.Tween(at).to(target, deltaT).onUpdate(function () {
					c.rotation[axis] = this.angle;
				}).easing(TWEEN.Easing.Cubic.Out);

				p.position[axis2] += -1 * sign * gridSize / 2;

				if (animate) {
					tween.start();
				} else {
					c.rotation[axis] = endAngle;
				}

				c.position[axis2] += sign * gridSize / 2;
			}
		}, {
			key: 'draw',

			//endPiece?: boolean
			value: function draw(board, endPiece, n) {
				var gridSize = game.gridSize;

				var space = 0;

				var geometry = new THREE.BoxGeometry(gridSize - space, gridSize * this.len, gridSize - space);
				var color = endPiece ? 6710886 : Piece.COLORS[this.len - 1];
				var material = new THREE.MeshLambertMaterial({
					color: color,
					overdraw: true,
					transparent: 1,
					opacity: 0.7 });

				var p = new THREE.Mesh(geometry, material);

				var d = -(game.level.grid.rows - 1) * gridSize / 2;

				var container = new THREE.Object3D();
				container.position.x = d + this.pt.x * gridSize;
				container.position.z = d + this.pt.y * gridSize;

				p.position.y = -5000;

				p.castShadow = true;
				p.receiveShadow = true;

				container.add(p);
				this.el = p;
				this.c = container;
				window.scene.add(container);

				this.slide(n, false);
			}
		}, {
			key: 'slide',
			value: function slide(n, out) {
				var deltaT = 750;

				var endPos = this.len * game.gridSize / 2;
				var p = this.el;
				var at = { s: -endPos },
				    target = { s: endPos + 1 };

				var tween = new TWEEN.Tween(at).to(target, deltaT).onUpdate(function () {
					p.position.y = this.s;
				}).delay(100 * n).easing(TWEEN.Easing.Cubic.Out).start();
			}
		}, {
			key: 'remove',
			value: function remove() {
				window.scene.remove(this.c);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return this.pt.toString() + ':' + this.len;
			}
		}]);

		return Piece;
	})();

	;

	Piece.COLORS = [14622495, 14659359, 8445727, 2088784, 2088927, 2052063, 8331231, 14622639, 15724527, 3158064];

	module.exports = Piece;
});
