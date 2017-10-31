function collision_getBorder(_obj1,_rect){
    var _xDist=0;
    var _yDist=0;
    var _dir=-1;

    if (_obj1.x<_rect.left){
        _xDist=_rect.left-_obj1.x;
        _dir=2;
    }else if (_obj1.x+_obj1.width>_rect.right){
        _xDist=_obj1.x+_obj1.width-_rect.right;
        _dir=0;
    }

     if (_obj1.y<_rect.top){
        _yDist=_obj1.y-_rect.top;
        _dir=1;
    }else if (_obj1.y+_obj1.height>_rect.bot){
        _yDist=_rect.bot-_obj1.y-_obj1.height;
        _dir=3;
    }
   // trace(_rect.top);
    if (_dir>=0) return collision_properties(_dir,_xDist,_yDist);
}

function collision_getBasic(_obj1,_obj2){
	if (_obj1.x>_obj2.x+_obj2.width ||
		_obj1.x+_obj1.width<_obj2.x ||
		_obj1.y>_obj2.y+_obj2.height||
		_obj1.y+_obj1.height<_obj2.y)
		return null;

	var _ratioX=(_obj1.x-_obj2.x+(_obj1.width-_obj2.width)/2)/(_obj1.width+_obj2.width);
    var _ratioY=(_obj1.y-_obj2.y+(_obj1.height-_obj2.height)/2)/(_obj1.height+_obj2.height);
    var _distX;
    var _distY;
    if (_ratioX>0){
    	_distX=_obj1.x-_obj2.x-_obj2.width;
    }else{
    	_distX=_obj2.x-_obj1.x-_obj1.width;
    }
    if (_ratioY>0){
    	_distY=_obj1.y-_obj2.y-_obj2.height;
    }else{
    	_distY=_obj2.y-_obj1.y-_obj1.height;
    }
    if (_distX>_distY){
        if (_ratioX>0) return collision_properties(0,_distX,_distY);
        return collision_properties(2,_distX,_distY);
    }else{
        if (_ratioY>0) return collision_properties(1,_distX,_distY);
        return collision_properties(3,_distX,_distY);
    }
}

function collision_getBuffer(_obj1,_obj2,_buffer=5){
    _buffer/=2;
    _obj1={x:_obj1.x-_buffer,y:_obj1.y-_buffer,width:_obj1.width+_buffer*2,height:_obj1.height+_buffer*2};
    _obj2={x:_obj2.x-_buffer,y:_obj2.y-_buffer,width:_obj2.width+_buffer*2,height:_obj2.height+_buffer*2};

    if (_obj1.x>_obj2.x+_obj2.width ||
        _obj1.x+_obj1.width<_obj2.x ||
        _obj1.y>_obj2.y+_obj2.height||
        _obj1.y+_obj1.height<_obj2.y)
        return null;

    var _ratioX=(_obj1.x-_obj2.x+(_obj1.width-_obj2.width)/2)/(_obj1.width+_obj2.width);
    var _ratioY=(_obj1.y-_obj2.y+(_obj1.height-_obj2.height)/2)/(_obj1.height+_obj2.height);
    var _distX;
    var _distY;
    if (_ratioX>0){
        _distX=_obj1.x-_obj2.x-_obj2.width;
    }else{
        _distX=_obj2.x-_obj1.x-_obj1.width;
    }
    if (_ratioY>0){
        _distY=_obj1.y-_obj2.y-_obj2.height;
    }else{
        _distY=_obj2.y-_obj1.y-_obj1.height;
    }
    if (_distX>_distY){
        if (_ratioX>0) return collision_properties(0,_distX,_distY);
        return collision_properties(2,_distX,_distY);
    }else{
        if (_ratioY>0) return collision_properties(1,_distX,_distY);
        return collision_properties(3,_distX,_distY);
    }
}


function collision_properties(_dir,_xDist,_yDist){
	return {direction:_dir,xOverlap:_xDist,yOverlap:_yDist};
}

function collision_rect(_left,_top,_right,_bot){
    return {left:_left,right:_right,top:_top,bot:_bot};
}