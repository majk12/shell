var myBerries = [];
var myBackground;
var myScore;
var mySound;
var score = 0;

function startGame() {

    myTurtle = new component(Math.floor(376/3), Math.floor(172/3), "img/turtle.png", 100, 130, "image");
    myBackground = new component(window.innerWidth/2, window.innerHeight/2, "img/sea.jpg", 0, 0, "background");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
	maxHealth = 100;
	health = maxHealth;
	healthBar = new component(health, 10, "green", 10, 10, "bar")

    mySound = new sound("nom.wav");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth /2;
        this.canvas.height = window.innerHeight/2;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if(type == "image" || type == "background"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
            if (type == "background"){
                ctx.drawImage(this.image, 
                    this.x + this.width, this.y, this.width, this.height);
            }
        } else if (type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);   
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY; 
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }       
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.height);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
	}
}

function updateGameArea() {

    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myBerries.length; i += 1) {
        if (myTurtle.crashWith(myBerries[i])) {
            mySound.play();
            health += 20;
			myBerries.splice(i,1);
			
        }
    }
	if(health > maxHealth){health = maxHealth;}
	health -= 0.25;
		if(health < 0){health = 0;}
	healthBar.width = health;
	if(health < 1){
		myGameArea.stop;
		return;
	}

    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        myBerries.push(new component(45, 74, "img/berry.png", x, height, "image"));
    }

	myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
	    for(i = 0; i <myBerries.length; i +=1) {
        myBerries[i].speedX = -1;
        myBerries[i].newPos();
        myBerries[i].update();
    }
   
    if (myGameArea.key == 37){ //left
        myTurtle.image.src = "img/turtleL.png"; 
        myTurtle.width = Math.floor(376/3);
        myTurtle.height = Math.floor(172/3);
        myTurtle.speedX = -1; 
    }
    if (myGameArea.key == 39) { //right
        myTurtle.image.src = "img/turtle.png"; 
        myTurtle.width = Math.floor(376/3);
        myTurtle.height = Math.floor(172/3);
        myTurtle.speedX = 1; 
    }
    if (myGameArea.key == 38)  //up
        {myTurtle.image.src = "img/TopTurtle.png";
        myTurtle.width = 133;
        myTurtle.height = 144;
        myTurtle.speedY = -1; 
    }
    if (myGameArea.key == 40) { //down
        myTurtle.speedY = 1; 
    }
    
    myTurtle.newPos();
    myTurtle.update();
    myScore.text = "SCORE: " + score;
	healthBar.update();
}

function sound(src) { 
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function everyinterval(n){
    if((myGameArea.frameNo /n) % 1 == 0){
        return true;
    }
    return false;
}


