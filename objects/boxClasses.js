const CardTypes={
	Dn:0,
	Up:1,
	Bk:2,
	Fw:3,
	P:4,
	K:5
}

function box_construct(_width,_height,_color){
	var m=box_template();
	m.beginFill(_color);
	m.drawRect(0,0,_width,_height);
	return m;
}

function box_cardByType(_type){
	switch(_type){
		case CardTypes.Dn: return box_card(0x777799,"Dn"); break;
		case CardTypes.Up: return box_card(0x777799,"Up"); break;
		case CardTypes.Bk: return box_card(0x777799,"Bk"); break;
		case CardTypes.Fw: return box_card(0x777799,"Fw"); break;
		case CardTypes.P: return box_card(0xBB9977,"P"); break;
		case CardTypes.K: return box_card(0x9977AA,"K"); break;
	}
}

function box_card(_color,_text){
	let m=box_template();
	m.beginFill(_color);
	m.lineStyle(2,0xffffff);
	m.drawRect(0,0,50,70);
	m.vX=0;
	m.vY=0;
	m.drawCircle(10,10,10);
	if (_text!=null){
		let _label=new PIXI.Text(_text,{
			fontSize:18,
			fill:0xffffff

		});
		_label.x=10;
		_label.y=25;
		m.addChild(_label);
		_label=new PIXI.Text(_text.substring(0,1),{
			fontSize:10,
			fill:0xffffff
		});
		_label.x=6;
		_label.y=4;
		m.addChild(_label);
	}
	

	m.interactive=true;
	m.buttonMode=true;

	return m;
}

function box_deck(){
	let m=new PIXI.Graphics;
	m.beginFill(0xffaaaa);
	m.lineStyle(2,0);
	m.drawRect(0,0,50,70);
	m.beginFill(0);
	m.moveTo(50,0);
	m.lineTo(60,10);
	m.lineTo(60,80);
	/*m.lineTo(50,70);
	m.endFill();*/
	m.lineTo(10,80);
	m.lineTo(0,70);
	m.lineTo(50,70);
	m.endFill();
	m.interactive=true;
	m.buttonMode=true;
	return m;
}

function box_gameBox2(_width,_color=0xff0000,_text){
	let m=box_template();
	m.beginFill(_color);
	m.drawRect(0,0,_width,30);
	m.vX=0;
	m.vY=0;
	if (_text!=null){
		let _label=new PIXI.Text(_text,{
			fontSize:12,
			fill:0xffffff

		});
		_label.x=5;
		_label.y=5;
		m.addChild(_label);
	}
	return m;
}

function box_template(){
	var m=new PIXI.Graphics();
	m.update=function (){box_update(m)};
	m.hitTest=function(_box2){return box_hitTest(m,_box2)};
	m.hitTestAndStop=function(_box2){box_hitTestAndStop(m,_box2)};
	m.hitTestBorders=function(_borders){return box_hitBordersAndStop(m,_borders)};
	m.pullTo=function(_x,_y){box_pullTo(m,_x,_y)}
	return m;
}

function box_update(_box){
	_box.vX=Math.min(PHYSICS_MAX_V_X,Math.max(-PHYSICS_MAX_V_X,_box.vX));
	_box.vY=Math.min(PHYSICS_MAX_V_Y,Math.max(-PHYSICS_MAX_V_Y,_box.vY));

	_box.x+=_box.vX;
	_box.y+=_box.vY;
	_box.vX*=PHYSICS_FRICTION;
	_box.vY*=PHYSICS_FRICTION;
}

function box_hitTest(_box1,_box2){
	return collision_getBasic(_box1,_box2);
}

function box_hitTestAndStop(_box1,_box2){
	var _collision=collision_getBasic(_box1,_box2);
	
	if (_collision!=null){
		switch(_collision.direction){
			case 0:_box1.x-=_collision.xOverlap; break;
			case 1:_box1.y-=_collision.yOverlap; break;
			case 2:_box1.x+=_collision.xOverlap; break;
			case 3:_box1.y+=_collision.yOverlap; break;
		}
	}
}

function box_hitBordersAndStop(_box,_borders){
	var _collision=collision_getBorder(_box,_borders);
//	trace("A");
	if (_collision!=null){
	//	trace("B");
		switch(_collision.direction){
			case 0:_box.x-=_collision.xOverlap; break;
			case 1:_box.y-=_collision.yOverlap; break;
			case 2:_box.x+=_collision.xOverlap; break;
			case 3:_box.y+=_collision.yOverlap; break;
		}
	}
	return _collision;
}

function box_pullTo(_box,_x,_y){
	_box.vX+=PHYSICS_ACCEL*(_x-_box.x-_box.width/2);
	_box.vY+=PHYSICS_ACCEL*(_y-_box.y-_box.height/2);
}

function box_getTouchDistance(_box1,_box2,_dist=5){
	let _collision=collision_getBuffer(_box1,_box2,_dist);
	if (_collision==null) return null;

	switch(_collision.direction){
		case 0:_box1.x-=_dist/2-_collision.xOverlap; break;
		case 1:_box1.y-=_dist/2-_collision.yOverlap; break;
		case 2:_box1.x+=_dist/2-_collision.xOverlap; break;
		case 3:_box1.y+=_dist/2-_collision.yOverlap; break;
	}
	return _collision;
}
