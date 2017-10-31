const DisplayState={
	NORMAL:0,
	DARKENED:-1,
	BLACKENED:-2,
	GREYED:1,
	BRIGHTENED:2,
	interactionMode:"desktop",
}

function ui_nullFunc(){}

function uiElement_constructor(par){
	//required: width, height
	//optional: bgColor, label, labelColor
	//optional: clickFunction, clickRemove
	par=par || {};
	var m=new PIXI.Sprite();
	m.interactive=true;
	m.graphics=new PIXI.Graphics();
	m.addChild(m.graphics);
	m.graphics.beginFill(par.bgColor || 0x808080);
	
	m.graphics.drawRect(0,0,par.width,par.height);

	if (par.label!=null){
		m.label=new PIXI.Text(par.label,{fill:par.labelColor || 0xffffff});
		m.label.x=par.width/15;
		m.label.y=par.height/15;
		m.addChild(m.label);
	}

	if (par.clickFunction!=null){
		m.clickFunction=par.clickFunction;
		m.on("pointerdown",m.clickFunction);
	}
	m.x=par.x || 0;
	m.y=par.y || 0;
	m.graphics.alpha=par.alpha || 1;

	m.displayState=par.displayState || DisplayState.NORMAL;
	m.setDisplayState=function(_state){
		if (this.displayState==_state) return;
		this.displayState=_state;
		if (this.overlay==null) this.overlay=new PIXI.Graphics();
		this.overlay.clear();
		switch(_state){
			case DisplayState.DARKENED:
				this.overlay.beginFill(0);
				this.overlay.alpha=0.5;
				this.overlay.drawRect(0,0,this.graphics.width,this.graphics.height);
				this.addChild(this.overlay);
				break;
			case DisplayState.BLACKENED:
				this.overlay.beginFill(0);
				this.overlay.alpha=0.8;
				this.overlay.drawRect(0,0,this.graphics.width,this.graphics.height);
				this.addChild(this.overlay);
				break;
			case DisplayState.GREYED:
				this.overlay.beginFill(0x999999);
				this.overlay.alpha=0.5;
				this.overlay.drawRect(0,0,this.graphics.width,this.graphics.height);
				this.addChild(this.overlay);
				break;
			case DisplayState.BRIGHTENED:
				this.overlay.beginFill(0xffffff);
				this.overlay.alpha=0.3;
				this.overlay.drawRect(0,0,this.graphics.width,this.graphics.height);
				this.addChild(this.overlay);
				break;
			case DisplayState.NORMAL: 
			default:
				if (this.overlay!=null && this.overlay.parent==this){
					this.removeChild(this.overlay);
				}break;
		}
	}
	
	return m;
}

function button_constructBasic(par){
	par=par || {};

	var m=uiElement_constructor({
		label:par.label,
		labelColor:par.labelColor,
		width:par.width||200,
		height:par.height||50,
		//clickFunction:par.function,
		x:par.x||50,
		y:par.y||50,
		bgColor:par.bgColor||0x8080ff,
		alpha:par.alpha||1
	});
	m.output=par.function;
	m.buttonMode=true;
	m.downOnThis=false;
	m.on("pointerover",function(e){
		if (DisplayState.interactionMode=="desktop"){
			this.setDisplayState(DisplayState.DARKENED);
		}
	});
	m.on("pointerout",function(e){
		this.setDisplayState(DisplayState.NORMAL);
			
		this.downOnThis=false;
	});
	m.on("pointerdown",function(e){
		this.setDisplayState(DisplayState.BRIGHTENED);
		this.downOnThis=true;
	});
	m.on("pointerup",function(e){
		if (DisplayState.interactionMode=="desktop"){
			this.setDisplayState(DisplayState.DARKENED);
		}else{
			this.setDisplayState(DisplayState.NORMAL);
		}	
		if (this.downOnThis){
			this.output();
		}
		this.downOnThis=false;
	});
	
	return m;
}

function button_clearButton(_function){
	var m=uiElement_constructor({
		bgColor:0x00ff00,
		clickFunction:_function,
		alpha:0.05,
		width:190,
		height:50
	});
	m.buttonMode=true;
	return m;
}

function button_selectButton(_label,_function){
	_button=button_constructBasic({
		bgColor:0x113311,
		function:_function,
		width:40,
		height:40,
		label:_label,
		labelColor:0xf1f1f1,
	});

	_button.label.y=10;
	_button.label.style.fontSize=14;

	_button.setSelectState=function(bool){
		if (bool){
			if (!this.selectRect){
				this.selectRect=button_makeSelectRect(this);
			}
			this.addChild(this.selectRect);
		}else{
			if (this.selectRect && this.selectRect.parent==this){
				this.removeChild(this.selectRect);
			}
		}
	}
	return _button;
}

function button_makeSelectRect(_button){
	let m=new PIXI.Graphics;
	m.lineStyle(2,0xffff00);
	m.drawRect(0,0,_button.graphics.width,_button.graphics.height);
	return m;
}

function ui_removeThis(){
	if (this.parent!=null) this.parent.removeChild(this);
	_window.destroy();
}