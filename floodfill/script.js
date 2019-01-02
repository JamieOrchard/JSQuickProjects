var canvas = document.getElementById("gamecanvas");
var ctx = canvas.getContext("2d");

var board_width = 20;
var board_height = 20;
var completed = false;
var turns = 0;

class Block{
  	reset(){
  		this.active = false;
  		if(this.posistion == 0){this.active = true;}

    	this.colour = Math.floor(Math.random() * 4);
  	}
  
	constructor(posistion){
  		this.posistion = posistion;
    	this.reset();
  	}	
}

var blockArray = [];
for(i = 0; i < board_width * board_height; i++){blockArray.push(new Block(i));}

function update(){
	var y;
    var x;
    
	for(y = 0; y < board_height; y++){
    	for(x = 0; x < board_width; x++){
	      	if(blockArray[y * board_width + x].active === true){
	        	if(y > 0){
	          		if(blockArray[y * board_width + x].colour == blockArray[(y * board_width + x) - board_width].colour){
	            		blockArray[(y * board_width + x) - board_width].active = true;
	            	}
	          	}
	          	if(x > 0){
	          		if(blockArray[y * board_width + x].colour == blockArray[(y * board_width + x) - 1].colour){
	            		blockArray[(y * board_width + x) - 1].active = true;
	            	}
	          	}
	          	if(y < board_height - 1){
	          		if(blockArray[y * board_width + x].colour == blockArray[(y * board_width + x) + board_width].colour){
	            		blockArray[(y * board_width + x) + board_width].active = true;
	            	}
	          	}
	          	if(x < board_width - 1){
	          		if(blockArray[y * board_width + x].colour == blockArray[(y * board_width + x) + 1].colour){
	            		blockArray[(y * board_width + x) + 1].active = true;
	            	}
	          	}
        	}
      	}
    }
    
    if(completed == false){
	    for(i = 0; i < board_height * board_width; i++){
	    	if(blockArray[i].active == false){break;}
	    	if(i === (board_height * board_width) -1 ){completed = true;}
	    }
	}
}

function draw(){
	ctx.clearRect(0,0,640,640);

	var y;
  	var x;
	for(y = 0; y < board_height; y++){
		for(x = 0; x < board_width; x++){
      		if(blockArray[y * board_width + x].colour == 0){ctx.fillStyle = 'green';}
        	if(blockArray[y * board_width + x].colour == 1){ctx.fillStyle = 'red';}
        	if(blockArray[y * board_width + x].colour == 2){ctx.fillStyle = 'blue';}
        	if(blockArray[y * board_width + x].colour == 3){ctx.fillStyle = 'yellow';}
      		
      		ctx.fillRect(21*x,21*y,20,20);
      	}
    }
    
   ctx.fillStyle = 'rgb(254, 235, 0)';
   ctx.font = "30px Comic Sans MS";
   ctx.fillText("Turns: " + turns, 10, 460);
   
   if(completed){ctx.fillText("Completed!", 250, 460);}
}

function reset(){
	for(i = 0; i < board_width * board_height; i++){blockArray[i].reset();}

    turns = 0;
    completed = false;
}

document.addEventListener('keyup', (event) => {
	var keyname = event.key;
 	var changecolor = 4;
  
  	if(keyname === '1' || keyname === 'g'){changecolor = 0;}
  	if(keyname === '2' || keyname === 'r'){changecolor = 1;}
  	if(keyname === '3' || keyname === 'b'){changecolor = 2;}
  	if(keyname === '4' || keyname === 'y'){changecolor = 3;}
  	if(keyname === "q"){reset();}
  
  	if(changecolor != blockArray[0].colour && changecolor < 4){turns = turns + 1;}
  
  	if(changecolor < 4){
    	for(i = 0; i < board_width * board_height; i++){
      		if(blockArray[i].active == true){blockArray[i].colour = changecolor;}
    	}
  	}
}, false);



function mainLoop(){
	update();
  	draw();
  	requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);
