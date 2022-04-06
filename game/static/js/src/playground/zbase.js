class BallwarGamePlayground{
	constructor(root){
		this.root = root;
		this.$playground = $(`
		<div>游戏界面</div>
			`);
		this.root.$ballwar_game.append(this.$playground);

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
