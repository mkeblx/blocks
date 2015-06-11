define(['exports', 'module', 'Player', 'Level', 'LevelGenerator'], function (exports, module, _Player, _Level, _LevelGenerator) {
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Player2 = _interopRequireDefault(_Player);

	var _Level2 = _interopRequireDefault(_Level);

	var _LevelGenerator2 = _interopRequireDefault(_LevelGenerator);

	var Game = (function () {
		function Game(settings) {
			_classCallCheck(this, Game);

			this.gridSize = 100;

			this.gameCompleted = false;

			this.currLevel = 0;
			this.levels = [];
			this.level = null;

			this.numLevels = window.levelData.levels.length;

			this.setup();
		}

		_createClass(Game, [{
			key: 'setup',
			value: function setup() {
				//load levels
				for (var i = 0; i < this.numLevels; i++) {
					this.levels.push(new _Level2['default'](window.levelData.levels[i]));
				}

				this.player = new _Player2['default']('Moi');

				this.time = 0;
				this.timer = null;

				this.draw();
			}
		}, {
			key: 'startLevel',
			value: function startLevel(levelNum) {
				this.level = this.levels[levelNum];

				$('#level').html(this.level.name);

				this.level.setup();
				this.level.grid.draw();

				this.player.setStartPosition(this.level.getStartPt());

				this.startTimer();
			}
		}, {
			key: 'resetLevel',
			value: function resetLevel() {
				this.player.hide();
				this.level.remove();

				if (this.currLevel === this.levels.length) this.currLevel--;
				this.startLevel(this.currLevel);
			}
		}, {
			key: 'randomLevel',

			//go to a new random level
			value: function randomLevel(size) {
				var lvlStr = _LevelGenerator2['default'].generate(size);
				var lvl = new _Level2['default']({ grid: [size, size], name: 'random', pieces: lvlStr });

				this.level.remove();

				lvl.setup();
				lvl.grid.draw();
				this.player.setStartPosition(lvl.getStartPt());
				this.level = lvl;
			}
		}, {
			key: 'gotoNextLevel',

			//reset stuff for next level
			value: function gotoNextLevel(inc) {
				if (inc) this.currLevel++;

				var levelTime = $('#timer').html();

				if (this.gameCompleted) return false;

				$('#results').append('<div><span class="lvl">' + this.currLevel + '</span><span class="time">' + levelTime + '</span></div>');

				//reset stuff
				this.level.remove();

				//reached last level
				if (this.currLevel >= this.levels.length) {
					this.gameComplete();
					return false;
				}

				this.startLevel(this.currLevel);

				return true;
			}
		}, {
			key: 'gameComplete',

			//completed all the levels
			value: function gameComplete() {
				this.gameCompleted = true;

				this.player.el.hide = true;

				$('#menu').show().addClass('scale-in');
				$('#menu').find('.btn').remove();
				$('#menu #instructions').html('<h3>Game Complete!</h3>');

				//alert('You\'ve won! You must pay for more levels');
			}
		}, {
			key: 'startTimer',
			value: function startTimer() {
				if (this.timer) this.stopTimer();

				var that = this;

				this.time = 0;
				this.timer = setInterval(function () {
					that.updateTimer();
				}, 1000);
			}
		}, {
			key: 'stopTimer',
			value: function stopTimer() {
				clearInterval(this.timer);
			}
		}, {
			key: 'updateTimer',
			value: function updateTimer() {
				this.time++;

				var formatTime = Math.round(this.time / 60) + ':' + (this.time % 60 < 10 ? '0' : '') + this.time % 60;

				$('#timer').html(formatTime);
			}
		}, {
			key: 'draw',
			value: function draw() {
				var color = BG_COLOR;

				var floorMaterial = new THREE.MeshLambertMaterial({
					color: color,
					side: THREE.DoubleSide });

				var floorGeometry = new THREE.CircleGeometry(this.gridSize * 200, 20, 0, Math.PI * 2);

				var floor = new THREE.Mesh(floorGeometry, floorMaterial);
				floor.rotation.x = 90 * Math.deg2rad;
				floor.position.y = -4;
				floor.receiveShadow = true;

				window.scene.add(floor);
			}
		}]);

		return Game;
	})();

	;

	module.exports = Game;
});
