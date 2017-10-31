var gameM={
	cards:[],
	deck:null,
	gameStage:null,
	health:10,
	healthChip:0,
}

function game_putFirst(_box){
	gameM.gameStage.addChild(_box);
	for (var i=0;i<gameM.cards.length;i+=1){
		if (gameM.cards[i]===_box){
			gameM.cards.splice(i,1)
			gameM.cards.unshift(_box);
			return;
		}
	}
}

//== Initialize Game Elements==\\
function game_init(){
	gameM.gameStage=new PIXI.Sprite();
	app.stage.addChild(gameM.gameStage);

	app.ticker.add(game_onTick);

	ui_addBasicButton("Clear",game_clearTopHalf,stageBorders.right-80,20);
	ui_addBasicButton("+1",function(){game_healthDamaged(-1)},stageBorders.right-80,stageBorders.bot-80);
	ui_addBasicButton("-1",function(){game_healthDamaged(1)},stageBorders.right-80,stageBorders.bot-40);
	ui_addBasicButton("+C",function(){game_healthChipped(-1)},stageBorders.right-40,stageBorders.bot-80);
	ui_addBasicButton("-C",function(){game_healthChipped(1)},stageBorders.right-40,stageBorders.bot-40);
	gameM.deck=box_deck();
	gameM.deck.x=10;
	gameM.deck.y=stageBorders.bot-gameM.deck.height-100;
	gameM.gameStage.addChild(gameM.deck);
}

//== Start/Stop the Game ==\\


//==Primary Game Loop==\\
function game_onTick(){
	for (var i=0;i<gameM.cards.length;i+=1){
		gameM.cards[i].update();
	}
}

function game_getClosestBox(_point,_distance=100,_filter=null){
	var m=null;
	_distance*=_distance;
	var _distance2=0;
	
	for (var i=0;i<gameM.cards.length;i+=1){
		if (_filter!=null && _filter===gameM.cards[i]) continue;

		let _x2=gameM.cards[i].x+gameM.cards[i].width/2-_point.x;
		let _y2=gameM.cards[i].y+gameM.cards[i].height/2-_point.y;
		_distance2=_x2*_x2+_y2*_y2;
		if (_distance2<_distance){
			_distance=_distance2;
			m=gameM.cards[i];
		}
	}
	return m;
}

function game_mouseDown(e){
	if (e.ctrlKey){
		let _object=game_getClosestBox(e);
		if (_object!=null){
			game_removeCard(_object);
		}
	}else if (e.shiftKey){
		//console.log("A");
		//let _object=game_addCard(game_randomCardInt(),e.x,e.y);
		let _object=game_addCard(game_randomCardInt(),stageBorders.right/2,stageBorders.bot);
		return _object;
	}else{
		if (collision_pointInObj(e,gameM.deck)){
			let _object=game_addCardAtObject(gameM.deck);
			return _object;
		}else{
			let _object=game_getClosestBox(e);
			if (_object!=null) game_putFirst(_object);
			return _object;
		}
	}
}

function game_addCardAtObject(_object){
	return game_addCard(game_randomCardInt(),_object.x,_object.y);
}

function game_setHealth(i){
	gameM.health=i;
}

function game_getHealth(){
	return gameM.health;
}

function game_healthDamaged(i){
	gameM.health-=i;
}

function game_healthChipped(i){
	gameM.healthChip-=i;
	while(gameM.healthChip>=3){
		gameM.health+=1;
		gameM.healthChip-=3;
	}
	while (gameM.healthChip<0){
		gameM.health-=1;
		gameM.healthChip+=3;
	}
}

function game_sortHand(){

}

function game_addCardToHand(_type){
	game_addCard(_type,50,50);
}

function game_clearTopHalf(){
	let i=0;
	while(i<gameM.cards.length){
		if (gameM.cards[i].y < stageBorders.bot/2){
			game_removeCardByIndex(i);
		}else{
			i+=1;
		}
	}
}
//==DONE==\\

function game_fullHealth(){
	game_setHealth(10);
}

function game_randomCardInt(){
	return Math.floor(Math.random()*6);
}

function game_addCard(_type,_x,_y){
	let _card=box_cardByType(_type);
	_card.x=_x;
	_card.y=_y;
	gameM.gameStage.addChild(_card);
	gameM.cards.push(_card);
	return _card;
}

function game_addRandomCardToHand(){
	game_addCardToHand(game_randomCardInt());
}

function game_removeCard(_card){
	for (var i=0;i<gameM.cards.length;i+=1){
		if (gameM.cards[i]===_card){
			game_removeCardByIndex(i);
			return;
		}
	}
}

function game_removeCardByIndex(i){
	gameM.cards[i].parent.removeChild(gameM.cards[i]);
	gameM.cards.splice(i,1);
}