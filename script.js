const currentPage = (location.href.split("?")[1] === "2") ? "2" : "1";
localStorage.setItem(`innerWidth-${currentPage}`, innerWidth);
localStorage.setItem(`innerHeight-${currentPage}`, innerHeight);
let isPlaying = false;


class bot {
    constructor(element, difficult){
        this.element = element;
        if(difficult === "Easy"){
            this.speed = 3;
        }else if(difficult === "Medium"){
            this.speed = 10;
        }else{
            this.speed = 25;
        }
    }
    move(){
        const root = document.querySelector(":root");
        const top = Number(localStorage.getItem("ballPositionTop"));
        const left = Number(localStorage.getItem("ballPositionLeft"));
        root.style.setProperty("--top-bot", top + "px");
        root.style.setProperty("--top-user", left + "px");
    }
}

class player {
    constructor(element, position, speed){
        this.element = element;
        this.position = position;
        this.speed = speed;
    }
    moveUp(){
        if(this.position <= 0){
            return false; //avoid go out of the screen
        }
        this.position = this.position - this.speed;
        this.element.style.setProperty("--top-user", this.position + "px");
        localStorage.setItem("playerPosition", this.position)
    }
    moveDown(){
        if(this.position >= innerHeight - 100){
            return false; //avoid go out of the screen
        }
        this.position = this.position + this.speed;
        this.element.style.setProperty("--top-user", this.position + "px");
        localStorage.setItem("playerPosition", this.position)
    }
}

class ball {
    constructor(element, positionX, positionY, speedX, speedY, widthScreen, heightScreen){
        this.widthScreen = widthScreen;
        this.heightScreen = heightScreen;
        this.element = element;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speedX = speedX;
        this.speedY = speedY;
    }
    move(){
        if(this.positionX >= this.widthScreen - 40
            || this.positionX <= 0){
            this.speedX = -this.speedX;
        }
        if(this.positionY >= this.heightScreen - 40
            || this.positionY <= 0){
            this.speedY = -this.speedY;
        }

        this.positionX = this.positionX + this.speedX;
        this.positionY = this.positionY + this.speedY;
        this.element.style.setProperty("top", this.positionY + "px");
        this.element.style.setProperty("left", this.positionX + "px");
        localStorage.setItem("ballPositionTop", this.positionY); 
        localStorage.setItem("ballPositionLeft", this.positionX);
    }
    moveOflocalStorageSecondScreen(){
        const top = Number(localStorage.getItem("ballPositionTop"));
        const left = Number(localStorage.getItem("ballPositionLeft")) - Number(localStorage.getItem("innerWidth-1"));
        this.element.style.setProperty("top", top + "px");
        this.element.style.setProperty("left", left + "px");
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const $btnPlay = document.querySelector('.btn-play');
    let botOnSecondPage = new bot("hard");
    let playerFirstScreen = undefined;

    //height and width of the two pages
    let totalWidth = Number(localStorage.getItem(`innerWidth-1`)) + Number(localStorage.getItem(`innerWidth-2`));
    let minHeight = Math.min(Number(localStorage.getItem(`innerHeight-1`)), Number(localStorage.getItem(`innerHeight-2`)));
    let ballToPlay = new ball(document.querySelector(".ball"), innerWidth / 2, innerHeight / 2, 5, 5, totalWidth, minHeight);

    //validate if we are on the second page
    if(currentPage === "2"){
        document.querySelector('.ask-players').style.display = 'none';
        document.querySelector('.container-1').classList.replace(`container-1`, `container-2`);
        if(localStorage.getItem("botDifficult") !== null){
            botOnSecondPage = new bot(localStorage.getItem("botDifficult"));
        }
        const updateBot = ()=>{
            requestAnimationFrame(updateBot);
            botOnSecondPage.move();
            ballToPlay.moveOflocalStorageSecondScreen();
        }
        updateBot();
    }else{
        localStorage.setItem("playerPosition", 100);
        playerFirstScreen = new player(document.querySelector(".user"), Number(localStorage.getItem("playerPosition")), 25);
        const updateBall = ()=>{
            requestAnimationFrame(updateBall);
            ballToPlay.move();
        }
        updateBall();
    }
    
    $btnPlay.addEventListener('click', () => {
        document.querySelector('.ask-players').style.display = 'none';
    
        //ask for the difficulty
        const $selectDificult = document.querySelector('.select-dificult');
        const $btns = $selectDificult.querySelectorAll('button');
    
        //show the dificult selector
        $selectDificult.style.display = 'flex';
        $btns.forEach(($btn) => {
            $btn.addEventListener('click', () => {
                $selectDificult.style.display = 'none';
                isPlaying = true;
                document.querySelector('.ask-players').style.display = 'none';
                window.open(location.href.split("?")[0] + "?2", "_blank");
                localStorage.setItem("botDifficult", $btn.innerText);
            });
        });
    });
    
    document.addEventListener("keydown", (e)=>{
        const keyUp = "w";
        const keyDown = "s"
        if(e.key === keyUp){
            playerFirstScreen.moveUp();
        }else if(e.key === keyDown){
            playerFirstScreen.moveDown();
        }
    })
})
