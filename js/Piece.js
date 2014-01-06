define(function(){

var Piece = Class.extend({
	init: function(length, pt){
		this.len = Math.max(length,1);
		this.pt = pt;
		this.isUp = true;
		this.direction = null;

		this.el = null;
		this.id = 'pc'+String(this.pt.x)+'_'+String(this.pt.y);
	},

	copy: function(){
		return new Piece(this.len, this.pt);
	},

	//handles checking if can knock down, returns true if knocked down
	knockDown: function(dir){


		var len = this.len;

		if (len >= game.level.grid.rows || len >= game.level.grid.cols)
			return false;

		var endPt = this.pt.copy();
		endPt.add(dir.copy().mult(len));

		if (!game.level.grid.onGrid(endPt))
			return false;
		if (!game.level.grid.emptyFrom(this.pt,dir,len))
			return false;

		//made it here, do the knock down
		this.pt.add(dir);

		this.isUp = false;
		this.direction = dir;

		this.update(endPt);

		return true;
	},

	update: function(endPt) {
		var dir = this.direction, len = this.len;
		var gridSize = game.gridSize;

		var p = this.el;
		var c = this.c;

		var axis = 'x', axis2 = 'z', sign = dir.y;
		if (dir.x !== 0) {
			axis = 'z'; axis2 = 'x', sign = dir.x;
		}

		var endAngle = (dir.x !== 0) ? sign*-90*Math.deg2rad : sign*90*Math.deg2rad;

		var animate = 1;

		var at = { angle: c.rotation[axis] };
		var target = { angle: endAngle };

		var deltaT = 400;

		var tween = new TWEEN.Tween(at)
			.to(target, deltaT)
			.onUpdate(function(){
				c.rotation[axis] = this.angle;
 			})
			.easing(TWEEN.Easing.Cubic.Out);

		p.position[axis2] += -1*sign*gridSize/2;

		if (animate) {
			tween.start();
		} else {
			c.rotation[axis] = endAngle;
		}

		c.position[axis2] += sign*gridSize/2;
	},

	//endPiece?: boolean
	draw: function(board, endPiece){
		var gridSize = game.gridSize;

		var space = 0.1;

		var geometry = new THREE.CubeGeometry(gridSize-space, gridSize*this.len, gridSize-space);
		var color = (endPiece) ? 0x666666 : Piece.COLORS[this.len-1];
		var material = new THREE.MeshLambertMaterial({
			color: color,
			overdraw: true,
			transparent: 1,
			opacity: 0.7 });

		var container = new THREE.Object3D();

		var p = new THREE.Mesh(geometry, material);

		var d = -(game.level.grid.rows-1)*gridSize / 2;

		container.position.x = d + this.pt.x*gridSize;
		
		container.position.z = d + this.pt.y*gridSize;

		p.position.y = this.len * gridSize/2;

		p.castShadow = true;
		p.receiveShadow = true;

		container.add(p);

		var deltaT = 250; // make dynamic based on dist

		var at = {s: 0.0}, target = {s: 1.0};

		var tween = new TWEEN.Tween(at)
			.to(target, deltaT)
			.onUpdate(function(){
				p.scale.y = this.s;
			})
			.easing(TWEEN.Easing.Cubic.Out);

		tween.start();


		this.el = p;
		this.c = container;
		scene.add(container);
	},

	remove: function() {
		scene.remove(this.c);
	},

	toString: function(){
		return this.pt.toString()+':'+this.len;
	}
});

Piece.COLORS = [0xDF1F1F, 0xDFAF1F, 0x80DF1F, 0x1FDF50, 0x1FDFDF, 0x1F4FDF, 0x7F1FDF, 0xDF1FAF, 0xEFEFEF, 0x303030];

return Piece;

});