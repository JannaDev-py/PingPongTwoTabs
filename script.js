const $btnOnePlayer = document.querySelector('.one-player');
const $btnTwoPlayers = document.querySelector('.two-players');

const currentPage = (location.href.split("?")[1] === "2") ? "2" : "1";
//replace the class of the container with the current page
document.querySelector('.container').classList.replace(`container`, `container-${currentPage}`);

//save the inner height and width of the each page
localStorage.setItem(`innerWidth-${currentPage}`, innerWidth);
let totalWidth = Number(localStorage.getItem(`innerWidth-1`)) + Number(localStorage.getItem(`innerWidth-2`));

if(currentPage === "1"){
    const container = document.querySelector(`.container-${currentPage}`);
    container.style.setProperty("width", totalWidth + "px");
}

$btnOnePlayer.addEventListener('click', () => {
    //make ask player invisible
    document.querySelector('.ask-players').style.display = 'none';

    //give to the user the option to select dificult
    const $selectDificult = document.querySelector('.select-dificult');
    const $btns = $selectDificult.querySelectorAll('button');

    //show the dificult selector
    $selectDificult.style.display = 'flex';
    $btns.forEach(($btn) => {
        $btn.addEventListener('click', () => {
            console.log($btn.innerText);
            $selectDificult.style.display = 'none';
        });
    });
});

if(location.href.split("?")[1] === "2"){
    document.querySelector('.ask-players').style.display = 'none';
}

$btnTwoPlayers.addEventListener('click', () => {
    document.querySelector('.ask-players').style.display = 'none';
    window.open(location.href.split("?")[0] + "?2", "_blank")
});


//we will move the player with the key that we press
const root = document.querySelector(":root");
const player = (currentPage === "1") ? "--top-user-one": "--top-user-two";
root.style.setProperty(player, 100 + "px"); //to avoid is NaN

document.addEventListener("keydown", (e)=>{
    const keyUp = (currentPage === "1") ? "w" : "ArrowUp";
    const keyDown = (currentPage === "1") ? "s" : "ArrowDown";

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
})

const ball = document.querySelector(".ball");
ball.style.setProperty("top", innerHeight / 2 + "px");
ball.style.setProperty("left", innerWidth / 2 + "px");
let speedBallX = 10;
let speedBallY = 10;

function moveBall(){
    requestAnimationFrame(moveBall);
    if(currentPage === "1"){    
        if(ball.style.getPropertyValue("top").replace("px", "") >= innerHeight - 45
            || ball.style.getPropertyValue("top").replace("px", "") <= 0){
            speedBallY = -speedBallY;
        }
        if(ball.style.getPropertyValue("left").replace("px", "") >= totalWidth - 50
            || ball.style.getPropertyValue("left").replace("px", "") <= 0){
            speedBallX = -speedBallX;
        }
        ball.style.setProperty("top", (parseInt(ball.style.getPropertyValue("top")) + speedBallY) + "px");
        ball.style.setProperty("left", (parseInt(ball.style.getPropertyValue("left")) + speedBallX) + "px");    
        localStorage.setItem("ballPositionTop", ball.style.getPropertyValue("top").replace("px", ""));
        localStorage.setItem("ballPositionLeft", ball.style.getPropertyValue("left").replace("px", ""));
    }else{
        const top = localStorage.getItem("ballPositionTop");
        const left = Number(localStorage.getItem("ballPositionLeft")) - Number(localStorage.getItem("innerWidth-1"));
        ball.style.setProperty("top",  top + "px");
        ball.style.setProperty("left", left + "px");
    }
}

moveBall();