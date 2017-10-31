
//== Main Initialization ==\\
var interactionMode="desktop";
var _Resolution=1;
try{
	document.createEvent("TouchEvent");
	interactionMode="mobile";
	/*console.log(STAGE_WIDTH+" "+STAGE_HEIGHT+" "+window.innerWidth+" "+window.innerHeight);
	let _ratio=Math.max(window.innerWidth/STAGE_WIDTH,window.innerHeight/STAGE_HEIGHT);*/
	STAGE_WIDTH=window.innerWidth;
	STAGE_HEIGHT=window.innerHeight;
	/*console.log(_ratio,_Resolution);
	while(_ratio>2){
		_ratio/=2;
		_Resolution+=1;
		STAGE_WIDTH/=2;
		STAGE_HEIGHT/=2;
	}*/

}catch(e){
	//interactionMode="desktop";
}

var app = new PIXI.Application(STAGE_WIDTH,STAGE_HEIGHT,{backgroundColor:0xeeeeee});
document.getElementById("game-canvas").append(app.view);

//== Initialize Variables for use ==\\
var mouseObjects=new Array();

//var mouse=app
var mouse={x:0,y:0,down:false};

//keybard, mobile, mouse



var stageBorders=collision_rect(app.view.offsetLeft,app.view.offsetTop,STAGE_WIDTH,STAGE_HEIGHT);
//== Initialize Supporting Structures ==\\
DisplayState.interactionMode=interactionMode;
app.stage.interactive=true;
window.addEventListener("resize",function(){
	stageBorders.left=app.view.offsetLeft;
	stageBorders.top=app.view.offsetTop;
});

window.addEventListener("keydown",onKeyDown)
window.addEventListener("keyup",onKeyUp)
window.addEventListener("pointerdown",onMouseDown);
window.addEventListener("pointerup",onMouseUp);
window.addEventListener("pointermove",onMouseMove);

//== Initialize the game after everything is setup ==\\
ui_init();

game_init();


//== Utility Functions ==\\
// (Call These)

//== Support Functions ==\\
// (Don't Call These)

function resetMouse(){
	//mouseDown=false;
}
function onMouseDown(e){
	game_mouseDown(e);

	mouse.down=true;
	mouse.x=e.x-stageBorders.left;
	mouse.y=e.y-stageBorders.top;
}

function onMouseUp(e){
	mouse.down=false;
}

function onMouseMove(e){
	mouse.x=e.x-stageBorders.left;
	mouse.y=e.y-stageBorders.top;
}

function onKeyDown(e){
	switch(e.key){
		case "-": game_healthDamaged(1); break;
		case "=": game_healthDamaged(-1); break;
		case "[": game_healthChipped(1); break;
		case "]": game_healthChipped(-1); break;
		case " ": game_clearTopHalf(); break;
	}
}

function onKeyUp(e){
}

function mouseObject_constructor(){
	var m={
		id:0,
		x:0,
		y:0,
		down:false,
		key:0,
		drag:null,
	}

	return m;
}