define(function(require){

var Player = require('Player'),
    Level = require('Level'),
    LevelGenerator = require('LevelGenerator');

var Game = Class.extend({

	init: function(settings)
	{
		this.gridSize = 100;

		this.gameCompleted = false;

		this.currLevel = 0;
		this.levels = [];
		this.level = null;

		this.numLevels = window.levelData.levels.length;

		this.setup();
	},


	setup: function()
	{
		//load levels
		for (var i = 0; i < this.numLevels; i++) {
			this.levels.push(new Level(window.levelData.levels[i]));
		}

		this.player = new Player('Moi');

		this.time = 0;
		this.timer = null;

		this.draw();
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
		this.player.hide();
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

		if (this.gameCompleted)
			return false;


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
	gameComplete: function()
	{
		this.gameCompleted = true;

		this.player.el.hide = true;

		$('#menu').show().addClass('scale-in');
		$('#menu').find('.btn').remove();
		$('#menu #instructions').html('<h3>Game Complete!</h3>');

		//alert('You\'ve won! You must pay for more levels');
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

	draw: function()
	{
		var color = BG_COLOR;

		var floorMaterial = new THREE.MeshLambertMaterial({
			color: color,
			side: THREE.DoubleSide });

		var floorGeometry = new THREE.CircleGeometry( this.gridSize*200, 20, 0, Math.PI * 2 );

		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = 90*Math.deg2rad;
		floor.position.y = -4;
		floor.receiveShadow = true;

		scene.add(floor);
	}

});

return Game;

});