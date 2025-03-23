const $btnPlay = document.querySelector('.btn-play');

const currentPage = (location.href.split("?")[1] === "2") ? "2" : "1";
//replace the class of the container with the current page
document.querySelector('.container').classList.replace(`container`, `container-${currentPage}`);

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
    move(){
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
        element.style.setProperty("--top-user", this.position + "px");
        localStorage.setItem("player", this.position)
    }
    moveDown(){
        if(this.position >= innerHeight - 100){
            return false; //avoid go out of the screen
        }
        this.position = this.position + this.speed;
        element.style.setProperty("--top-user", this.position + "px");
        localStorage.setItem("player", this.position)
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
    }
}