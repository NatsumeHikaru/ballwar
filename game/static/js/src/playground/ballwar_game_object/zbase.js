let BALLWAR_GAME_OBJECTS= [];

class BallwarGameObject{
	constructor(){
		BALLWAR_GAME_OBJECTS.push(this);
		this.called_start = false; 
		this.timedelta = 0;
	}

	start(){ // only be executed for the first time

	}

	update(){ // erverytime executed

	}

	on_destroy(){

	}

	destroy(){
		this.on_destroy();
		for(let i=0;i<BALLWAR_GAME_OBJECTS.length;i++){
			if(BALLWAR_GAME_OBJECT[i] === this){
				BALLWAR_GAME_OBJECT.splice(i, 1);
				break;
			}
		}
	}
}

let last_timestamp;
let	BALLWAR_GAME_ANIMATION = function(timestamp){
	for(let i=0;i<BALLWAR_GAME_OBJECTS.length;i++){
		let obj=BALLWAR_GAME_OBJECTS[i];
		if(!obj.called_start){
			obj.start();
			obj.called_start = true;
		}
		else{
			obj.timedelta = timestamp - last_timestamp;
			obj.update();
		}
	}
	last_timestamp = timestamp;

	requestAnimationFrame(BALLWAR_GAME_ANIMATION);
}

requestAnimationFrame(BALLWAR_GAME_ANIMATION);
