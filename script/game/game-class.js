class BouncingBall {
    constructor (padWidth) {
        this.balls = new Balls();
        this.pad = new Pad(padWidth);
        this.targets = new Targets();
        this.powers = new Powers();
        this.isWin = false;
        this.score;
        this.num1 = 0;
        this.num2 = 0;
        this.num3 = 0;
        this.num4 = 0;
        this.flag = 1;
    }
    display() {
        if(!this.isWin && this.balls.isPlaying){
            this.checkWin();
            ctx.beginPath();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(backgrdImg,0,0,canvas.width,canvas.height)
            this.targets.display();
            this.balls.display(this.pad,this.targets,this.powers);
            this.powers.display(this.pad,this.balls);
            this.pad.move();
        } else if(this.isWin) {
            this.renderWinDiplay();
        } else if(!this.isWin && !this.balls.isPlaying) {
            ctx.beginPath();
            ctx.drawImage(youloseImg,0,0,canvas.width,canvas.height);
            if(this.score > localStorage.getItem(`level-${localStorage.getItem("level")}`)) {
                localStorage.setItem(`level-${localStorage.getItem("level")}`, this.score);
            }
        }
    }

    renderScore() {
        this.tarKills = this.targets.array.filter((el,idx,arr) => {
            return el === -2;
        }).length;
        this.wallKills = this.targets.array.filter((el,idx,arr) => {
            return el === -1;
        }).length
        this.currballs = this.balls.array.filter((el,idx,arr) => {
            return typeof el === "object";
        }).length;
        document.getElementById("ammo").innerHTML = `ROCKETS: ${this.balls.ammo}`;
        document.getElementById("targets").innerHTML = `Destroyed: ${this.tarKills + this.wallKills}`;
        document.getElementById("balls").innerHTML = `Current Balls: ${this.currballs}`;
        this.score = (this.tarKills + this.wallKills*20) + (this.currballs?this.currballs:1)*50;
    }

    renderWinDiplay() {
        if(this.flag == 1) {
            savedStateImg.src = canvas.toDataURL("image/png");
            this.flag = 0;
        }
        ctx.beginPath();
        ctx.font = `${canvas.width/11}px PixelSplitter`
        ctx.fillStyle = "#009C87"
        ctx.lineWidth = 10;
        ctx.strokeStyle = "white"
        ctx.textAlign = "center"
        if(this.num1 < this.tarKills) this.num1++;
        if(this.num2 < this.currballs) this.num2++;
        if(this.num3 < this.wallKills) this.num3++;
        if(this.num4 < this.score) this.num4++;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(savedStateImg,0,0,canvas.width,canvas.height);
        ctx.drawImage(youWinImg,0,0,canvas.width,canvas.height)
        ctx.strokeText(`${this.num1}`, canvas.width/2, canvas.height/2.65);
        ctx.fillText(`${this.num1}`, canvas.width/2, canvas.height/2.65);
        ctx.strokeText(`${this.num2} x 50`, canvas.width/2, canvas.height/1.7);
        ctx.fillText(`${this.num2} x 50`, canvas.width/2, canvas.height/1.7);
        ctx.strokeText(`${this.num3} x 20`, canvas.width/2, canvas.height/1.25);
        ctx.fillText(`${this.num3} x 20`, canvas.width/2, canvas.height/1.25);
        ctx.textAlign = "left"
        ctx.fillStyle = "#EC3C4D";
        ctx.strokeText(`${this.num4}`, canvas.width/2.2, canvas.height/1.06);
        ctx.fillText(`${this.num4}`, canvas.width/2.2, canvas.height/1.06);
        if(this.score > localStorage.getItem(`level-${localStorage.getItem("level")}`)) {
            localStorage.setItem(`level-${localStorage.getItem("level")}`, this.score);
        }
    }

    chooseLevel(num) {
            document.getElementById("level").innerHTML = levels[num-1].name;
            backgrdImg.src = levels[num-1].src;
            tarImg.src = levels[num-1].tar;
            for (let i = 0; i < levels[num-1].display.length; i++) {
                this.targets.setMaxInRow(this.targets.yEachRow, ...levels[num-1].display[i]);
            }
    }

    checkWin() {
        let filter = this.targets.array.filter(el => {
            return el.isWall == false;
        })
        if (filter.length == 0) {
            return this.isWin = true;
        } else this.isWin = false;
    }
}
