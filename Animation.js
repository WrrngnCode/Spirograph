/// <reference path="Orbit.js" />
let ResetAnimation;
let myp5anim = new p5(function(s) {
    let Canvas2;
    let lblAnimDebug;
    let path2 = [];
    let sun2;
    let end2;
    let t_incr=0.005;
    let Anim_FinalTimeLimit;
    let OrbitResolution_Anim = 30;
    let pathresolution=0;
    let AnimationSpeed;
    let t = 0;

    s.setup = () => {
        Canvas2=s.createCanvas(600, 600);
        Canvas2.parent("sketch-div2");
        InitObjects_Anim();
        lblAnimDebug = document.getElementById("lblAnimDebug");
        AnimationSpeed=document.getElementById("AnimationSpeed");
    };

    s.draw = () => {

        if (ResetAnimation) {
            InitObjects_Anim();
            t=0;
            ResetAnimation = false;
        }

        s.background(0);
        GetAnimationPath(t);

        displayVertexShape2(s);


        t += t_incr;
        if (t > Anim_FinalTimeLimit) {
            t = 0;
        }
        path2 = [];

        t_incr=map(AnimationSpeed.value,0,100,pathresolution/60,pathresolution*5);
        lblAnimDebug.innerHTML += "<br>t_incr: " + t_incr;
        lblAnimDebug.innerHTML += "<br>FrameCount: " + frameCount;
    };

    function GetAnimationPath(ActTimeLimit) {        

        lblAnimDebug.innerHTML = "Pathresolution: " + pathresolution;
        lblAnimDebug.innerHTML += "</br> ActTimeLimit: " + ActTimeLimit;
        lblAnimDebug.innerHTML += "</br> Path2.length calc: " + ActTimeLimit / pathresolution;
        lblAnimDebug.innerHTML += "</br> OrbitResolution_Anim " + OrbitResolution_Anim;
        CalcPath2(ActTimeLimit, pathresolution);
        var next = sun2;
        while (next != null) {
            next.show_2(s);
            next = next.child;
        }

    }

    function CalcPath2(finaltime, res) {
        let max = finaltime + res
        for (let acttime = 0; acttime <= max; acttime += res) {
            var next = sun2.child
            while (next != null) {
                next.SetOrbitPosition(acttime);
                next = next.child;
            }

            path2.push(createVector(end2.x, end2.y));

        }
        lblAnimDebug.innerHTML += "</br> Path2.length: " + path2.length;
    }

    function InitObjects_Anim() {

        let childx;

        sun2 = new Orbit(width / 2, height / 2, arr_radius[0], null, 0, arr_revs[0], 0);
        childx = sun2;
        for (let i = 1; i < ChildrenCount + 1; i++) {
            childx = childx.addChild(arr_radius[i], arr_radoffset[i], arr_revs[i]);
        }
        end2 = childx;
        path2 = [];        
        Anim_FinalTimeLimit = Math.abs(sun2.child.RevsAroundParent * TWO_PI); //this is where the animation will end.
        pathresolution = GetOptimalPathResolution_Anim(30, 15000);
    }


    function displayVertexShape2(sketch) {
        sketch.strokeWeight(2);
        sketch.beginShape();
        sketch.stroke(255, 0, 255);
        sketch.noFill();
        for (var pos of path2) {
            sketch.vertex(pos.x, pos.y);
        }
        sketch.endShape();
    }

    function GetOptimalPathResolution_Anim(startOrbitRes, MaxAllowedSteps = 35000) {
        //MaxAllowedSteps of the "end" orbit
        //startres= how many steps the end orbit should make for one full revoulution (50)
        //timeres*end2.getSumOfRevolutions()=TWO_Pi/startres >> because the end orbit turns faster. Rearranged:
        let pathres = Math.abs(TWO_PI / (startOrbitRes * end2.getSumOfRevolutions()));

        let calculatedSteps = Anim_FinalTimeLimit / pathres;
        OrbitResolution_Anim = startOrbitRes;

        if (calculatedSteps > MaxAllowedSteps) {
            pathres = finalTimeLimit / MaxAllowedSteps;
            OrbitResolution_Anim = Math.abs(TWO_PI / (pathres * end2.getSumOfRevolutions()));
            return pathres;
        } else {
            return pathres;
        }
    }


});




//let myp5 = new p5(s);