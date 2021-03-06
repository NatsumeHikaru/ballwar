class Player extends BallwarGameObject{
	constructor(playground, x, y, radius, color, speed, is_me){
		super();
		this.playground = playground;
		this.ctx = this.playground.game_map.ctx;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.damage_x = 0;
		this.damage_y = 0;
		this.damage_speed = 0;
		this.move_length = 0;
		this.radius = radius;
		this.color = color;
		this.speed = speed;
		this.is_me = is_me;
		this.eps = 0.1;
		this.friction = 0.5;
		this.time_spent = 0;
		this.cur_skill = null;

		if(this.is_me){
			this.img = new Image();
			this.img.src = this.playground.root.settings.photo;
			//this.img.src = "https://hikaru.com.cn/wp-content/uploads/2021/09/68656803_p0.png";
			console.log(this.img.src);
			console.log("hello");
		}
	}

	start(){
		if(this.is_me){
			this.add_listening_events();
		}
		else{
			let tx = Math.random() * this.playground.width, ty = Math.random() * this.playground.height;
			this.move_to(tx, ty);
		}
	}

	add_listening_events(){
		let outer = this;
		this.playground.game_map.$canvas.on("contextmenu", function(){
			return false;
		});
		this.playground.game_map.$canvas.mousedown(function(e){
			if(e.which === 3){
				outer.move_to(e.clientX, e.clientY);
			}
			else if(e.which === 1){
				if(outer.cur_skill === "fireball"){
					outer.shoot_fireball(e.clientX, e.clientY);
				}
				outer.cur_skill = null;
			}
		});

		$(window).keydown(function(e){
			if(e.which === 69){ // e
				outer.cur_skill = "fireball";
				return false;
			}
			else if(e.which === 87){ // W
				outer.move_to(outer.x, outer.y - 5);
			}
			else if(e.which === 65){ // A
				outer.move_to(outer.x - 5, outer.y);
			}
			else if(e.which === 83){ //S
				outer.move_to(outer.x, outer.y + 5);
			}
			else if(e.which === 68){ //D
				outer.move_to(outer.x + 5, outer.y);
			}
		});
	}

	shoot_fireball(tx, ty){
		let x = this.x, y = this.y;
		let radius = this.playground.height * 0.01;
		let angle = Math.atan2(ty - this.y, tx - this.x);
		let vx = Math.cos(angle), vy = Math.sin(angle);
		let color = "orange";
		let speed = this.playground.height * 0.55;
		let move_length = this.playground.height * 1;
		if(this.is_me && this.playground.players[0] != this){
			return;
		}
		new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
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

	be_attacked(angle, damage){
		for(let i=0;i<10+Math.random()*5;++i){
			let x = this.x, y = this.y;
			let radius = this.radius * Math.random() * 0.08;
			let angle = Math.PI * 2 * Math.random();
			let vx = Math.cos(angle), vy = Math.sin(angle);
			let color = this.color;
			let speed = this.speed * 10;
			let move_length = this.radius * Math.random() * 5;
			new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
		}

		this.radius -= damage;
		if(this.radius < 10){
			this.destroy();
			return false;
		}
		this.damage_x = Math.cos(angle);
		this.damage_y = Math.sin(angle);
		this.damage_speed = damage * 100;
		this.speed *= 1.1;
	}

	update(){
		this.time_spent += this.timedelta / 1000;
		if(!this.is_me && this.time_spent > 4 && Math.random() < 1 / 300.0){
			let player =this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
			let x = player.x + Math.random() * 10, y = player.y + Math.random() * 10;
			this.shoot_fireball(x, y);
		}

		if(this.damage_speed > 10){
			this.vx = this.vy = 0;
			this.move_length = 0;
			this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
			this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
			this.damage_speed *= this.friction;
		}
		else{
			if(this.move_length < this.eps){
				this.move_length = 0;
				this.vx = this.vy = 0;
				if(!this.is_me){
					let tx = Math.random() * this.playground.width, ty = Math.random() * this.playground.height;
					this.move_to(tx, ty);
				}
			}
			else{
				let move_realdist = Math.min(this.move_length, this.speed * this.timedelta / 1000);
				this.x += this.vx *	move_realdist;
				this.y += this.vy * move_realdist;
				this.move_length -= move_realdist;
			}
		}
		this.render();
	}

	render(){
		if(this.is_me){
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			this.ctx.stroke();
			this.ctx.clip();
			this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
			this.ctx.restore();
		}
		else{
			this.ctx.beginPath();
			this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			this.ctx.fillStyle = this.color;
			this.ctx.fill();
		}
	}

	on_destroy(){
		for(let i=0;i<this.playground.players.length;++i){
			if(this.playground.players[i] === this){
				this.playground.players.splice(i, 1);
			}
		}
	}
}
