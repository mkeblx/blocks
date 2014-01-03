define(function(require){

var Player = require('Player'),
    Level = require('Level'),
    LevelGenerator = require('LevelGenerator');

var Game = Class.extend({
	init: function(settings){

		this.gridSize = 100;

		this.currLevel = 0;
		this.levels = [];
		this.level = null;

		this.numLevels = window.levelData.levels.length;

		//load levels
		for (var i = 0; i < this.numLevels; i++) {
			this.levels.push(new Level(window.levelData.levels[i]));
		}

		this.player = new Player('Moi');
	},

	startLevel: function(levelNum)
	{
		this.level = this.levels[levelNum];

		$('#level').html(this.level.name);

		this.level.setup();
		this.level.grid.draw();

		this.player.setStartPosition(this.level.getStartPt());
	},

	resetLevel: function()
	{
		this.level.remove();

		if (this.currLevel === this.levels.length)
			this.currLevel--;
		this.startLevel(this.currLevel);
	},

	//go to a new random level
	randomLevel: function(size)
	{
		var lvlStr = LevelGenerator.generate(size);
		var lvl = new Level({grid: [size, size], name: 'random', pieces: lvlStr});

		this.level.remove();

		lvl.setup();
		lvl.grid.draw();
		this.player.setStartPosition(lvl.getStartPt());
		this.level = lvl;
	},

	//reset stuff for next level
	//TODO: append record of time to sidebar
	gotoNextLevel: function(inc)
	{
		if (inc)
			this.currLevel++;

		//reached last level
		if (this.currLevel >= this.levels.length) {
			this.gameComplete();
			return false;
		}

		$('#results').append('<div><span>'+this.currLevel+'</span><span class="time">'+'0:00'+'</span></div>');

		//reset stuff
		this.level.remove();

		this.startLevel(this.currLevel);

		return true;
	},

	//completed all the levels
	//ideas: do a credits roll or some cool animation stuff
	gameComplete: function()
	{
		alert('You\'ve won! You must pay for more levels');
	},

	draw: function() {
		//draw grid

	}

});

return Game;

});