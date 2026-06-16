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
Document.getElementById("game-over-screen");
const deathReasonEl=
Document.getElementById("death-reason");
const retryBtn=
document.getElementById("retry-btn");

window.addEventListener("keydown",e=>{
switch(e.key){
    case "ArrowUp":
    case "w":
    case "W":
        changeDirection("up");
    break;
    case "ArrowDowm":
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
    isPlaying=true;
    statusEl.innerText= "Game Running...";
    gameOverScreen.classList.add("hidden");

    score=0;
    scoreEl.innerText=score;

    gameInterval=setInterval(updateGame, gameSpeed);
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
            generateredFood("blue");
        }else {
            blueSnake.pop();
        }
        
        if (redHead.x===redFood.x && redHead.y===redFood.y){
            score=score+10;
            scoreEl.innerText=score;
            generateFood("red");
        }else {
            redSnake.pop();
        }

        checkCollisions();
        drawGames();
    }


    