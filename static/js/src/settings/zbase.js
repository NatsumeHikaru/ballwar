class Settings{
	constructor(root){
		this.root = root;
		this.platform = "WEB";
		this.username = "";
		this.photo = "";
		this.$settings = $(`
		<div class="ballwar-game-settings">
			<div class="ballwar-game-settings-login">
				<div class="ballwar-game-settings-login-title">
				登录
				</div>
				<div class="ballwar-game-settings-login-username">
					<div class="ballwar-game-settings-login-username-item">
						<input type="text" placeholder="用户名">
					</div>
				</div>
				<div class="ballwar-game-settings-login-password">
					<div class="ballwar-game-settings-login-password-item">
						<input type="password" placeholder="密码">
					</div>
				</div>
				<div class="ballwar-game-settings-login-submit">
					<div class="ballwar-game-settings-login-submit-item">
						<button>登录</button>
					</div>
				</div>
				<div class="ballwar-game-settings-login-error-message">
					用户名密码错误
				</div>
				<div class="ballwar-game-settings-option">
					注册
				</div>
			</div>
			<div class="ballwar-game-settings-register">
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
		this.$reigster.show();
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
					outer.login();
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
