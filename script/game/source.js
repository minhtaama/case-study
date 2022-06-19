let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let ctxLeft = document.getElementById("left").getContext("2d");
let ctxRight = document.getElementById("right").getContext("2d");
let ctxFire = document.getElementById("fire").getContext("2d");

let backgrdImg = new Image();
let noPowImg = new Image();
let rocketImg = new Image();
let superBallImg = new Image();
let padImg = new Image();
let wallImg = new Image();
let glassImg = new Image();
let tarImg = new Image();
let tarSuperImg = new Image();
let trsureSuperImg = new Image();
let trsureRocketImg = new Image();
let trsureAddBallImg = new Image();
let youWinImg = new Image();
let youloseImg = new Image();
let savedStateImg = new Image();

noPowImg.src = "source/no-power-ball.png";
rocketImg.src = "source/rocket.png"
superBallImg.src = "source/super-ball.png"
padImg.src = "source/pad.png"
wallImg.src = "source/wall.png"
glassImg.src = "source/glass.png"
tarSuperImg.src = "source/super-target.png"
trsureSuperImg.src = "source/trsure-super.png"
trsureRocketImg.src = "source/trsure-rocket.png"
trsureAddBallImg.src = "source/trsure-add-ball.png"
youWinImg.src = "source/you-win.png"
youloseImg.src = "source/you-lose.png"

let leftBtn = new Image();
let leftBtnP = new Image();
let rightBtn = new Image();
let rightBtnP = new Image();
let fireBtn = new Image();
let fireBtnP = new Image();

leftBtn.src = "source/left.png"
leftBtnP.src = "source/left-press.png"
rightBtn.src = "source/right.png"
rightBtnP.src = "source/right-press.png"
fireBtn.src = "source/fire.png"
fireBtnP.src = "source/fire-press.png"
