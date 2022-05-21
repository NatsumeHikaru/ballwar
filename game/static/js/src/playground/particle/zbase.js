class Particle extends BallwarGameObject{
	constructor(playground, x, y, radius, vx, vy, color, speed, move_length){
		super();
		this.playground = playground;
		this.ctx = this.playground.game_map.ctx;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.vx = vx;
		this.vy = vy;
		this.color = color;
		this.speed = speed;
		this.move_length = move_length;
		this.eps = 3;
		this.friction = 0.5;
	}

	start(){

	}

	update(){
		if(this.speed < this.eps || this.move_length < this.eps){
			this.destroy();
			return false;
		}
		
		let move_dist = Math.min(this.move_length, this.speed * this.timedelta / 1000);
		this.x += this.vx * move_dist;
		this.y += this.vy * move_dist;
		this.speed *= this.friction;
		this.move_length -= move_dist;
		this.render();
	}

	render(){
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}
}
