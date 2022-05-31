export class BallwarGameMenu{
	constructor(root){
		this.root = root;
		this.$menu = $(`
		<div class="ballwar-game-menu">
			<div class="ballwar-game-menu-field">
				<div class="ballwar-game-menu-field-item ballwar-game-menu-field-item-single-mode">
					单人模式
				</div>
				<img class="ballwar-game-menu-img-genshin ballwar-game-menu-img-genshin-single" src='/static/img/menu/zhongli.png'>
				<br>
				<div class="ballwar-game-menu-field-item ballwar-game-menu-field-item-multi-mode">
					多人模式
				</div>
				<img class="ballwar-game-menu-img-genshin ballwar-game-menu-img-genshin-multi" src='/static/img/menu/xiao.png'>
				<br>
				<div class="ballwar-game-menu-field-item ballwar-game-menu-field-item-settings">
					设置
				</div>
				<img class="ballwar-game-menu-img-genshin ballwar-game-menu-img-genshin-settings" src='/static/img/menu/paimeng.png'>
			</div>
		</div>
			`);
		this.$menu.hide();
		this.root.$ballwar_game.append(this.$menu);
		this.$single_mode = this.$menu.find('.ballwar-game-menu-field-item-single-mode');
		this.$multi_mode = this.$menu.find('.ballwar-game-menu-field-item-multi-mode');
		this.$settings = this.$menu.find('.ballwar-game-menu-field-item-settings');

		this.start();
	}

	start(){
		this.add_listening_events();
	}

	add_listening_events(){
		let outer = this;
		this.$single_mode.click(function(){
			outer.hide();
			outer.root.playground.show();
		});
		this.$multi_mode.click(function(){
			console.log("click multi");
		});
		this.$settings.click(function(){
			outer.root.settings.logout_on_remote();
		});
	}

	show(){ // show menu
		this.$menu.show();
	}

	hide(){ // close menu
		this.$menu.hide();
	}
}
let BALLWAR_GAME_OBJECTS= [];

class BallwarGameObject{
	constructor(){
		BALLWAR_GAME_OBJECTS.push(this);
		this.called_start = false; 
		this.timedelta = 0;
	}

	start(){ // only be executed for the first time

	}

	update(){ // erverytime executed

	}

	on_destroy(){

	}

	destroy(){
		this.on_destroy();
		for(let i=0;i<BALLWAR_GAME_OBJECTS.length;i++){
			if(BALLWAR_GAME_OBJECTS[i] === this){
				BALLWAR_GAME_OBJECTS.splice(i, 1);
				break;
			}
		}
	}
}

let last_timestamp;
let	BALLWAR_GAME_ANIMATION = function(timestamp){
	for(let i=0;i<BALLWAR_GAME_OBJECTS.length;i++){
		let obj=BALLWAR_GAME_OBJECTS[i];
		if(!obj.called_start){
			obj.start();
			obj.called_start = true;
		}
		else{
			obj.timedelta = timestamp - last_timestamp;
			obj.update();
		}
	}
	last_timestamp = timestamp;

	requestAnimationFrame(BALLWAR_GAME_ANIMATION);
}

requestAnimationFrame(BALLWAR_GAME_ANIMATION);
class GameMap extends BallwarGameObject{
	constructor(playground){
		super(); // 调用基类构造函数
		this.playground = playground;
		this.$canvas = $(`<canvas></canvas>`);
		this.ctx = this.$canvas[0].getContext('2d');
		this.ctx.canvas.width = this.playground.width;
		this.ctx.canvas.height = this.playground.height;
		this.playground.$playground.append(this.$canvas);

		this.start();
	}

	start(){
	}

	update(){
		this.render();
	}

	render(){
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

}
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
class BallwarGamePlayground{
	constructor(root){
		this.root = root;
		this.$playground = $(`
		<div class='ballwar-game-playground'></div>
			`);
		this.hide();
		
		this.start();
	}

	get_random_color(){
		let colors = ["blue", "red", "pink", "grey", "green"];
		return colors[Math.floor(Math.random() * 5)];
	}

	start(){

	}

	show(){ // show playground
		this.$playground.show();
		this.root.$ballwar_game.append(this.$playground);
		this.width = this.$playground.width();
		this.height = this.$playground.height();
		this.game_map = new GameMap(this);
		this.players = [];
		this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, 'white    ', this.height*0.15, true));
		for(let i=0;i<5;++i){
		this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, this.get_random_color(), this.height*0.15, false));

		 }
	}

	hide(){ // close playground
		this.$playground.hide();
	}
}
class Settings{
	constructor(root){
		this.root = root;
		this.platform = "WEB";
		this.username = "";
		this.photo = "";
		this.$settings = $(`
		<div class="ballwar-game-settings">
			<div class="ballwar-game-settings-login">
				<div class="ballwar-game-settings-title">
				登录
				</div>
				<div class="ballwar-game-settings-username">
					<div class="ballwar-game-settings-username-item">
						<input type="text" placeholder="用户名">
					</div>
				</div>
				<div class="ballwar-game-settings-password">
					<div class="ballwar-game-settings-password-item">
						<input type="password" placeholder="密码">
					</div>
				</div>
				<div class="ballwar-game-settings-submit">
					<div class="ballwar-game-settings-submit-item">
						<button>登录</button>
					</div>
				</div>
				<div class="ballwar-game-settings-error-message">
				</div>
				<div class="ballwar-game-settings-option">
					注册
				</div>
			</div>
			<div class="ballwar-game-settings-register">
				<div class="ballwar-game-settings-title">
				注册
				</div>
				<div class="ballwar-game-settings-username">
					<div class="ballwar-game-settings-username-item">
						<input type="text" placeholder="用户名">
					</div>
				</div>
				<div class="ballwar-game-settings-password ballwar-game-settings-password-first">
					<div class="ballwar-game-settings-password-item">
						<input type="password" placeholder="密码">
					</div>
				</div>
				<div class="ballwar-game-settings-password ballwar-game-settings-password-second">
					<div class="ballwar-game-settings-password-item">
						<input type="password" placeholder="确认密码">
					</div>
				</div>
				<div class="ballwar-game-settings-submit">
					<div class="ballwar-game-settings-submit-item">
						<button>注册</button>
					</div>
				</div>
				<div class="ballwar-game-settings-error-message">
				</div>
				<div class="ballwar-game-settings-option">
					登录
				</div>
			</div>
		</div>
			`);
		this.$login = this.$settings.find(".ballwar-game-settings-login");
		this.$login_username = this.$login.find(".ballwar-game-settings-username input");
		this.$login_password = this.$login.find(".ballwar-game-settings-password input");
		this.$login_submit = this.$login.find(".ballwar-game-settings-submit button");
		this.$login_error_message = this.$login.find(".ballwar-game-settings-error-message");
		this.$login_register = this.$login.find(".ballwar-game-settings-option");

		this.$login.hide();

		this.$register = this.$settings.find(".ballwar-game-settings-register");
		this.$register_username = this.$register.find(".ballwar-game-settings-username input");
		this.$register_password = this.$register.find(".ballwar-game-settings-password-first input");
		this.$register_password_confirm = this.$register.find(".ballwar-game-settings-password-second input");
		this.$register_submit =	this.$register.find(".ballwar-game-settings-submit button");
		this.$register_error_message = this.$register.find(".ballwar-game-settings-error-message");
		this.$register_login = this.$register.find(".ballwar-game-settings-option");

		this.$register.hide();
		this.root.$ballwar_game.append(this.$settings);

		this.start();
	}

	start(){
		this.getinfo();
		this.add_listening_events();
	}

	add_listening_events(){
		this.add_listening_events_login();
		this.add_listening_events_register();
	}

	// 跳转至注册界面
	add_listening_events_login(){
		let outer = this;
		this.$login_register.click(function(){
			outer.register();
		});
		this.$login_submit.click(function(){
			outer.login_on_remote();
		});
	}

	// 跳转至登录界面
	add_listening_events_register(){
		let outer = this;
		this.$register_login.click(function(){
			outer.login();
		});
		this.$register_submit.click(function(){
			outer.register_on_remote();
		});
	}

	// 在服务器上登录
	login_on_remote(){
		let outer = this;
		let username = this.$login_username.val();
		let password = this.$login_password.val();
		this.$login_error_message.empty();

		$.ajax({
			url: "https://game.hikaru.com.cn/settings/login/",
			type: "GET",
			data: {
				username: username,
				password: password,
			},
			success: function(resp){
				if(resp.result === "success"){
					location.reload();
				}
				else{
					outer.$login_error_message.html(resp.result);
				}
			}
		});
	}

	// 在服务器上注册
	register_on_remote(){
		let outer = this;
		let username = this.$register_username.val();
		let password = this.$register_password.val();
		let password_confirm = this.$register_password_confirm.val();
		this.$register_error_message.empty();

		$.ajax({
			url: "https://game.hikaru.com.cn/settings/register/",
			type: "GET",
			data:{
				username: username,
				password: password,
				password_confirm: password_confirm,
			},
			success: function(resp){
				if(resp.result === "success"){
					location.reload();
				}
				else{
					outer.$register_error_message.html(resp.result);
				}
			}
		});
	}

	// 在服务器上登出
	logout_on_remote(){
		$.ajax({
			url: "https://game.hikaru.com.cn/settings/logout/",
			type: "GET",
			success: function(resp){
				if(resp.result === "success"){
					location.reload();
				}
			}
		});
	}

	// 打开注册界面
	register(){
		this.$login.hide();
		this.$register.show();
	}

	// 打开登录界面
	login(){
		this.$register.hide();
		this.$login.show();
	}

	getinfo(){
		let outer = this;
		$.ajax({
			url: "https://game.hikaru.com.cn/settings/getinfo/",
			type: "GET",
			data:{
				platform: outer.platform,
			},
			success: function(resp){
				if(resp.result === "success"){
					outer.username = resp.username;
					outer.photo = resp.photo;
					outer.hide();
					outer.root.menu.show();
				}
				else{
					outer.login();
				}
			}
		});
	}

	hide(){
		this.$settings.hide();
	}

	show(){
		this.$settings.show();
	}
}
export class BallwarGame{
	constructor(id){
		this.id = id;
		//this.settings = new Settings(this);
		this.$ballwar_game = $('#' + id);
		this.settings = new Settings(this);
		this.menu = new BallwarGameMenu(this);
		this.playground = new BallwarGamePlayground(this);
	}

	start(){
		
	}
}
