define(function(require){

var GPoint = require('GPoint'),
    Level = require('Level'),
    Grid = require('Grid');

//Functions for testing if levels are: valid, solvable, equivalent, and determining complexity
var LevelTester = Class.extend({
	init: function()
	{
		this.errors = [];
	},

	//validate a level given as a string
	//where valid means pieces fit on board and under maxSize (size of board)
	//str example: ""
	/*
	no duplicate pieces at same place on grid
	pieces in order from row first, column second
	*/
	validate: function(str, size)
	{
		var pieces = str.split('+');

		//pc: [r,c]:4

		var piecesArr = [];

		if (pieces.length > size*size)
			return false;

		//basic check of format
		for (var i = 0; i < pieces.length; i++) {
			var pcStr = pieces[i];
			var parts = pcStr.split(':');

			if (parts.length !== 2) {
				this.errors = "Improper piece format, : seperator";
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

			piecesArr.push({x:row, y:col, len:pcLen});
		}

		//check for piece ordering
		//pieces should be ordered, so must check to be sure

		if (piecesArr.length === 1)
			return true;

		for (var j = 0; j < piecesArr.length-1; j++){
			var pc = piecesArr[j];
			var pc2 = piecesArr[j+1];

			var pcG  =  pc.x *size+ pc.y;
			var pc2G = pc2.x *size+pc2.y;

			if (pcG === pc2G) //occupy same spot
				return false;

			if (pc2G < pcG)
				return false;
		}

		//all good
		return true;
	},

	//normalize a level string
	normalize: function(lvlStr)
	{
		return lvlStr;
	},

	//test whether two levels are equivalent
	//equivalent: same except for rotations, unreachable pieces, reflections
	//for now => exact same
	equivalent: function(lvlStr, lvlStr2)
	{
		var eq = false;
		if (lvlStr === lvlStr2)
			eq = true;

		//

		return eq;
	},

	//test whether a level is solvable
	//this is a bigger guy
	solvable: function(lvlStr)
	{
		return true;
	},

	//generate some kind of determination of the complexity
	//of a level based on a number of factors: # or moves required, choices have to make, etc
	complexity: function(lvlStr)
	{
		return 0.0; //single numeric?
	},

	getLastError: function()
	{
		if (this.errors.length)
			return this.errors.pop();
		return false;
	}
});

return LevelTester;

});