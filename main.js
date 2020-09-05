const canvas = obj('canvas');
const ctx = canvas.getContext('2d');

class Button{
	constructor(x,y,w,h,callback,img){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.img = img;
		this.click = callback;
		this.visible = true;
	}
	draw(color='transparent'){
		if(!this.visible) return;
		ctx.beginPath();
		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = color;
		ctx.translate(this.x,this.y);
		ctx.rect(-this.w/2,-this.h/2,this.w,this.h);
		if(this.img) ctx.drawImage(this.img,0,0,this.img.width,this.img.height,-this.w/2,-this.h/2,this.w,this.h);
		ctx.stroke();
		ctx.restore();

		// See if clicked

		if(mouse.down&&mouse.pos.x>this.x-this.w/2&&mouse.pos.x<this.x+this.w/2&&mouse.pos.y>this.y-this.h/2&&mouse.pos.y<this.y+this.h/2){
			this.click();
		}
	}
	hide(){
		this.visible = false;
	}
	show(){
		this.visible = true;
	}
}


function makeImg(path){
	let img = new Image;
	img.src = path;
	return img;
}


(function(gb){
	var cameras = {}
	gb.camera = cameras;
	
	camera.current = 0;
	camera.visible = false;
	camera.buttons = [];

	var cam_pos = [new Vector(531,237),new Vector(680,298),new Vector(643,213),new Vector(816,293),new Vector(734,106),new Vector(762,376)];

	function setCamTo(index){

	}

	let imgs = [];

	for(let i=0;i<6;i++){
		imgs.push(makeImg(`imgs/camButtons/${i+1}.png`));
		let b = new Button(cam_pos[i].x,cam_pos[i].y,50,30,click=>{
			setCamTo(i);
		},imgs[i]);
		camera.buttons.push(b);
	}

	var map = makeImg('imgs/map/1.png');

	camera.draw = function(){
		if(this.visible){
			ctx.drawImage(map,500,100);
			for(let button of camera.buttons){
				button.draw();
			}
		}
	}

})(this);


var b1 = new Button(canvas.width/2,canvas.height/2,100,50,startGame,makeImg('imgs/Play.png'));
var started = false;
var buster = new Sprite('imgs/btb/0.png');
buster.addAnimation('imgs/btb/btb.anims').then(e=>{
	buster.animation.play('spin',true);
});
buster.position = new Vector(300,300);
buster.visible = false;
var camflip = new Sprite('imgs/camflip/5.png');
camflip.position = new Vector(canvas.width/2,canvas.height/2);
camflip.addAnimation('imgs/camflip/camflip.anims');
var CAMUP = false;
camflip.visible = false;
var static = new Sprite('imgs/static/0.png');
static.visible = false;
static.addAnimation('imgs/static/static.anims').then(e=>{
	static.animation.play('static',true);
});
static.position = new Vector(canvas.width/2,canvas.height/2);
var office = new Sprite('imgs/Office.png');
office.position = new Vector(canvas.width/2,canvas.height/2);
var door = new Sprite('imgs/DoorFrames/0.png');
door.addAnimation('imgs/DoorFrames/door.anims');
door.position = new Vector(canvas.width/2,canvas.height/2);
door.visible = false;
var dooropen = true;

function start(){
	mouse.start(canvas);
	keys.start();
	loop();
}


function loop(){
	ctx.clearRect(-2,-2,canvas.width+2,canvas.height+2);
	setTimeout(loop,1000/45);

	b1.draw();

	if(started){
		office.draw();
		door.draw();
		camflip.draw();
		buster.draw();
		ctx.globalAlpha = .4;
		static.draw();
		ctx.globalAlpha = 1;
		camera.draw();
		if(keys.down('s')){
			if(CAMUP){
				static.visible = false;
				camera.visible = false;
				buster.visible = false;
				audio.stop('sounds/camup.ogg');
				audio.stop('sounds/cam.ogg');
				audio.play('sounds/camdown.ogg',false,.3);
				camflip.animation.play('close').then(e=>{
					camflip.visible = false;
				});
			} else {
				camflip.visible = true;
				audio.play('sounds/camup.ogg',false,.3).then(e=>{
					audio.play('sounds/cam.ogg',true);
				})
				camflip.animation.play('open').then(e=>{
					static.visible = true;
					buster.visible = true;
					camera.visible = true;
				});
			}
			CAMUP = !CAMUP;
			keys.keys['s'] = false;
		}
		if(keys.down('w')) toggleDoor();
	}
}

function toggleDoor(){
	if(CAMUP) return;
	if(dooropen){
		door.visible = true;
		door.animation.play('close');
		audio.play('sounds/door.ogg',false,.2);
	} else {
		audio.play('sounds/door.ogg',false,.2);
		door.animation.play('open').then(e=>{
			door.visible = false;
		});
	}
	dooropen = !dooropen;
	keys.keys['w'] = false;
}

function startGame(){
	b1.hide();
	started = true;
	canvas.requestFullscreen();
	audio.play('sounds/fan.ogg',true,.05);
}

start();