define(function(require){

var GPoint = require('GPoint');

var Player = Class.extend({
	init: function(name){
		this.name = name;
		this.el = null;
	},

	setStartPosition: function(pos)
	{
		this.pos = new GPoint(pos.x, pos.y);

		var first = !this.el;

		if (first)
			this.draw();
		
		this.update();

		if (!first)
			this.scale(0.1, 1.0, 400, 300);
	},

	//move, if possible
	move: function(dir)
	{
		var newPos = this.pos.copy().add(dir);

		var grid = game.level.grid;

		if (!grid.onGrid(newPos))
			return false;

		var nextState = grid.stateAt(newPos);
		var currState = grid.stateAt(this.pos);

		var endPt = game.level.getEndPt();

		if (endPt.equals(this.pos))
			return false;

		if (nextState === 'PIECE_UP' || nextState === 'PIECE_DOWN') {
			//noop, continue onwards
		} else { // nextState is empty
			if (currState === 'PIECE_UP') {
				//okay, *might* want to knock down a piece
				var currPiece = grid.pieceAt(this.pos);
				if (currPiece == null)
					return false;

				var knockedDown = currPiece.knockDown(dir);
				if (knockedDown) {
					grid.setStateFrom(newPos, dir, currPiece.len, 'PIECE_DOWN');

					grid.setStateAt(this.pos, 0);
				} else {
					return false;
				}
				//TODO: do all the knocking down, and etc here
	
			} else if (currState === 'PIECE_DOWN') {
				return false;
			}
		}

		//player move
		this.pos.add(dir);
		this.update();

		if (endPt.equals(this.pos)) {

			var plr = this.el;

			var tween = new TWEEN.Tween({ s: 1 })
				.to({ s: 0.1 }, 400)
				.onUpdate(function(){
					plr.scale.set(this.s, this.s, this.s);
				})
				.onComplete(
					function(){
						game.gotoNextLevel(true);
					})
				.easing(TWEEN.Easing.Back.In)
				.delay(400)
				.start();
		}

		return true;
	},

	update: function(){
		var gridSize = game.gridSize;

		var d = (game.level.grid.rows-1)*gridSize / 2;

		var endX = this.pos.x*gridSize - d;
		var endY = this.pos.y*gridSize - d;
		var endZ = gridSize*game.level.grid.heightAt(this.pos) + gridSize/4;

		var plr = this.el;

		var at = {
			x: this.el.position.x,
			y: this.el.position.z,
			z: this.el.position.y};
		var target = {
			x: endX,
			y: endY,
			z: endZ };

		var deltaT = 400;

		var tween = new TWEEN.Tween(at)
			.to(target, deltaT)
			.onUpdate(function(){
				plr.position.set(this.x, this.z, this.y);
			})
			.easing(TWEEN.Easing.Cubic.Out);

		if (config.animate.player) {
			tween.start();
		} else {
			plr.position.set(endX, endZ, endY);
		}

	},

	draw: function(redraw){
		var gridSize = game.gridSize;

		var r = gridSize / 4;
		var geometry = new THREE.SphereGeometry(r, 24, 16);
		var material = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			shading: THREE.SmoothShading,
			overdraw: true});

		mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;


		scene.add(mesh);

		this.el = mesh;
	},

	hide: function() {
		this.el.scale.set(0);
	},

	scale: function(from, to, time, delay) {
		var plr = this.el;

		var tween = new TWEEN.Tween({ s: from })
			.to({ s: to }, time)
			.onUpdate(function(){
				plr.scale.set(this.s, this.s, this.s);
			})
			.easing(TWEEN.Easing.Back.Out)
			.delay(delay)
			.start();
	},

	toString: function(){
		return this.name + '@' + this.pos;
	}
});

return Player;

});