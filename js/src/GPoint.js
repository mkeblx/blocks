
class GPoint {

	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	copy() {
		return new GPoint(this.x, this.y);
	}

	addX(n) {
		this.x += n;
	}
	addY(n) {
		this.y += n;
	}

	add(pt) {
		this.x += pt.x;
		this.y += pt.y;
		return this;
	}

	//scalar
	mult(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	set(pt, y) {
		if (this.arguments === 1) {
			this.x = pt.x;
			this.y = pt.y;
		} else {
			this.x = pt;
			this.y = y;
		}
		return this;
	}

	//compare two pieces for ordering
	compare(b) {
		return 0;
	}

	equals(pt) {
		return (this.x === pt.x && this.y === pt.y);
	}

	toString() {
		return '['+this.x+','+this.y+']';
	}

};

export default GPoint;
