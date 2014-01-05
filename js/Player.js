define(function(require){

var GPoint = require('GPoint');

var Player = Class.extend({
	init: function(name){
		this.name = name;
	},

	setStartPosition: function(pos)
	{
		this.pos = new GPoint(pos.x, pos.y);

		if (!this.el)
			this.draw();
		
		this.update();
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

		var endPt = game.level.getEndPt();
		if (endPt.equals(this.pos)) {
			game.gotoNextLevel(true);
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

		var animate = 1;

		var deltaT = 400; // make dynamic based on dist

		var tween = new TWEEN.Tween(at)
			.to(target, deltaT)
			.onUpdate(function(){
				plr.position.set(this.x, this.z, this.y);
			})
			.easing(TWEEN.Easing.Cubic.Out);

		if (animate) {
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

	toString: function(){
		return this.name + '@' + this.pos;
	}
});

return Player;

});