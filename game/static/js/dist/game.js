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
			console.log("click settings");
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
			if(BALLWAR_GAME_OBJECT[i] === this){
				BALLWAR_GAME_OBJECT.splice(i, 1);
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
class Player extends BallwarGameObject{
	constructor(playground, x, y, radius, color, speed, is_me){
		super();
		this.playground = playground;
		this.ctx = this.playground.game_map.ctx;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.speed = speed;
		this.is_me = is_me;
		this.eps = 0.1;
	}

	start(){

	}

	update(){
		this.render();
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
		//this.hide();
		this.root.$ballwar_game.append(this.$playground);
		this.width = this.$playground.width();
		this.height = this.$playground.height();
		this.game_map = new GameMap(this);
		this.players = [];
		this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, 'white', this.height*0.15, true));

		this.start();
	}

	start(){

	}

	show(){ // show playground
		this.$playground.show();
	}

	hide(){ // close playground
		this.$playground.hide();
	}
}
export class BallwarGame{
	constructor(id){
		this.id = id;
		this.$ballwar_game = $('#' + id);
		this.menu = new BallwarGameMenu(this);
		this.playground = new BallwarGamePlayground(this);
	}

	start(){
		
	}
}
