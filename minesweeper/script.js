var canvas = document.getElementById("gamecanvas");
var ctx    = canvas.getContext("2d");

var board_width     = 20;
var board_height    = 20;

var bombs           = 99;
var flags_left      = bombs;
var completed       = false;

var current_mouse_x = 0;
var current_mouse_y = 0;

var texture = document.getElementById("texture");

var BlockState = {
    idle:    1,
    hover:   2,
    push:    4,
    flagged: 8
};

var GameState = {
    start:      1,
    continue:   2,
    win:        3,
    loss:       4,  
};

var current_state = GameState.start;


class Block{
    //Hover, Push, Idle

    reset(){
        this.armed = false;
        this.state = BlockState.idle;
        this.ffchecked = false;
        this.value = 0;
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
for(let i = 0; i < board_width * board_height; i++){board.push(new Block());}

function restart(_pos)
{
    var random = 0;

    for(let i = 0; i < board_width * board_height; i++){
        if((board[i].state & BlockState.flagged) == BlockState.flagged){continue;}
        board[i].reset();
    }
    if(_pos != -1){board[_pos].state = BlockState.hover;}

    for(let i = 0; i < bombs; i++){
        do{
            random = Math.floor(Math.random() * (board_width * board_height));
            //console.log(random);
        }while(board[random].armed == true || random == _pos );
        board[random].armed = true;
    }
    
    for(let y = 0; y < board_height; y++){
        for(let x = 0; x < board_width; x++){
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
                console.log("HH: " + _pos);
        }
    }

    console.log("HHH: " + _pos.toString());

    return _pos;
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

    for(let y = 0; y < board_height; y++){
    for(let x = 0; x < board_width;  x++){
        ctx.drawImage(texture, 0, 0, 32, 32, x * 21, y * 21, 20, 20);
        //if((board[y * board_width + x].state & BlockState.idle) == BlockState.idle )     { ctx.fillStyle =  "grey"; }   
        if((board[y * board_width + x].state & BlockState.flagged) == BlockState.flagged){ ctx.drawImage(texture, 64, 0, 32, 32, x * 21, y * 21, 20, 20);} 
        if((board[y * board_width + x].state & BlockState.push) == BlockState.push)      { ctx.drawImage(texture, 32, 0, 32, 32, x * 21, y * 21, 20, 20);}
        if((board[y * board_width + x].state & BlockState.hover) == BlockState.hover)    { ctx.fillStyle = "green"; ctx.fillRect(x * 21, y * 21, 20, 20);}
    }
    }

    ctx.font = "10px Arial";

    

    for(let y = 0; y < board_height; y++){
    for(let x = 0; x < board_width;  x++){
        
        if((board[y * board_width + x].state & BlockState.push) == BlockState.push){
            if(board[y * board_width + x].armed == true){
                ctx.fillStyle = "red";
                ctx.fillText("X", (x * 21) + 8, (y * 21) + 15 );
            }
            
            if(board[y * board_width + x].value == 0){continue;}
            ctx.fillStyle = "yellow";
            ctx.fillText(board[y * board_width + x].value, (x * 21) + 8, (y * 21) + 15 );
        }/*
        ctx.fillStyle = "yellow";
        ctx.fillText(board[y * board_width + x].value, (x * 21) + 8, (y * 21) + 15 );*/

    }
    }

    ctx.font = "32px MS-ComicSans"
    ctx.fillStyle = "yellow";
    ctx.fillText("Bombs: " + bombs, 20, 460);
    ctx.fillText("Flags: " + flags_left, 270, 460);
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
    //Mouse RightClick
    if(event.which == 3){
        for(i = 0; i < board_height * board_width; i++){
            if((board[i].state & BlockState.hover) == BlockState.hover){board[i].state |= BlockState.flagged;}
            
        }
    }

    //Mouse LeftClick
    if(event.which == 1){
        for(i = 0; i < board_height * board_width; i++){
            if((board[i].state & BlockState.hover) == BlockState.hover){
                if(current_state == GameState.start){
                    restart(i)
                    current_state = GameState.continue;
                }
                board[i].state = BlockState.push;
                if(board[i].value == 0){r_scan(i);}
            }
        }
    }

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

    flags_left = bombs;
    for(i = 0; i < bombs; i++){
        if((board[i].state & BlockState.flagged) == BlockState.flagged){
            flags_left--;
            console.log("FLAG FOUND");
        }
    }
}



function mainloop()
{
    update();
    draw();
    requestAnimationFrame(mainloop);
}

//restart(-1);
requestAnimationFrame(mainloop);