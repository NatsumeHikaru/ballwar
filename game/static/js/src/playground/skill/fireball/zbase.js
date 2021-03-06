class FireBall extends BallwarGameObject{
	constructor(playground, player, x , y, radius, vx, vy, color, speed, move_length, damage){
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
		this.damage = damage;
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

		for(let i=0;i<this.playground.players.length;++i){
			let player = this.playground.players[i];
			if(this.player !==	player && this.check_collision(player)){
				this.attack(player);
			}
		}

		this.render();
	}

	get_dist(x1, y1, x2, y2){
		let dx = x1 - x2;
		let dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	}

	check_collision(player){
		let dist = this.get_dist(this.x, this.y, player.x, player.y);
		if(dist < this.radius + player.radius) return true;
		return false;
	}

	attack(player){
		let angle = Math.atan2(player.y - this.y, player.x - this.x);
		player.be_attacked(angle, this.damage);
		this.destroy();
	}

	render(){
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}
}
