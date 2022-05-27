export class BallwarGame{
	constructor(id){
		this.id = id;
		this.settings = new Settings(this);
		this.$ballwar_game = $('#' + id);
		this.menu = new BallwarGameMenu(this);
		this.playground = new BallwarGamePlayground(this);
	}

	start(){
		
	}
}
