// Inspirired by
// Fractal Spirograph
// Video: https://youtu.be/0dwJ-bkJwDI
/// <reference path="./node_modules/@types/p5/global.d.ts" />
var path = [];
var SunTotalRevs = 3;
var angle = 0;
var stepCounter = 0;
var stepCounterLimit = 0;
var drawMe = false;
var animation = false;
var OrbitResolution = 50;
var speedadjustfactor = 0.05;
let cv;
var sun;
var end;
var arr_radius = [100, 60, 25, 12, 2, 5, 10];
var arr_revs = [1, 1, 3, 5, 2, 2, 2];
var arr_radoffset = [0, 0, 0, 0, 0, 0, 0];
let AnimSpeedSlider;
let SweepSlider;
let animresolution;
var revs_Inputs = [];
var radius_Inputs = [];
var offsets_Inputs = [];
let child1;
let child2;
let child3;
let lblInfo, lblX, lblY;
let ChildrenCount = 3;
var sweep = 0.1;
let param1 = 1.3;
let param2 = 2;
let param3 = 1;
let param4 = 1;
let sweepIncrement = 0.001;
let acttime = 0;
let finaltime = 0;

function setup() {
    cv = createCanvas(600, 600);
    cv.parent('sketch-div');
    lblInfo = document.getElementById("lblInfo");
    lblX = document.getElementById("lblX");
    lblY = document.getElementById("lblY");
    for (let i = 0; i < ChildrenCount; i++) {
        revs_Inputs[i] = document.getElementById("rev" + String(i + 1) + "Input");
        offsets_Inputs[i] = document.getElementById("offset" + String(i + 1) + "Input")
        radius_Inputs[i] = document.getElementById("radius" + String(i + 1) + "Input");
    }
    for (let k = 0; k < 2; k++) {
        AddMyOnInputEventHandler(revs_Inputs[k], arr_revs, k + 1, false, null);
        AddMyOnInputEventHandler(offsets_Inputs[k], arr_radoffset, k + 1, false, null);
        AddMyOnInputEventHandler(radius_Inputs[k], arr_radius, k + 1, false, null);
        revs_Inputs[k].value = arr_revs[k + 1];
        offsets_Inputs[k].value = arr_radoffset[k + 1];
        radius_Inputs[k].value = arr_radius[k + 1];
    }
    AnimSpeedSlider = document.getElementById("AnimSpeedSlider");
    SweepSlider = document.getElementById("SweepSlider");
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
    stepCounterLimit = GetTotalSteps();
    finaltime = stepCounterLimit;
    drawMe = true;
    animation = false;
    //drawMe = false;
    //animation = true;
}

function GetTotalSteps() {

    let child2incrementsteps = abs(OrbitResolution * end.getSumOfRevolutions());
    child2incrementsteps = abs(OrbitResolution * end.getSumOfRevolutions());
    return TWO_PI;
}

function ReadInputValues() {

    for (let k = 0; k < 2; k++) {
        arr_revs[k + 1] = revs_Inputs[k].value;
        arr_radoffset[k + 1] = offsets_Inputs[k].value;
        arr_radius[k + 1] = radius_Inputs[k].value;
    }
    path = [];
    stepCounter = 0;
    InitObjects();
};

function keyPressed() {

    if ((key == "f" || key == "F") && keyCode !== 102) {
        randomizeParams();
    }
}

function doubleClicked() {
    randomizeParams();
}

function randomizeParams() {

    GenerateRandomSpirographPattern(1.3 + sweep, 60);
    InitObjects();
    param1 = random(0.7, 1.3);
    param2 = random(1.6, 6);
    param3 = random();
    if (param3 > 0.5) {
        param3 = 1;
    } else {
        param3 = -1;
    }
    for (let k = 0; k < 2; k++) {
        offsets_Inputs[k].value = 0;
    }
    sweep = 0.1;
}

function draw() {

    if (drawMe) {
        const myEndOrbitStepLimit = 15000;
        OrbitResolution = myEndOrbitStepLimit / end.getSumOfRevolutions();
        animresolution = map(AnimSpeedSlider.value, 1, 100, 10, 1);
        lblX.innerHTML = "sum of revs of end planet: " + end.getSumOfRevolutions();
        lblX.innerHTML += "</br> TotalSteps of end planet: " + OrbitResolution * end.getSumOfRevolutions();

        background(33);
        CalcPath(finaltime);
        displayVertexShape();
        //drawMe = false;    
        sweepIncrement = map(SweepSlider.value, 0, 100, -0.1, 0.1);
        sweep += sweepIncrement;
        acttime += sweepIncrement;
        Orbit.prototype.time=acttime;
    }



    lblInfo.innerHTML = sun.time + "------path.length: " + path.length;
    lblInfo.innerHTML = "</br> Orbitres: " + OrbitResolution;
    if (animation) {
        Animate();
        lblX.innerHTML += "</br> TotalSteps of end planet: " + OrbitResolution * end.getSumOfRevolutions();
    }
    // lblInfo.innerHTML = stepCounterLimit + "------path.length: " + path.length;
    // lblInfo.innerHTML += "</br> Orbitres: " + OrbitResolution;
    var ch1 = sun.child;
    while (ch1 != null) {
        lblInfo.innerHTML += "</br> Revs: " + ch1.RevsAroundParent + " time= " + ch1.time;
        lblInfo.innerHTML += "___Totalrevs: " + ch1.getSumOfRevolutions();
        lblInfo.innerHTML += "</br> x " + ch1.x;
        ch1 = ch1.child;
    }
}

function CalcPath(time) {

    //   for (let child1Steps = 0; child1Steps < sun.time; child1Steps += 1) {
    var next = sun.child
    while (next != null) {
        next.SetOrbitPosition();
        next = next.child;
    }
    path.push(createVector(end.x, end.y));
    stepCounter++;
    //  }
}

function Animate() {

    background(51);
    let fastStep = 1 / end.angleIncr;
    let slowStep = 0.01 / end.angleIncr;

    animresolution = map(AnimSpeedSlider.value, 0, 100, slowStep, fastStep);

    for (var i = 0; i < animresolution; i++) {
        var next = sun;
        while (next != null) {
            next.update();
            next = next.child;
        }
        path.push(createVector(end.x, end.y));
    }
    var next = sun;
    while (next != null) {
        next.show();
        next = next.child;
    }

    displayVertexShape();
    if (path.length > stepCounterLimit) {
        animation = false;
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
            myArray[myIndex] = parseFloat(myHtmlElement.value);
            if (WriteBackValue) displayingelement.value = myArray[myIndex];
            //console.log("onwheel " + myHtmlElement.id)
        }
    };
}