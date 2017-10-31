let uiM={
	currentMode:-1,
	buttons:[],
	BUTTON_SPACING:45,
	BUTTON_CENTER_X:220,
};

function ui_init(){
	uiM.bottomBar=new window_bottomBar();	
	
	let _elements=new PIXI.Graphics();
	_elements.lineStyle(3,0x666666);
	_elements.moveTo(0,stageBorders.bot/2);
	_elements.lineTo(stageBorders.right,stageBorders.bot/2);

	app.stage.addChild(_elements);
	app.stage.addChild(uiM.bottomBar);
	app.ticker.add(ui_onTick);
}

function ui_onTick(_delta){
	uiM.bottomBar.text.text="Health:\n"+gameM.health;
	if (gameM.healthChip>0){
		uiM.bottomBar.text.text+=", "+gameM.healthChip;
	}
}

function ui_addToggleButton(_name,_function,_toggled=false){
	let _button=button_selectButton(_name,toggleToggler);
	_button.toggled=_toggled;
	_button.setSelectState(_toggled);
	_button.output2=_function;
	
	_button.x=STAGE_WIDTH-50;
	_button.y=20;
	uiM.bottomBar.addChild(_button);

	return _button;

}

function toggleToggler(){
	this.toggled=!this.toggled;
	this.setSelectState(this.toggled);
	this.output2(this.toggled);
	return this.toggled;
}

function ui_addButton(_button){
	_button.index=uiM.buttons.length;

	uiM.buttons.push(_button);
}

function ui_addBasicButton(_label,_function,_x=-1,_y=-1){
	let _button=button_constructBasic({
		bgColor:0x113311,
		function:_function,
		width:40,
		height:40,
		label:_label,
		labelColor:0xf1f1f1,
	});

	_button.label.y=10;
	_button.label.style.fontSize=14;

	if (_x==-1){
		_button.y=20;
		uiM.bottomBar.addChild(_button);
		uiM.buttons.push(_button);

		let _startX=Math.max(uiM.BUTTON_CENTER_X-Math.floor(uiM.buttons.length/2)*uiM.BUTTON_SPACING,60);
		for (var i=0;i<uiM.buttons.length;i+=1){
			if (uiM.buttons[i]!=null){
				uiM.buttons[i].x=_startX+i*uiM.BUTTON_SPACING;
			}
		}
	}else{
		_button.x=_x;
		_button.y=_y;
		app.stage.addChild(_button);
	}

	return _button;
}

function ui_addSelectButton(_name,_index){
	let _button=button_selectButton(_name,ui_selectButton);
	_button.y=20;
	uiM.bottomBar.addChild(_button);
	_button.index=_index;
	uiM.buttons.push(_button);
	let _startX=Math.max(uiM.BUTTON_CENTER_X-Math.floor(uiM.buttons.length/2)*uiM.BUTTON_SPACING,60);
	for (var i=0;i<uiM.buttons.length;i+=1){
		if (uiM.buttons[i]!=null){
			uiM.buttons[i].x=_startX+i*uiM.BUTTON_SPACING;
		}
	}
}

function ui_selectButton(){
	if (uiM.currentMode!=this.index){
		uiM.currentMode=this.index;
		for (var i=0;i<uiM.buttons.length;i+=1){
			if (uiM.buttons[i]!=null) uiM.buttons[i].setSelectState(uiM.buttons[i]===this);
		}
		EventManager.registerEvent(EventManagerTypes.UI_SELECT_MODE,new EventManager_UISelectModeEvent(uiM.currentMode));
	}
}

function ui_selectButtonAt(i){
	if (i>=uiM.buttons.length) return;
	
	if (uiM.buttons[i]!=null) ui_selectButton.call(uiM.buttons[i]);
}