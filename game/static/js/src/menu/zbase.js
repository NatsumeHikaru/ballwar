class BallwarGameMenu{
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
