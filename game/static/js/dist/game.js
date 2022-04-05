class BallwarGameMenu{
	constructor(root){
		this.root = root;
		this.$menu = $(`
		<div class="ballwar-game-menu">
		</div>
			`);
		this.root.$ballwar_game_id.append(this.$menu);
	}
}
class BallwarGame{
	constructor(id){
		this.id = id;
		this.$ballwar_game_id = $('#' + id);
		this.menu = new BallwarGameMenu(this);
	}
}
