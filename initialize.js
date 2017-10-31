
//== Main Initialization ==\\
var app = new PIXI.Application(STAGE_WIDTH,STAGE_HEIGHT,{backgroundColor:0xeeeeee});
document.getElementById("game-canvas").append(app.view);

//== Initialize Variables for use ==\\
var mouseObjects=new Array();
//var mouse=app
var mouse={x:0,y:0,down:false};

//keybard, mobile, mouse



var stageBorders=collision_rect(app.view.offsetLeft,app.view.offsetTop,STAGE_WIDTH,STAGE_HEIGHT);
//== Initialize Supporting Structures ==\\

app.stage.interactive=true;
window.addEventListener("resize",function(){
	stageBorders.left=app.view.offsetLeft;
	stageBorders.top=app.view.offsetTop;
});
/*app.stage.on("mousedown",onMouseDown);
app.stage.on("mouseup",onMouseUp);
*///app.ticker.add(resetMouse);

window.addEventListener("keydown",onKeyDown)
window.addEventListener("keyup",onKeyUp)
window.addEventListener("pointerdown",onMouseDown);
window.addEventListener("pointerup",onMouseUp);
window.addEventListener("pointermove",onMouseMove);
app.ticker.add(main_onTick);
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
	var mouseObject=mouseObject_constructor();
	mouseObject.id=e.pointerId;
	mouseObject.down=true;
	let _object=game_mouseDown(e);
	if (_object!=null){
		mouseObject.drag=_object;
	}
	mouseObjects.push(mouseObject);
	mouse.down=true;
}

function onMouseUp(e){
	for (var i=0;i<mouseObjects.length;i+=1){
		if (mouseObjects[i].id==e.pointerId){
			mouseObjects.splice(i,1);
			return;
		}
	}
	mouse.down=false;
}

function onMouseMove(e){
	mouse.x=e.x-stageBorders.left;
	mouse.y=e.y-stageBorders.top;
}

function main_onTick(e){
	for (var i=0;i<mouseObjects.length;i+=1){
		if (mouseObjects[i].drag!=null){
			let _box=mouseObjects[i].drag;
			_box.pullTo(mouse.x,mouse.y);
		}
	}
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