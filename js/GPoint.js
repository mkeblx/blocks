define(function(){

var GPoint = Class.extend({
	init: function(x,y){
		this.x = x;
		this.y = y;
	},

	copy: function(){
		return new GPoint(this.x, this.y);
	},

	addX: function(n){
		this.x += n;
	},
	addY: function(n){
		this.y += n;
	},

	add: function(pt){
		this.x += pt.x;
		this.y += pt.y;
		return this;
	},

	//scalar
	mult: function(s){
		this.x *= s;
		this.y *= s;
		return this;
	},

	set: function(pt, y){
		if (this.arguments === 1) {
			this.x = pt.x;
			this.y = pt.y;
		} else {
			this.x = pt;
			this.y = y;
		}
		return this;
	},

	//compare two pieces for ordering
	compare: function(b){
		return 0;
	},

	equals: function(pt){
		return (this.x === pt.x && this.y === pt.y);
	},

	toString: function(){
		return '['+this.x+','+this.y+']';
	}
});

return GPoint;

});