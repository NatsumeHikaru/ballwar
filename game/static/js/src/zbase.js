class BallwarGame{
	constructor(id){
		this.id = id;
		this.$ballwar_game_id = $('#' + id);
		this.menu = new BallwarGameMenu(this);
	}
}
