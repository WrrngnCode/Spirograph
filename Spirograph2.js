// Inspirired by
// Fractal Spirograph
// Video: https://youtu.be/0dwJ-bkJwDI
/// <reference path="./node_modules/@types/p5/global.d.ts" />
/// <reference path="Orbit.js" />
var path = [];
var SunTotalRevs = 3;
var angle = 0;
var stepCounter = 0;
var stepCounterLimit = 0;
var drawMe = false;
var finalTimeLimit = 0;
var OrbitResolution = 50;
var speedadjustfactor = 0.05;
let cv;
var sun;
var end;
var arr_radius = [100, 60, 10, 30, 2, 5, 10];
var arr_revs = [1, 1, 4, 22, 1, 2, 2];
var arr_radoffset = [0, 0, -27, 0, 0, 0, 0];
let MaxStepsSlider;
let animresolution;
var revs_Inputs = [];
var radius_Inputs = [];
var offsets_Inputs = [];
let child1;
let child2;
let child3;
let lblInfo, lblX, lblY;
let ChildrenCount = 4;
var sweep = 0.1;
let param1 = 1.3;
let param2 = 2;
let param3 = 1;
let param4 = 1;
let sweepIncrement = 0.001;
let acttime = 0;


function setup() {
    cv = createCanvas(600, 600);
    cv.parent('sketch-div');

    cv.doubleClicked(() => {
        randomizeParams();
    });

    lblInfo = document.getElementById("lblInfo");
    lblX = document.getElementById("lblX");
    lblY = document.getElementById("lblY");
    for (let i = 0; i < ChildrenCount; i++) {
        revs_Inputs[i] = document.getElementById("rev" + String(i + 1) + "Input");
        offsets_Inputs[i] = document.getElementById("offset" + String(i + 1) + "Input")
        radius_Inputs[i] = document.getElementById("radius" + String(i + 1) + "Input");
    }
    for (let k = 0; k < ChildrenCount; k++) {
        AddMyOnInputEventHandler(revs_Inputs[k], arr_revs, k + 1, false, null);
        AddMyOnInputEventHandler(offsets_Inputs[k], arr_radoffset, k + 1, false, null);
        AddMyOnInputEventHandler(radius_Inputs[k], arr_radius, k + 1, false, null);
        AddMyOnWheelEventHandler(offsets_Inputs[k], 1, arr_radoffset, k + 1, false, null);
        revs_Inputs[k].value = arr_revs[k + 1];
        offsets_Inputs[k].value = arr_radoffset[k + 1];
        radius_Inputs[k].value = arr_radius[k + 1];
    }
    MaxStepsSlider = document.getElementById("MaxStepsSlider");
    AddMyOnWheelEventHandler(MaxStepsSlider, 1, null, null, null, null);

    MaxStepsSlider.oninput = function() {
        InitObjects();
    };
    InitObjects();

}


function InitObjects() {

    let childx;

    sun = new Orbit(width / 2, height / 2, arr_radius[0], null, 0, arr_revs[0], 0);
    childx = sun;
    for (let i = 1; i < ChildrenCount + 1; i++) {
        childx = childx.addChild(arr_radius[i], arr_radoffset[i], arr_revs[i]);
    }
    end = childx;
    path = [];
    stepCounter = 0;
    drawMe = true;
   
    ResetAnimation=true;
    //drawMe = false;
    //animation = true;
}




function keyPressed() {

    if ((key == "f" || key == "F") && keyCode !== 102) {
        randomizeParams();
    }
}

function randomizeParams() {
    GenerateRandomSpirographPattern(1, 65);

    for (let k = 0; k < ChildrenCount; k++) {
        offsets_Inputs[k].value = arr_radoffset[k + 1];
        radius_Inputs[k].value = arr_radius[k + 1];
        revs_Inputs[k].value = arr_revs[k + 1];
    }
    InitObjects();
    sweep = 0.1;
}

function GetOptimalTimeResolution(startRes, MaxAllowedSteps = 35000) {
    //MaxAllowedSteps of the "end" orbit
    //startres= how many steps the end orbit should make for one full revoulution (50)
    //timeres*end.getSumOfRevolutions()=TWO_Pi/startres >> because the end orbit turns faster. Rearranged:
    let timeres = Math.abs(TWO_PI / (startRes * end.getSumOfRevolutions()));
    finalTimeLimit = Math.abs(sun.child.RevsAroundParent * TWO_PI); ///finalTimeLimit is in radians
    let calculatedSteps = finalTimeLimit / timeres;
    OrbitResolution = startRes;

    if (calculatedSteps > MaxAllowedSteps) {
        timeres = finalTimeLimit / MaxAllowedSteps;
        OrbitResolution = Math.abs(TWO_PI / (timeres * end.getSumOfRevolutions()));
        return timeres;
    } else {
        return timeres;
    }
}

function draw() {
    let timeres;

    if (drawMe) {
        stepCounter = 0;
        let maxSteps = map(MaxStepsSlider.value, 1, 100, 200, 35000);
        timeres = GetOptimalTimeResolution(30, maxSteps);

        //lblX.innerHTML = "</br> Total Number of Iterations " + finalTimeLimit / timeres;
        //lblX.innerHTML += "</br> MAxStepsSlider " + maxSteps;
        background(33);
        CalcPath(finalTimeLimit, timeres);
        displayVertexShape();
        drawMe = false;

        //lblInfo.innerHTML = "Sun.time: " + sun.time + "------path.length: " + path.length;
        //lblInfo.innerHTML += "</br> Minumum Orbitres: " + OrbitResolution + "  &nbsp&nbsp Stepcounter: " + stepCounter;
        // lblInfo.innerHTML += "</br> timeres:" + timeres;

        // var ch1 = sun.child;
        // while (ch1 != null) {
        //     //lblInfo.innerHTML += "</br> Revs: " + ch1.RevsAroundParent + " time= " + ch1.time;
        //     //lblInfo.innerHTML += "___Totalrevs: " + ch1.getSumOfRevolutions();
        //    // lblInfo.innerHTML += "____posx " + ch1.x;
        //     ch1 = ch1.child;
        // }
        //path = [];

        //console.log("Drawme=false set..." + millis());
    }
    // if (animation) {
    //     Animate();
    //     lblX.innerHTML += "</br> TotalSteps of end planet: " + OrbitResolution * end.getSumOfRevolutions();
    // }
    // lblInfo.innerHTML = stepCounterLimit + "------path.length: " + path.length;
    // lblInfo.innerHTML += "</br> Orbitres: " + OrbitResolution;


}

function CalcPath(finaltime, res) {
    let max = finaltime + res
    for (let acttime = 0; acttime <= max; acttime += res) {
        var next = sun.child
        while (next != null) {
            next.SetOrbitPosition(acttime);
            next = next.child;
        }
        path.push(createVector(end.x, end.y));
        stepCounter++;
    }
}

function displayVertexShape() {
    strokeWeight(2);
    beginShape();
    stroke(255, 0, 255);
    noFill();
    for (var pos of path) {
        vertex(pos.x, pos.y);
    }
    endShape();
}

function ReadInputValues() {

    for (let k = 0; k < 2; k++) {
        arr_revs[k + 1] = revs_Inputs[k].value;
        arr_radoffset[k + 1] = offsets_Inputs[k].value;
        arr_radius[k + 1] = radius_Inputs[k].value;
    }
    InitObjects();

};

function AddMyOnInputEventHandler(myHtmlElement, myArray, myIndex, WriteBackValue, displayingelement) {

    myHtmlElement.oninput = function() {
        if (isNaN(myHtmlElement.value) === false && myHtmlElement.value != "") {
            myArray[myIndex] = parseFloat(myHtmlElement.value);
            if (WriteBackValue) displayingelement.value = myArray[myIndex];
        }
        ReadInputValues();
    };
}

function AddMyOnWheelEventHandler(myHtmlElement, incr, myArray, myIndex, WriteBackValue, displayingelement) {

    myHtmlElement.onwheel = function(e) {
        e.preventDefault();

        if (isNaN(myHtmlElement.value) === false && myHtmlElement.value != "") {
            if (e.deltaY > 0) {
                myHtmlElement.value = parseFloat(myHtmlElement.value) - parseFloat(incr)
            } else {
                myHtmlElement.value = parseFloat(myHtmlElement.value) + parseFloat(incr);
            }
            if (myArray != null && myIndex != null && WriteBackValue != null) {
                myArray[myIndex] = parseFloat(myHtmlElement.value);
                if (WriteBackValue) displayingelement.value = myArray[myIndex];
            }
            //console.log("onwheel " + myHtmlElement.id)
        }
        myHtmlElement.oninput();

    };
}