/// <reference path="./node_modules/@types/p5/global.d.ts" />

function Orbit(x_, y_, r_, p, r_offset_, revs_, n) {

    this.x = x_;
    this.y = y_;
    this.r = r_;
    this.r_offset = parseFloat(r_offset_);
    this.parent = p;
    this.child = null;
    this.RevsAroundParent = revs_ || 1;
    this.angleIncr = 0;
    this.speed = 0; // (radians(pow(k, n - 1))) / resolution;
    this.angle = -PI / 2;
    this.n = n;

    this.addChild = function(childradius_, childr_offset_, childrevs_) {
        var newr = parseFloat(childradius_);
        var newx = this.x; //+ this.r + newr;
        var newy = this.y + this.r;
        this.child = new Orbit(newx, newy, newr, this, childr_offset_, parseFloat(childrevs_), n + 1);
        //var inc = this.child.getSumOfRevolutions() / OrbitResolution / animresolution;
        //this.child.angleIncr = inc;
        //lblY.innerHTML = this.child.angleIncr;

        return this.child;
    }

    this.getSumOfRevolutions = function() {
        if (this.parent != null) {
            return this.RevsAroundParent * this.parent.getSumOfRevolutions();
        } else {
            return this.RevsAroundParent;
        }
    }

    // this.update = function() {
    //     var parent = this.parent;
    //     if (parent != null) {
    //         this.angle += this.angleIncr;
    //         var rsum = this.r + parent.r + this.r_offset;
    //         this.x = parent.x + rsum * cos(this.angle);
    //         this.y = parent.y + rsum * sin(this.angle);
    //     }
    // }

    this.SetOrbitPosition = function() {
        var parent = this.parent;
        if (parent != null) {           
            var rsum = this.r + parent.r + this.r_offset;            
            this.x = parent.x + rsum * cos(this.time * this.getSumOfRevolutions());
            this.y = parent.y + rsum * sin(this.time * this.getSumOfRevolutions());
        }
    }
    this.show = function() {
        stroke(255, 100);
        strokeWeight(1);
        noFill();
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
        var posx = this.x + this.r * cos(this.angle);
        var posy = this.y + this.r * sin(this.angle);
        strokeWeight(5);
        point(posx, posy);
    }
}
Orbit.prototype.time = 0;

// Orbit.prototype.GetMyAngleIncr = function(res) {
//     let incr = TWO_PI / res;
//     this.angleIncr = incr;
//     if (this.parent != null) {
//         this.UpdateMyParentsAngleIncr(this.RevsAroundParent, incr);
//     }
//     return incr;
// }

// Orbit.prototype.UpdateMyParentsAngleIncr = function(childrevs, childangleIncr) {
//     let parentAngleIncr = parseFloat(childangleIncr) / parseFloat(childrevs);
//     this.parent.angleIncr = parentAngleIncr;
//     if (this.parent.parent != null) {
//         this.parent.UpdateMyParentsAngleIncr(this.parent.RevsAroundParent, parentAngleIncr);
//     }
// }