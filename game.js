var gameM={
	cards:[],
	deck:null,
	gameStage:null,
	health:10,
	healthChip:0,
}

function game_putOnTop(_box){
	gameM.gameStage.addChild(_box);
	for (var i=0;i<gameM.cards.length;i+=1){
		if (gameM.cards[i]===_box){
			gameM.cards.splice(i,1);
			gameM.cards.push(_box);
			//gameM.cards.unshift(_box);
			return;
		}
	}
}

//== Initialize Game Elements==\\
function game_init(){
	gameM.gameStage=new PIXI.Sprite();
	app.stage.addChild(gameM.gameStage);

	app.ticker.add(game_onTick);

	ui_addBasicButton("Clear",game_clearTopHalf,stageBorders.right-60,20);
	ui_addBasicButton("+1",function(){game_healthDamaged(-1)},stageBorders.right-90,stageBorders.bot-80);
	ui_addBasicButton("-1",function(){game_healthDamaged(1)},stageBorders.right-90,stageBorders.bot-40);
	ui_addBasicButton("+C",function(){game_healthChipped(-1)},stageBorders.right-50,stageBorders.bot-80);
	ui_addBasicButton("-C",function(){game_healthChipped(1)},stageBorders.right-50,stageBorders.bot-40);
	gameM.deck=box_deck();
	gameM.deck.x=10;
	gameM.deck.y=stageBorders.bot-gameM.deck.height-100;
	gameM.gameStage.addChild(gameM.deck);
}

//== Start/Stop the Game ==\\


//==Primary Game Loop==\\
function game_onTick(){
	for (var i=0;i<gameM.cards.length;i+=1){
		if (gameM.cards[i].dragging){
			if (mouse.down){
				gameM.cards[i].pullTo(mouse.x,mouse.y);
				//let _box=mouseObjects[i].drag;
			//_box.pullTo(mouse.x,mouse.y);
			}else{
				gameM.cards[i].dragging=false;
				let _card=gameM.cards[i];
				gameM.cards.splice(i,1);

				for (j=0;j<gameM.cards.length;j+=1){
					if (_card.x<gameM.cards[j].x){
						//j-=1;
						//console.log(j);
						if (j>0){
							//console.log(j);
							gameM.gameStage.addChildAt(_card,gameM.gameStage.getChildIndex(gameM.cards[j]));
							gameM.cards.splice(j,0,_card);
						}else{
							///console.log("0");
							gameM.gameStage.addChildAt(_card,0);
							gameM.cards.unshift(_card);
						}
						return;
					}
				}
				gameM.cards.push(_card);
				gameM.gameStage.addChild(_card);
				//console.log(gameM.cards.length-1);
				return;
			}
		}else{
			for (var j=i+1;j<gameM.cards.length;j+=1){
				if (!gameM.cards[j].dragging){
					if (gameM.cards[i].y<gameM.cards[j].y+gameM.cards[j].height && 
						gameM.cards[i].y+gameM.cards[i].height>gameM.cards[j].y){
						if (Math.abs(gameM.cards[i].x-gameM.cards[j].x)<20){
							gameM.cards[j].vX+=0.1;
					}
					//let _distance=collision_getDistance(gameM.cards[i],gameM.cards[j]);
					//if (_distance<20){
						//if (gameM.cards[i].x<gameM.cards[j].x){
							//gameM.cards[j].vX+=0.1;
							//gameM.cards[j].vX-=0.05;
						/*}else{
							gameM.cards[i].vX+=0.1;
							gameM.cards[j].vX-=0.1;
						}*/
					}
				}
			}
		}

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
		if (_object!=null) _object.dragging=true;
		//return _object;
	}else{
		if (collision_pointInObj(e,gameM.deck)){
			let _object=game_addCardAtObject(gameM.deck);
			//return _object;
			if (_object!=null) _object.dragging=true;
		}else{
			let _object=game_getClosestBox(e);
			if (_object!=null) game_putOnTop(_object);
			//return _object;
			if (_object!=null) _object.dragging=true;
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
	gameM.cards.unshift(_card);
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