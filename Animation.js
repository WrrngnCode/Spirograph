/// <reference path="Orbit.js" />
let ResetAnimation;
let myp5anim = new p5(function(s) {
    let Canvas2;
    let lblAnimDebug;
    let path2 = [];
    let sun2;
    let end2;
    let Anim_FinalTimeLimit;
    let OrbitResolution_Anim = 30;
    let pathresolution = 0;
    let AnimationSpeed;
    let t = 0;
    let t_incrUpper;
    let t_incrLower;
    let t_incr = 0.005;

    s.setup = () => {
        Canvas2 = s.createCanvas(600, 600);
        Canvas2.parent("sketch-div2");
        InitObjects_Anim();
        lblAnimDebug = document.getElementById("lblAnimDebug");
        AnimationSpeed = document.getElementById("AnimationSpeed");
        AddMyOnWheelEventHandler(AnimationSpeed,1,null,null,null,null);
    };

    s.draw = () => {

        if (ResetAnimation) {
            InitObjects_Anim();
            t = 0;
            ResetAnimation = false;
        }

        s.background(10);
        GetAnimationPath(t);

        displayVertexShape2(s);

        t = t + t_incr;
        if (t > Anim_FinalTimeLimit) {
            t = 0;
        }
        path2 = [];

        t_incr = map(AnimationSpeed.value, 0, 100, t_incrLower, t_incrUpper);
        // lblAnimDebug.innerHTML += "<br>t_incr: " + t_incr;
        // lblAnimDebug.innerHTML += "<br>FrameCount: " + frameCount;
    };

    function GetAnimationPath(ActTimeLimit) {

        // lblAnimDebug.innerHTML = "Pathresolution: " + pathresolution;
        // lblAnimDebug.innerHTML += "</br> ActTimeLimit: " + ActTimeLimit;
        // lblAnimDebug.innerHTML += "</br> Path2.length calc: " + ActTimeLimit / pathresolution;
        // lblAnimDebug.innerHTML += "</br> OrbitResolution_Anim " + OrbitResolution_Anim;
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
       // lblAnimDebug.innerHTML += "</br> Path2.length: " + path2.length;
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

        let StepsPerFrameUpper = 10; // 30steps/frame = 1 circle per frame, because one cilcle at last child level draws with 30 steps
        t_incrUpper = StepsPerFrameUpper * pathresolution;
        //let StepsPerFrameLower=0.1; //30steps/circle; 60Frames/sec ; 30/0.1=300Steps to draw 1 circle. 1Step=1Frame; 300Frames/60Fr/s=5s 
        let StepsPerFrameLower = 0.05;
        t_incrLower = StepsPerFrameLower * pathresolution;

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
        //pathres*end2.getSumOfRevolutions()=TWO_Pi/startOrbitRes >> because the end orbit turns faster. Rearranged:
        let pathres = Math.abs(TWO_PI / (startOrbitRes * end2.getSumOfRevolutions()));
        //TWO_PI / startOrbitRes= this would be the angle increment for the first child if we want startOrbitres steps for the first child
        //In order to have startOrbitRes for the last child that has to be end2.getSumOfRevolutions() times smaller. 

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