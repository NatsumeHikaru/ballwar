class Settings{
	constructor(root){
		this.root = root;
		this.platform = "WEB";
		this.username = "";
		this.photo = "";

		this.start();
	}

	start(){
		this.getinfo();
	}

	// 打开注册界面
	register(){

	}

	// 打开登录界面
	login(){

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
					console.log(outer.photo);
					outer.hide();
					outer.root.menu.show();
				}
				else{
					outer.login();
				}
			}
		});
		console.log(outer);
		console.log(this.photo);
	}

	hide(){

	}

	show(){

	}
}
