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

		this.time = 0;
		this.timer = null;
	},

	startLevel: function(levelNum)
	{
		this.level = this.levels[levelNum];

		$('#level').html(this.level.name);

		this.level.setup();
		this.level.grid.draw();

		this.player.setStartPosition(this.level.getStartPt());

		this.startTimer();
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
	gotoNextLevel: function(inc)
	{
		if (inc)
			this.currLevel++;

		var levelTime = $('#timer').html();

		$('#results').append('<div><span class="lvl">'+this.currLevel+'</span><span class="time">'+levelTime+'</span></div>');

		//reset stuff
		this.level.remove();

		//reached last level
		if (this.currLevel >= this.levels.length) {
			this.gameComplete();
			return false;
		}

		this.startLevel(this.currLevel);

		return true;
	},

	//completed all the levels
	//ideas: do a credits roll or some cool animation stuff
	gameComplete: function()
	{
		alert('You\'ve won! You must pay for more levels');
	},

	startTimer: function()
	{
		if (this.timer)
			this.stopTimer();

		var that = this;

		this.time = 0;
		this.timer = setInterval(function(){ that.updateTimer(); }, 1000);
	},

	stopTimer: function()
	{
		clearInterval(this.timer);
	},

	updateTimer: function()
	{
		this.time++;

		var formatTime = Math.round(this.time / 60) + ":" + (this.time % 60 < 10 ? '0' : '') + (this.time % 60);

		$('#timer').html(formatTime);
	},

	draw: function() {
		//draw grid

	}

});

return Game;

});