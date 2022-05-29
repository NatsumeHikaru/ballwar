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
				<div class="ballwar-game-settings-password ballwar-game-settings-password-first">
					<div class="ballwar-game-settings-password-item">
						<input type="password" placeholder="密码">
					</div>
				</div>
				<div class="ballwar-game-settings-password ballwar-game-settings-password-second">
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
				</div>
				<div class="ballwar-game-settings-option">
					登录
				</div>
			</div>
		</div>
			`);
		this.$login = this.$settings.find(".ballwar-game-settings-login");
		this.$login_username = this.$login.find(".ballwar-game-settings-username input");
		this.$login_password = this.$login.find(".ballwar-game-settings-password input");
		this.$login_submit = this.$login.find(".ballwar-game-settings-submit button");
		this.$login_error_message = this.$login.find(".ballwar-game-settings-error-message");
		this.$login_register = this.$login.find(".ballwar-game-settings-option");

		this.$login.hide();

		this.$register = this.$settings.find(".ballwar-game-settings-register");
		this.$register_username = this.$register.find(".ballwar-game-settings-username input");
		this.$register_password = this.$register.find(".ballwar-game-settings-password-first input");
		this.$register_password_confirm = this.$register.find(".ballwar-game-settings-password-second input");
		this.$register_submit =	this.$register.find(".ballwar-game-settings-submit button");
		this.$register_error_message = this.$register.find(".ballwar-game-settings-error-message");
		this.$register_login = this.$register.find(".ballwar-game-settings-option");

		this.$register.hide();
		this.root.$ballwar_game.append(this.$settings);

		this.start();
	}

	start(){
		this.getinfo();
		this.add_listening_events();
	}

	add_listening_events(){
		this.add_listening_events_login();
		this.add_listening_events_register();
	}

	// 跳转至注册界面
	add_listening_events_login(){
		let outer = this;
		this.$login_register.click(function(){
			outer.register();
		});
		this.$login_submit.click(function(){
			outer.login_on_remote();
		});
	}

	// 跳转至登录界面
	add_listening_events_register(){
		let outer = this;
		this.$register_login.click(function(){
			outer.login();
		});
		this.$register_submit.click(function(){
			outer.register_on_remote();
		});
	}

	// 在服务器上登录
	login_on_remote(){
		let outer = this;
		let username = this.$login_username.val();
		let password = this.$login_password.val();
		this.$login_error_message.empty();

		$.ajax({
			url: "https://game.hikaru.com.cn/settings/login/",
			type: "GET",
			data: {
				username: username,
				password: password,
			},
			success: function(resp){
				if(resp.result === "success"){
					location.reload();
				}
				else{
					outer.$login_error_message.html(resp.result);
				}
			}
		});
	}

	// 在服务器上注册
	register_on_remote(){
		let outer = this;
		let username = this.$register_username.val();
		let password = this.$register_password.val();
		let password_confirm = this.$register_password_confirm.val();
		this.$register_error_message.empty();

		$.ajax({
			url: "https://game.hikaru.com.cn/settings/register/",
			type: "GET",
			data:{
				username: username,
				password: password,
				password_confirm: password_confirm,
			},
			success: function(resp){
				if(resp.result === "success"){
					location.reload();
				}
				else{
					outer.$register_error_message.html(resp.result);
				}
			}
		});
	}

	// 在服务器上登出
	logout_on_remote(){
		$.ajax({
			url: "https://game.hikaru.com.cn/settings/logout/",
			type: "GET",
			success: function(resp){
				if(resp.result === "success"){
					location.reload();
				}
			}
		});
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
					outer.hide();
					outer.root.menu.show();
				}
				else{
					outer.login();
				}
			}
		});
	}

	hide(){
		this.$settings.hide();
	}

	show(){
		this.$settings.show();
	}
}
