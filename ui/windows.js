function window_bottomBar(){
	var m=uiElement_constructor({width:stageBorders.right,height:80,y:stageBorders.bot-80,bgColor:0x444444,alpha:0.7});
	m.text=new PIXI.Text("This",{
		fontSize:12,
		fill:0xffffff
	});
	m.text.x=400;
	m.addChild(m.text);
	return m;
}