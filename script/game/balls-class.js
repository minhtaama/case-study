class Bal {
    constructor (radius,power) {
        this.radius = radius;
        this.x;
        this.y;
        this.xFlag = 0; //0: move left, 1: move right
        this.yFlag = 0; //0: move up, 1: move down
        this.spHorizon = Math.sqrt(12.5);
        this.spVertical = Math.sqrt(12.5);
        this.xT;        //coordinates of nearest touch point on target
        this.yT;        //
        this.isHasPower = power;
        this.maxKills = 5;
    }
    getCoordinates(x,y) {
        this.x = x;
        this.y = y;
    }
    getSpeed() {
        this.speed = Math.sqrt(this.spVertical**2 + this.spHorizon**2);
    }
    isTouch(target) {
        let range;      //range from ball to touch point
        if(this.x <= target.x) {
            this.xT = target.x;
        } else if (this.x >= target.x + target.width) {
            this.xT = target.x + target.width;
        } else if (this.x > target.x && this.x < target.x + target.width) {
            this.xT = this.x;
        }
        if(this.y <= target.y) {
            this.yT = target.y;
        } else if(this.y >= target.y + target.height) {
            this.yT = target.y + target.height;
        } else if (this.y > target.y  && this.y < target.y + target.height) {
            this.yT = this.y;
        }
        range = Math.sqrt((this.x - this.xT)**2 + (this.y - this.yT)**2) - this.radius;
        if (range <= 0) {
            //offset ball(x,y) to not go inside target if target is moving
            if (this.x <= target.x) {
                this.x -= target.spHorizon; 
            } 
            else if (this.x >= target.x + target.width) {
                this.x += target.spHorizon;
            }
            if (this.y <= target.y) {
                this.y -= target.spVertical; 
            }
            else if (this.y >= target.y + target.width) {
                this.y += target.spVertical;
            }
            return true;
        } else return false;
    }
    modDirection(target) {
        this.getSpeed(); //this.speed always a CONST
        if(target.goLeft) {
            switch(this.xFlag) {
                case 0:
                    this.spHorizon += (this.speed - this.spHorizon)/8;
                    break;
                case 1:
                    this.xFlag = 0;
                    this.spHorizon -= this.spHorizon/3;
                    break;
            }
            this.spVertical = Math.sqrt(this.speed**2 - this.spHorizon**2);
        } else if(target.goRight) {
            switch(this.xFlag) {
                case 0:
                    this.xFlag = 1;
                    this.spHorizon -= this.spHorizon/3;
                    break;
                case 1:
                    this.spHorizon += (this.speed - this.spHorizon)/8;
                    break;
            }
            this.spVertical = Math.sqrt(this.speed**2 - this.spHorizon**2);
        } else {
            if(Math.floor(Math.random()*2)==0) {
                this.spHorizon -= Math.sqrt(this.spHorizon**2/100);
                this.spVertical = Math.sqrt(this.speed**2 - this.spHorizon**2);
            } else {
                this.spVertical -= Math.sqrt(this.spVertical**2/100);
                this.spHorizon = Math.sqrt(this.speed**2 - this.spVertical**2);
            }
        }
        //switch move up/down and move left/right
        if(this.xT == target.x) {
            this.xFlag = 0;
        } else if(this.xT == target.x + target.width) {
            this.xFlag = 1;
        } else if(this.yT == target.y) {
            this.yFlag = 0;
        } else if(this.yT == target.y + target.height) {
            this.yFlag = 1;
        }
    }
    spawnPower(powers,targets,powName) {
        powers.array.push(new Pow(targets.x,targets.y,targets.width,targets.height,powName));
    }

    whenTouch(pad) {
        if(this.isTouch(pad)) {
            this.modDirection(pad);
            pad.y = pad.yFixed;
            pad.goDown = true;
        }
        if(pad.y - pad.yFixed >= 14) {
            pad.goDown = false;
            pad.goUp = true;
        }
        if(pad.y <= pad.yFixed) {
            pad.goUp = false;
        }
    }
    whenTouchTargets(powers, targets){
        for(let i = 0; i < targets.length; i++) {
            if(this.isTouch(targets[i]) && typeof targets[i] == "object") {
                if(!targets[i].isWall && !targets[i].isSpawnPower && !targets[i].isGlass && this.isHasPower != "glass") {
                    if(Math.floor(Math.random() * 11) >= 8) {       //percentage of spawning powers
                        let j = Math.floor(Math.random()*6);
                        switch(j) {
                            case 0: case 1: case 2: case 3: case 4:
                                this.spawnPower(powers, targets[i],"add-ball");
                                break;
                            case 5:
                                this.spawnPower(powers, targets[i],"super-ball");
                                break;
                        }
                    }
                } else if(targets[i].isSpawnPower && this.isHasPower != "glass") {
                    this.spawnPower(powers, targets[i],"ammo");
                }
                switch(this.isHasPower) {
                    case "no-power":
                        this.modDirection(targets[i]);
                        if(!targets[i].isWall) {
                            targets[i] = -2;
                        }
                        break;
                    case "rocket":
                    case "super-ball":
                        this.maxKills--;
                        if(targets[i].isWall) {
                            targets[i] = -1;
                        } else targets[i] = -2;
                        break;
                    case "glass":
                        this.maxKills = 0;
                        break;
                }
            }
        }
    }
    whenTouchBorder() {
        if(this.x - this.radius <= 0) {                 //if touch left
            this.xFlag = 1;
        }
        if(this.x + this.radius >= canvas.width-1) {    //if touch right
            this.xFlag = 0;
        }
        if(this.y - this.radius <= 0) {                 //if touch top
            this.yFlag = 1;
        }
    }
    move(){
        if(this.xFlag == 1) {
            if (this.isHasPower != "no-power") {
                this.spHorizon *= 1.015;
            }
            this.x += this.spHorizon;                   //move right
        }
        if(this.xFlag == 0) {
            if (this.isHasPower != "no-power") {
                this.spHorizon *= 1.015;
            }
            this.x -= this.spHorizon;                   //move left
        }
        if(this.yFlag == 1) {
            this.y += this.spVertical;                  //move bottom
        }
        if(this.yFlag == 0) {
            if(this.isHasPower != "no-power") {
                this.spVertical *=1.015;
            }
            this.y -= this.spVertical;                  //move top
        }
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        switch(this.isHasPower) {
            case "no-power":
                ctx.drawImage(noPowImg,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
                break;
            case "rocket":
                ctx.drawImage(rocketImg,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*4);
                break;
            case "super-ball":
                ctx.drawImage(superBallImg,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
                break;
            case "glass":
                ctx.drawImage(glassImg,this.x-this.radius,this.y-this.radius,this.radius*2.5,this.radius*2.5);
                break;
        }
    }
}

class Balls {
    constructor() {    
        this.array = [];
        this.isPlaying = true;
        this.ammo = 0;
        this.isShoot = false;
        this.ammoType = "rocket";
    }
    isEnd() {
        let count = 0;
        for(let i = 0; i < this.array.length; i++) {
            if(typeof this.array[i] == "object") {
                count += 1;
            }
        }
        if(count == 0) {
            this.isPlaying = false;
        }
    }

    spawnAmmo(pad) {
        let bal;
        if(this.ammoType == "rocket") {
            bal = new Bal(11, "rocket");
        } else bal = new Bal(11, "glass");
        let x = pad.x + pad.width/2;
        let y = pad.y - bal.radius - 5;
        if(pad.goLeft) {
            bal.spHorizon = Math.sqrt(1);
            bal.spVertical = Math.sqrt(8);
            bal.xFlag = 0;
        } else if(pad.goRight) {
            bal.spHorizon = Math.sqrt(1);
            bal.spVertical = Math.sqrt(8);
            bal.xFlag = 1;
        } else {
            bal.spHorizon = 0;
            bal.spVertical = 3;
        }
        this.array.push(bal);
        bal.getCoordinates(x,y);
    }
    
    display(pad,targets,powers) {
        this.isEnd();
        if(this.isShoot && this.ammo > 0) {
            this.ammo--;
            this.spawnAmmo(pad);
            this.isShoot = false;
        }
        for(let i = 0; i<this.array.length; i++) {
            if(this.array[i]) {
                switch(this.array[i].isHasPower) {
                    case "no-power":
                        this.array[i].whenTouch(pad);
                        this.array[i].whenTouchTargets(powers,targets.array);
                        this.array[i].whenTouchBorder();
                        break;
                    case "rocket":
                    case "super-ball":
                    case "glass":
                        this.array[i].whenTouchTargets(powers,targets.array);
                        break;
                }
                this.array[i].move();
                if(this.array[i].y >= canvas.height || this.array[i].y < -10 || this.array[i].maxKills <= 0) {
                    if (this.array[i].isHasPower == "glass") {
                        let tar = new Tar(this.array[i].x - 8*this.array[i].radius, this.array[i].y, this.array[i].radius*16, this.array[i].radius*2, false, false, true);
                        targets.array.push(tar);
                    }
                    this.array[i] = 0;
                }
            }
        }
    }
}
