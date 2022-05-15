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
