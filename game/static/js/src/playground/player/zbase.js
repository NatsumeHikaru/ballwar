class Player extends BallwarGameObject{
	constructor(playground, x, y, radius, color, speed, is_me){
		super();
		this.playground = playground;
		this.ctx = this.playground.game_map.ctx;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.move_length = 0;
		this.radius = radius;
		this.color = color;
		this.speed = speed;
		this.is_me = is_me;
		this.eps = 0.1;
	}

	start(){
		if(this.is_me){
			this.add_listening_events();
		}
	}

	add_listening_events(){
		let outer = this;
		this.playground.game_map.$canvas.on("contextmenu", function(){
			return false;
		});
		this.playground.game_map.$canvas.mousedown(function(e){
			if(e.which = 1){
				outer.move_to(e.clientX, e.clientY);
			}
		});
	}

	get_dist(x1, y1, x2, y2){
		let dx = x1 - x2;
		let dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	}

	move_to(tx, ty){
		this.move_length = this.get_dist(this.x, this.y, tx, ty);
		let angle = Math.atan2(ty - this.y, tx - this.x);
		this.vx = Math.cos(angle);
		this.vy = Math.sin(angle);

	}

	update(){
		if(this.move_length < this.eps){
			this.move_length = 0;
			this.vx = this.vy = 0;
		}
		else{
			let move_realdist = Math.min(this.move_length, this.speed * this.timedelta / 1000);
			this.x += this.vx *	move_realdist;
			this.y += this.vy * move_realdist;
			this.move_length -= move_realdist;
		}
		this.render();
	}

	render(){
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}
}
