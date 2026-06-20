const canvas =
document.getElementById("gameCanvas");
const ctx =canvas.getContext("2d");

const gridSize =20;
const tileCount =20;

let score=0;
let gameInterval;
let isPlaying=false;
let gameSpeed=150;

let blueSnake=[{x:5,y:5}];
let blueDir={x:1, y:0};

let redSnake=[{x:14,y:14}];
let redDir={x:-1,y:0};

let blueFood={x:10,y:5};
let redFood={x:10,y:14};

const scoreEl=document.getElementById("score");
const statusEl=document.getElementById("status");
const gameOverScreen=
document.getElementById("game-over-screen");
const deathReasonEl=
document.getElementById("death-reason");
const retryBtn=
document.getElementById("retry-btn");

window.addEventListener("keydown",e=>{
switch(e.key){
    case "ArrowUp":
    case "w":
    case "W":
        changeDirection("up");
    break;
    case "ArrowDown":
    case "s":
    case "S":
        changeDirection("down");
    break;
    case "ArrowLeft":
    case "a":
    case "A":
        changeDirection("left");
    break;
    case "ArrowRight":
    case "d":
    case "D":
        changeDirection("right");
    break;
}
})

document.getElementById("btn-up").addEventListener("click",()=> changeDirection("up"));
document.getElementById("btn-down").addEventListener("click",()=>changeDirection("down"));
document.getElementById("btn-left").addEventListener("click",()=>changeDirection("left"));
document.getElementById("btn-right").addEventListener("click",()=>changeDirection("right"));

function changeDirection(dir){
    if(!isPlaying){
        startGame();
        return;
    }

    if (dir==="up"&& blueDir.y===0){
        blueDir={x:0, y:-1};
        redDir={x:0, y:1};
    }
    else if (dir==="down" && blueDir.y===0){
        blueDir={x:0, y:1};
        redDir={x:0,y:-1};
    }
    else if (dir==="left" && blueDir.x===0){
        blueDir={x:-1,y:0};
        redDir={x:1, y:0};
    }
    else if(dir==="right" && blueDir.x===0){
        blueDir={x:1, y:0};
        redDir={x:-1, y:0};
    }
}

function startGame(){


    blueFood={x:10,y:5};
    redFood={x:10,y:14};

    isPlaying=true;
    statusEl.innerText= "Game Running...";
    gameOverScreen.classList.add("hidden");

    score=0;
    scoreEl.innerText=score;

    clearInterval(gameInterval);
    gameInterval=setInterval(updateGame, gameSpeed);
    drawGame();
    }

    function updateGame(){
        let blueHead={
            x:blueSnake[0].x + blueDir.x, y:blueSnake[0].y + blueDir.y
        };
        blueSnake.unshift(blueHead);

        let redHead={
            x:redSnake[0].x + redDir.x, y:redSnake[0].y + redDir.y
        };
        redSnake.unshift(redHead);

        if (blueHead.x===blueFood.x && blueHead.y===blueFood.y){
            score=score+10;
            scoreEl.innerText=score;
            generateFood("blue");
        
        }
        
        else if (blueHead.x===redFood.x && blueHead.y===redFood.y){
           score=Math.max(0,score-10);
           scoreEl.innerText=score;
           if (blueSnake.length>1) blueSnake.pop();
             generateFood("red");
           }else{
             blueSnake.pop();
             }
           if (redHead.x===redFood.x && redHead.y===redFood.y){
             score=score+10;
             scoreEl.innerText=score;
             generateFood("red");
             }
           else if(redHead.x===blueFood.x && redHead.y===blueFood.y){
             score=Math.max(0,score-10);
             scoreEl.innerText=score;
             if(redSnake.length>1) redSnake.pop();
             generateFood("blue");
             } else{
             redSnake.pop();
             }



           checkCollisions();
           drawGame();
        }

    function generateFood(type){
        let newX, newY, isValid;
        do{
        isValid=true;
        newX=Math.floor(Math.random()*tileCount);
        newY=Math.floor(Math.random()*tileCount);

        for (let i=0; i<blueSnake.length; i++){
         if (blueSnake[i].x===newX && blueSnake[i].y===newY) isValid =false;
        }
        
        for (let i=0; i<redSnake.length; i++){
         if (redSnake[i].x===newX && redSnake[i].y===newY) isValid=false;
        }

        if(type==="blue" && redFood.x===newX && redFood.y===newY) isValid=false;
        if(type==="red" && blueFood.x===newX && blueFood.y===newY) isValid=false;

        } while (!isValid);

        if(type === "blue"){
         blueFood={x:newX, y:newY};
        } else{
         redFood={x:newX, y:newY};
        }
        }


    function checkCollisions(){
        let bHead=blueSnake[0];
        let rHead=redSnake[0];

        if (bHead.x<0||bHead.x>=tileCount||bHead.y<0||bHead.y>=tileCount){
            endGame("Blue snake smashed into the wall!!!");
            return;
        }

        if (rHead.x<0||rHead.x>=tileCount||rHead.y<0||rHead.y>=tileCount){
            endGame("Red snake smashed into the wall!!!");
            return;
        }

        for(let i=1;i<blueSnake.length;i++){
            if(bHead.x===blueSnake[i].x && bHead.y=== blueSnake[i].y){
                endGame("Blue snake bit its own tail!!!");
                return;
            }
        }

        for(let i=1; i<redSnake.length; i++){
            if(rHead.x===redSnake[i].x && rHead.y===redSnake[i].y){
                endGame("Red snake bit its own tail!!!");
                return;
            }
        }

        if(bHead.x===rHead.x && bHead.y===rHead.y){
            endGame("Head on collision! Both snakes exploded!!!");
            return;
        }

        for(let i=1; i<redSnake.length;i++){
         if(bHead.x===redSnake[i].x && bHead.y===redSnake[i].y){
          endGame("Blue bited Red!🫠");
          return;
         }
        }

        for(let i=1; i<blueSnake.length; i++){
         if(rHead.x===blueSnake[i].x && rHead.y===blueSnake[i].y){
        endGame("Red bited Red!🫠");
         }
        }
    }


function drawGame(){
    ctx.clearRect(0,0, canvas.width,canvas.height);

    ctx.fillStyle="#00a8ff";
    for(let i=0; i<blueSnake.length;i++){
        ctx.fillRect(blueSnake[i].x*gridSize, blueSnake[i].y*gridSize, gridSize-2, gridSize-2);
    }

    ctx.fillStyle="#ff3838";
    for(let i=0; i<redSnake.length; i++){
        ctx.fillRect(redSnake[i].x*gridSize, redSnake[i].y*gridSize, gridSize-2, gridSize-2);
    }

    ctx.fillStyle="#00a8ff";
    ctx.beginPath();
    ctx.arc(blueFood.x*gridSize + gridSize/2, blueFood.y*gridSize + gridSize/2, gridSize/2-2,0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#ff3838";
    ctx.beginPath();
    ctx.arc(redFood.x*gridSize + gridSize/2, redFood.y*gridSize + gridSize/2, gridSize/2-2, 0, Math.PI*2);
    ctx.fill();
}

function endGame(reason){
    isPlaying=false;
    clearInterval(gameInterval);

    deathReasonEl.innerText=reason;
    gameOverScreen.classList.remove("hidden");
    statusEl.innerText="!!!GAME OVER!!!";

    blueSnake=[{x:5, y:5}];
    blueDir={x:1, y:0};
    redSnake=[{x:14, y:14}];
    redDir={x:-1, y:0};
}

retryBtn.addEventListener("click",()=>{
    startGame();
});

drawGame();



