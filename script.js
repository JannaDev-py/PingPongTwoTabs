const $btnPlay = document.querySelector('.btn-play');

const currentPage = (location.href.split("?")[1] === "2") ? "2" : "1";
//replace the class of the container with the current page
document.querySelector('.container').classList.replace(`container`, `container-${currentPage}`);

let isPlaying = false;
let countPoints1 = 0;
let countPoints2 = 0;

class bot {
    constructor(difficult){
        if(difficult === "Easy"){
            this.speed = 3;
        }else if(difficult === "Medium"){
            this.speed = 10;
        }else{
            this.speed = 25;
        }
    }
}

let currentbot = new bot("Easy");

//save the inner height and width of the each page
localStorage.setItem(`innerWidth-${currentPage}`, innerWidth);
let totalWidth = Number(localStorage.getItem(`innerWidth-1`)) + Number(localStorage.getItem(`innerWidth-2`));
localStorage.setItem("player-1", 100);
localStorage.setItem("player-2", 100);

window.onresize = () => {
    localStorage.setItem(`innerWidth-${currentPage}`, innerWidth);
}

if(currentPage === "1"){
    const container = document.querySelector(`.container-${currentPage}`);
    container.style.setProperty("width", totalWidth + "px");
}

$btnPlay.addEventListener('click', () => {
    //make ask player invisible
    document.querySelector('.ask-players').style.display = 'none';

    //give to the user the option to select dificult
    const $selectDificult = document.querySelector('.select-dificult');
    const $btns = $selectDificult.querySelectorAll('button');

    //show the dificult selector
    $selectDificult.style.display = 'flex';
    $btns.forEach(($btn) => {
        $btn.addEventListener('click', () => {
            $selectDificult.style.display = 'none';
            isPlaying = true;
            document.querySelector('.ask-players').style.display = 'none';
            window.open(location.href.split("?")[0] + "?2", "_blank")
            currentbot = new bot($btn.innerText);
        });
    });

});

if(location.href.split("?")[1] === "2"){
    document.querySelector('.ask-players').style.display = 'none';
}

//we will move the player with the key that we press
const root = document.querySelector(":root");
const player = "--top-user-two";
root.style.setProperty("--top-user-one", 100 + "px"); //to avoid is NaN
root.style.setProperty("--top-user-two", 100 + "px"); //to avoid is NaN

document.addEventListener("keydown", (e)=>{
    const keyUp = "ArrowUp";
    const keyDown = "ArrowDown";

    if(e.key === keyUp){
        if(root.style.getPropertyValue(player) <= "0px"){
            root.style.setProperty(player, "0px");
        }else{
            root.style.setProperty(player, (parseInt(root.style.getPropertyValue(player)) - 10) + "px");
        }
    }
    if(e.key === keyDown){
        if(root.style.getPropertyValue(player).replace("px", "") >= innerHeight - 120){
            root.style.setProperty(player, `${innerHeight - 101}px`);
        }else{
            root.style.setProperty(player, (parseInt(root.style.getPropertyValue(player)) + 10) + "px");
        }
    }
    localStorage.setItem(`player-${currentPage}`, root.style.getPropertyValue(player).replace("px", ""));
})

const ball = document.querySelector(".ball");
ball.style.setProperty("top", innerHeight / 2 + "px");
ball.style.setProperty("left", innerWidth / 2 + "px");
let speedBallX = 5;
let speedBallY = 5;

function moveBall(){
    requestAnimationFrame(moveBall);
    if(countPoints1  === 5){
        alert("Player 1 win!");
        countPoints1 = 0;
        countPoints2 = 0;
    }else if(countPoints2 === 5){
        alert("Player 2 win!");
        countPoints1 = 0;
        countPoints2 = 0;
    }
    let leftToSave = 0;
    let topToSave = 0;

    if(currentPage === "1"){    
        chekCollision();
        if(ball.style.getPropertyValue("top").replace("px", "") >= innerHeight - 45
        || ball.style.getPropertyValue("top").replace("px", "") <= 0){
            speedBallY = -speedBallY;
        }
        if(ball.style.getPropertyValue("left").replace("px", "") >= totalWidth - 30){
            speedBallX = -speedBallX;
            chekCollision();
            if(isPlaying){
                countPoints1++;
            }
        }
        if(ball.style.getPropertyValue("left").replace("px", "") <= 0){
            speedBallX = -speedBallX;
            if(isPlaying){
                countPoints2++;
            }
        }
        ball.style.setProperty("top", (parseInt(ball.style.getPropertyValue("top")) + speedBallY) + "px");
        ball.style.setProperty("left", (parseInt(ball.style.getPropertyValue("left")) + speedBallX) + "px"); 
        topToSave = ball.style.getPropertyValue("top").replace("px", "");
        leftToSave = ball.style.getPropertyValue("left").replace("px", "");
        localStorage.setItem("ballPositionTop", topToSave); 
        localStorage.setItem("ballPositionLeft", leftToSave);
    }else {
        const top = localStorage.getItem("ballPositionTop");
        const left = Number(localStorage.getItem("ballPositionLeft")) - Number(localStorage.getItem("innerWidth-1"));
        ball.style.setProperty("top",  top + "px");
        ball.style.setProperty("left", left + "px");
        chekCollision();
    }
    //to know if the ball is the bot screen
    if(leftToSave >= 0 && leftToSave <= innerWidth && isPlaying){
        const botSpeed = currentbot.speed;
        if(topToSave <= parseInt(root.style.getPropertyValue("--top-user-one"))){
            root.style.setProperty("--top-user-one", (parseInt(root.style.getPropertyValue("--top-user-one")) - botSpeed) + "px");
            localStorage.setItem(`player-1`, root.style.getPropertyValue("--top-user-one").replace("px", ""));
        }else{
            root.style.setProperty("--top-user-one", (parseInt(root.style.getPropertyValue("--top-user-one")) + botSpeed) + "px");
            localStorage.setItem(`player-1`, root.style.getPropertyValue("--top-user-one").replace("px", ""));
        }
    }else{
        const botSpeed = currentbot.speed;
        if(topToSave <= parseInt(root.style.getPropertyValue("--top-user-one"))){
            const newTop = parseInt(root.style.getPropertyValue("--top-user-one")) - botSpeed;
            root.style.setProperty("--top-user-one",  newTop + "px");
            localStorage.setItem(`player-1`, root.style.getPropertyValue("--top-user-one").replace("px", ""));
        }else{
            const newTop = parseInt(root.style.getPropertyValue("--top-user-one")) + botSpeed;
            root.style.setProperty("--top-user-one", newTop + "px");
            localStorage.setItem(`player-1`, root.style.getPropertyValue("--top-user-one").replace("px", ""));
        }
    }
}

function chekCollision(){
    const ballPositionLeft = ball.style.getPropertyValue("left").replace("px", "");
    const ballPositionTop = ball.style.getPropertyValue("top").replace("px", "");
    const playerOnePosition = Number(localStorage.getItem("player-1"));
    const playerTwoPosition = Number(localStorage.getItem("player-2"));

    if((ballPositionLeft <= 15 || ballPositionLeft >= totalWidth - 40) 
        && ((ballPositionTop >= playerTwoPosition && ballPositionTop <= playerTwoPosition + 100)
            || (ballPositionTop >= playerOnePosition && ballPositionTop <= playerOnePosition + 100))){
        speedBallX = -speedBallX;
        ball.style.background = "#f21";
    }else{
        ball.style.background = "#3f7";
    }
}

moveBall();