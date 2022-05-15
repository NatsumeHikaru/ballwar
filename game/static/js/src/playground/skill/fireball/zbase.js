class FireBall extends BallwarGameObject{
	constructor(playground, player, x , y, radius, vx, vy, color, speed, move_length){
		super();
		this.playground = playground;
		this.player = player;
		this.ctx = this.playground.game_map.ctx;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.radius = radius;
		this.color = color;
		this.speed = speed;
		this.move_length = move_length;
		this.eps = 0.1;
	}

	start(){

	}

	update(){
		if(this.move_length < this.eps){
			this.destroy();
			return false;
		}

		let move_realdist = Math.min(this.move_length, this.speed * this.timedelta / 1000);
		this.x += this.vx * move_realdist;
		this.y += this.vy * move_realdist;
		this.move_length -= move_realdist;

		this.render();
	}

	render(){
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}
}
