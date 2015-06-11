define(function(require){

var GPoint = require('GPoint');

class Grid {

	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.pieces = [];
		this.pcContainer;

		this.matrix = []; //rows=>cols

		this.DIRS = {
			'LEFT': 	new GPoint(-1,0),
			'UP': 		new GPoint(0,-1),
			'RIGHT': 	new GPoint(1,0),
			'DOWN': 	new GPoint(0,1)};

		//0 set where numeric codes have meaning
		for (var i = 0; i < cols*rows; i++) {
			this.matrix.push(0);
		}

	}

	//wether coords are on grid
	onGrid(pt){
		return !(pt.x >= this.cols || pt.x < 0
			  || pt.y >= this.rows || pt.y < 0);
	}

	setStateAt(pt, state){
		if (!this.onGrid(pt))
			return false;

		this.matrix[pt.y*this.cols+pt.x] = state;
	}

	//get state of grid at x,y
	stateAt(pt) {
		if (!this.onGrid(pt))
			return null;

		var ref = this.matrix[pt.y*this.cols+pt.x];

		return ref;
		//TODO: check type of ref and do with
	}

	//return bool if empty at x,y
	emptyAt(pt) {
		return this.stateAt(pt) === 0;
	}

	//return height at point
	heightAt(pt) {
		var state = this.stateAt(pt);

		if (state === 0)
			return 0;
		else if (state === 'PIECE_DOWN')
			return 1;
		else if (state === 'PIECE_UP') {
			var pc = this.pieceAt(pt);
			return pc.len;
		} else
			return null;
	}

	//return bool if empty in direction, by length
	emptyFrom(point, direction, len) {
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

	//
	setStateFrom(point, direction, len, state) {
		var pt = point.copy();

		for (var i = 0; i < len; i++) {
			this.setStateAt(pt, state);

			pt.add(direction);
		}
		return true;
	}

	//look through grid and find empty point
	getEmptyPt() {
		do {
			var x = Math.floor(Math.random()*this.cols);
			var y = Math.floor(Math.random()*this.rows);
		} while (this.stateAt(x,y) !== 0);

		return {x: x, y: y};
	}

	//return piece at x,y if possible
	pieceAt(pt) {
		//TODO: use this.matrix somehow

		var numPieces = this.pieces.length;
		for (var i = 0; i < numPieces; i++) {
			var p = this.pieces[i];

			if (p.pt.x == pt.x && p.pt.y == pt.y)
				return p;
		}

		return null;
	}

	addPiece(piece) {
		this.pieces.push(piece);

		var pcPt = piece.pt;

		this.matrix[pcPt.y*this.cols+pcPt.x] = "PIECE_UP";
	}

	draw() {
		var gridSize = game.gridSize;
		var tW = gridSize * this.cols;
		var tH = gridSize * this.rows;

		var size = this.rows/2*gridSize, step = gridSize;

		var geometry = new THREE.Geometry();

		for ( var i = - size; i <= size; i += step ) {
			geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
			geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

			geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
			geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
		}

		var material = new THREE.LineBasicMaterial({
			color: 0xdddddd,
			linewidth: 2,
			transparent: false });

		var line = new THREE.Line(geometry, material);
		line.type = THREE.LinePieces;
		window.scene.add(line);
		this.el = line;

		this.drawPieces();
	}

	drawPieces() {
		this.pcContainer = new THREE.Object3D();
		for (var p = 0; p < this.pieces.length; p++) {
			var pc = this.pieces[p];
			var pcObj = pc.draw(this.board, (p === this.pieces.length-1)?true:false, p);
			//this.pcContainer.add(pcObj);
		}
	}

	remove() {
		window.scene.remove(this.el);
		this.pcContainer = null;

		for (var p = 0; p < this.pieces.length; p++) {
			var pc = this.pieces[p];
			pc.remove();
		}
	}

	//list all pieces locations and sizes
	serialize() {
		var str = [];
		for (var i = 0; i < this.pieces.length; i++) {
			str.push(this.pieces[i].toString());
		}
		str = str.join('+');
		return str;
	}

	//TODO: show matrix
	toString() {
		return "Grid: " + this.rows + "x" + this.cols;
	}

};

Grid.DIRS = {
	'LEFT': 	new GPoint(-1,0),
	'UP': 		new GPoint(0,-1),
	'RIGHT': 	new GPoint(1,0),
	'DOWN': 	new GPoint(0,1)};

return Grid;

});