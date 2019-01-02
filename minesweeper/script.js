var canvas = document.getElementById("gamecanvas");
var ctx    = canvas.getContext("2d");

var board_width     = 20;
var board_height    = 20;

var bombs           = 10;
var flags_left      = 10;
var completed       = false;

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
            if(board[y * board_width + x].state == BlockState.idle ){ctx.fillStyle = "grey";}
            if(board[y * board_width + x].state == BlockState.hover){ctx.fillStyle = "green";}
            if(board[y * board_width + x].state == BlockState.push ){ctx.fillStyle = "black";}
            ctx.fillRect(x * 21, y * 21, 20, 20);
        }
    }
}

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