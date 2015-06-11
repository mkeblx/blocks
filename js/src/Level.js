
import Grid from 'Grid';
import Piece from 'Piece';
import GPoint from 'GPoint';

class Level {

	constructor(levelData) {
		this.levelData = levelData;

		this.setup();
	}

	setup() {
		var levelData = this.levelData;
		this.name = levelData.name;

		var rows = levelData.grid[0];
		var cols = levelData.grid[1];

		this.grid = new Grid(rows, cols);
		this.startPoint = null;
		this.endPoint = null;

		var maxPieces = rows*cols;

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
			}
			else if (i === num-1) {
				this.endPiece = piece;
				this.endPoint = piece.pt;
			}

			this.grid.addPiece(piece);
		}
	}

	getStartPt() {
		return this.startPoint;
	}

	getEndPt() {
		return this.endPoint;
	}

	//list all pieces locations and sizes
	serialize() {
		return "Level: " + this.grid.serialize();

	}

	slideOut(callback) {
	}

	remove() {
		this.grid.remove();
	}

	toString() {
		return 'Level: ' + this.name;
	}

};

export default Level;
