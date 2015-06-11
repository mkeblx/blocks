define(function(require){

var GPoint = require('GPoint');

//TODO: need a way of generating the levels in a non-random way
//enumeration through all the possible combinations
/*

Very possible based on a few ideas:
-can generate all levels with a certain number of pieces
--ie. 1 piece


also, enough calls to generate(SIZE) will generate all levels
*/ 

var LevelGenerator = {
	init: function(){
		this.levelsGenerated = 0;
	},

	//generate a random level string
	//of form [row,col]:pieceSize+...
	//@param size size of grid (rows==cols)
	generate: function(size){
		if (size < 2) {
			console.error('level size too small');
			return false;
		}

		var pcs = [];

		var maxSize = size;

		for (var r = 0; r < size; r++) {
			for (var c = 0; c < size; c++) {
				var pcSize = Math.floor(Math.random()*maxSize);
				if (pcSize > 0)
					pcs.push('['+r+','+c+']:'+pcSize);
			}
		}

		str = pcs.join('+');
		this.levelsGenerated++;
		return str;
	},

	// not all, as not enumerating unless testing
	generateAllLevelsRandomly: function(size)
	{
		var levels = [];

		for (var n = 0; n < 100; n++) { //100 for now
			var lvl = this.generate(size);
		}

		levels.push(lvl);
		return levels;
	},

	//generate all possible levels for a certain size board
	generateAllLevels: function(size)
	{
		var levels = [];

		var lvl = "";
		var maxPieces = size*size;
		var maxLength = size;

		//create all levels from with p pieces p:[0,maxPieces]
		for (var p = 1; p < maxPieces; p++) {
			//generate all levels with p pieces
			lvl = "";
			for (var i = 0; i < p; i++) {
				
				//iterate through each location
				for (var r = 0; r < size; r++) {
					for (var c = 0; c < size; c++) {
				
						for (var l = 1; l < maxLength; l++) {
							lvl += "["+r+','+c+"]:"+l;
						}
					}
				}
			}
			levels.push(lvl);
		}

		return levels;
	},

	toString: function(){
		return "LevelGenerator: " + this.levelsGenerated;
	}

};

return LevelGenerator;

});