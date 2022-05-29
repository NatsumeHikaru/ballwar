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
					用户名密码错误
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
				<div class="ballwar-game-settings-password">
					<div class="ballwar-game-settings-password-item">
						<input type="password" placeholder="密码">
					</div>
				</div>
				<div class="ballwar-game-settings-password">
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
					用户名密码错误
				</div>
				<div class="ballwar-game-settings-option">
					登录
				</div>
			</div>
		</div>
			`);
		this.$login = this.$settings.find("ballwar-game-settings-login");
		this.$login.hide();
		this.$register = this.$settings.find("ballwar-game-settings-register");
		this.$register.hide();
		this.root.$ballwar_game.append(this.$settings);

		this.start();
	}

	start(){
		this.getinfo();
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
					console.log("test");
					console.log($('your-img').src = resp.photo);
					outer.hide();
					outer.root.menu.show();
				}
				else{
					outer.register();
				}
			}
		});
		console.log(outer);
		console.log(outer.photo);
	}

	hide(){
		this.$settings.hide();
	}

	show(){
		this.$settings.show();
	}
}
