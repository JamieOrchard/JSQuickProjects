var canvas = document.getElementById("gamecanvas");
var ctx    = canvas.getContext("2d");

var board_width     = 20;
var board_height    = 20;

var bombs           = 10;
var flags_left      = 10;
var completed       = false;

var current_mouse_x = 0;
var current_mouse_y = 0;

var BlockState = {
    idle:  1,
    hover: 2,
    push:  3 
};


class Block{
    //Hover, Push, Idle

    armBlock(){
        this.armed =  true;
    }

    reset(){
        this.armed = false;
        this.hover = false;
    }

    constructor(){
        this.armed = false;
        this.state = BlockState.idle;
        this.flagged = false;
    }
}

var board = [];
for(i = 0; i < board_width * board_height; i++){board.push(new Block());}

function reset()
{
    var current_bomb_count = bombs;

    var random = 0;

    for(i = 0; i < current_bomb_count; i++){
        do{
            random = Math.floor(Math.random() * (board_width * board_height));
        }while(board[random].armed != true);
        board[random].armBlock();
    }
}

function draw()
{
    ctx.clearRect(0,0,640,640);

    var x = 0;
    var y = 0;

    for(y = 0; y < board_height; y++){
        for(x = 0; x < board_width; x++){
            if(board[y * board_width + x].state == BlockState.idle ){ctx.fillStyle =  "grey";}
            if(board[y * board_width + x].flagged == true)          {ctx.fillStyle ="yellow";}    
            if(board[y * board_width + x].state == BlockState.hover){ctx.fillStyle = "green";}
            if(board[y * board_width + x].state == BlockState.push ){ctx.fillStyle = "black";}
            ctx.fillRect(x * 21, y * 21, 20, 20);
        }
    }
}

function mouseMove(event)
{
    var mouse_x = event.clientX;
    var mouse_y = event.clientY;

    if(mouse_x > 20*21 || mouse_x < 0 || mouse_y < 0 || mouse_y > 20*21){
        for(i = 0; i < board_width * board_height; i++){board[i].state = BlockState.idle;}
        return;
    }

    var temp_x = Math.floor((mouse_x - 8) / 21);
    var temp_y = Math.floor((mouse_y - 8) / 21);

    for(i = 0; i < board_width * board_height; i++){
        if(board[i].state != BlockState.push){board[i].state = BlockState.idle;}
    }

    board[temp_y * board_width + temp_x].state = BlockState.hover;
}
canvas.onmousemove = mouseMove;

function mouseClick(event)
{
    if(event.which == 3){
        for(i = 0; i < board_height * board_width; i++){
            if(board[i].state == BlockState.hover){board[i].flagged = true;}
            
        }


    }

    console.log(event.which);
    
}
canvas.addEventListener('mouseup', mouseClick);

function update()
{
    
}

function mainloop()
{
    update();
    draw();
    requestAnimationFrame(mainloop);
}

//reset();
requestAnimationFrame(mainloop);