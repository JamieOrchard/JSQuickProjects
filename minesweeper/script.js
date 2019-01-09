var canvas = document.getElementById("gamecanvas");
var ctx    = canvas.getContext("2d");

var board_width     = 20;
var board_height    = 20;

var bombs           = 40;
var flags_left      = 10;
var completed       = false;

var current_mouse_x = 0;
var current_mouse_y = 0;

var BlockState = {
    idle:    1,
    hover:   2,
    push:    4,
    flagged: 8
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

    //
    constructor(){
        this.armed      = false;
        this.state      = BlockState.idle;
        this.ffchecked  = false;
        this.value      = 0;
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
            console.log(random);
        }while(board[random].armed == true);
        board[random].armBlock();
    }

    for(y = 0; y < board_height; y++){
    for(x = 0; x < board_width; x++){
        if(board[y * board_width + x].armed == true){continue;}

        if(y > 0){
            if(board[(y-1) * board_width + x].armed == true){board[y * board_width + x].value += 1;}
            if(x > 0){
                if(board[(y-1) * board_width + (x-1)].armed == true){board[y * board_width + x].value += 1;}}
            if(x < board_width - 1){
                if(board[(y-1) * board_width + (x+1)].armed == true){board[y * board_width + x].value += 1;}}
        }

        if(x > 0){
            if(board[y * board_width + (x-1)].armed == true){board[y * board_width + x].value += 1;}}
        if(x < board_width - 1){
            if(board[y * board_width + (x+1)].armed == true){board[y * board_width + x].value += 1;}}

        if(y < board_height - 1){
            if(board[(y+1) * board_width + x].armed == true){board[y * board_width + x].value += 1;}
            if(x > 0){
                if(board[(y+1) * board_width + (x-1)].armed == true){board[y * board_width + x].value += 1;}}
            if(x < board_width - 1){
                if(board[(y+1) * board_width + (x+1)].armed == true){board[y * board_width + x].value += 1;}}
        }
    }
    }
    
}

var arra = [(-board_width - 1), -board_width, (-board_width + 1), -1, +1, (board_width - 1), board_width, (board_width + 1)]
function r_scan(_pos)
{
    if(board[_pos].ffchecked == true){return;}
    board[_pos].ffchecked = true;

    if(board[_pos].value != 0){
        board[_pos].state = BlockState.push;
        return;
    }

    if(_pos > board_width){
        board[_pos].state = BlockState.push;
        r_scan(_pos - board_width);

        if((_pos % board_width) != 0){r_scan((_pos - board_width) -1);}
        if(_pos != ((Math.floor(_pos / board_width) + 1) * board_width) - 1){r_scan((_pos - board_width) +1);}
    }

    if((_pos % board_width) != 0){r_scan(_pos -1);}
    if(_pos != ((Math.floor(_pos / board_width) + 1) * board_width) - 1){r_scan(_pos +1);}

    //  (((Math.floor(_pos / board_width) + 1) * board_width) - 1) Gets the right most side of the current line in the grid

    if(_pos < (board_width * board_height) - board_width){
        board[_pos].state = BlockState.push;
        r_scan(_pos + board_width);

        if((_pos % board_width) != 0){r_scan((_pos + board_width) -1);}
         if(_pos != ((Math.floor(_pos / board_width) + 1) * board_width) - 1){r_scan((_pos + board_width) +1);}
    }


}

function draw()
{
    ctx.clearRect(0,0,640,640);

    var x = 0;
    var y = 0;

    for(y = 0; y < board_height; y++){
    for(x = 0; x < board_width;  x++){
        if((board[y * board_width + x].state & BlockState.idle) == BlockState.idle )     { ctx.fillStyle =  "grey"; }   
        if((board[y * board_width + x].state & BlockState.flagged) == BlockState.flagged){ ctx.fillStyle ="yellow"; } 
        if((board[y * board_width + x].state & BlockState.push) == BlockState.push)      { ctx.fillStyle = "black"; }
        if((board[y * board_width + x].state & BlockState.hover) == BlockState.hover)    { ctx.fillStyle = "green"; }
        ctx.fillRect(x * 21, y * 21, 20, 20);
    }
    }

    ctx.font = "10px Arial";

    

    for(y = 0; y < board_height; y++){
    for(x = 0; x < board_width;  x++){
        if(board[y * board_width + x].armed == true){
            ctx.fillStyle = "red";
            ctx.fillText(board[y * board_width + x].value, (x * 21) + 8, (y * 21) + 15 );
        }
        
        if((board[y * board_width + x].state & BlockState.push) == BlockState.push){
            ctx.fillStyle = "yellow";
            ctx.fillText(board[y * board_width + x].value, (x * 21) + 8, (y * 21) + 15 );
        }/*
        ctx.fillStyle = "yellow";
        ctx.fillText(board[y * board_width + x].value, (x * 21) + 8, (y * 21) + 15 );*/

    }
    }
}

function mouseMove(event)
{
    var mouse_x = event.clientX;
    var mouse_y = event.clientY;

    if(mouse_x < 0 || mouse_x > 20*21 || mouse_y < 0 || mouse_y > 20*21){return;}

    var temp_x = Math.floor((mouse_x - 8) / 21);
    var temp_y = Math.floor((mouse_y - 8) / 21);

    for(i = 0; i < board_width*board_height; i++){
        if((board[i].state & BlockState.hover) == BlockState.hover){
            board[i].state ^= BlockState.hover;
        }
    }

    board[temp_y * board_width + temp_x].state |= BlockState.hover;
}
canvas.onmousemove = mouseMove;

function mouseClick(event)
{
    if(event.which == 3){
        for(i = 0; i < board_height * board_width; i++){
            if((board[i].state & BlockState.hover) == BlockState.hover){board[i].state |= BlockState.flagged;}
            
        }
    }

    if(event.which == 1){
        for(i = 0; i < board_height * board_width; i++){
            if((board[i].state & BlockState.hover) == BlockState.hover){
                board[i].state = BlockState.push;
                if(board[i].value == 0){r_scan(i);}
            }
        }
    }

    console.log(event.which); 
}

canvas.addEventListener('mouseup', mouseClick);

function update()
{
    is_completed = true;

    for(i = 0; i < board_width * board_height; i++){
        if(board[i].armed == true){continue;}

        if(((board[i].state & BlockState.push) != BlockState.push && (board[i].state & BlockState.flagged) != BlockState.flagged)){
            is_completed = false;
        }
    }

    if(is_completed == true){
        console.log("congratz");
    }
}

start_game = false;

function mainloop()
{
    if(start_game == false){
        reset();
        start_game = true;
    }
    update();
    draw();
    requestAnimationFrame(mainloop);
}

//reset();
requestAnimationFrame(mainloop);