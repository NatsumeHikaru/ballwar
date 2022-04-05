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
