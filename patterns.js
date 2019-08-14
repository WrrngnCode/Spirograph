function GenerateRandomSpirographPattern(q, r) {

    r = floor(r);
    // do {

    param1 = Math.floor(random(2, 9));
    param2 = random(1.6, 4);
    param3 = random();
    if (param3 > 0.5) {
        param3 = 1;
    } else {
        param3 = -1;
    }

    arr_revs[1] = 1;
    arr_radius[1] = r;

    for (let i = 2; i < ChildrenCount + 1; i++) { //2,3
        arr_revs[i] = q * pow(param1,i-1) * pow(param3, i);
        arr_radius[i] = floor(r / (pow(param2, i - 1)));
        arr_radoffset[i] = 0; //random(-50, 50);
    }

    if (param1>=3){
        arr_revs[ChildrenCount]=1;
        arr_radius[ChildrenCount]=2;
    }

    //arr_revs[3] = 2;f
    //console.log(arr_revs);
    // } while (abs(arr_revs.reduce((pv, cv, i) => {
    //         if (i < 3) {
    //             return pv * cv;
    //         } else {
    //             return pv;
    //         }
    //     }, 1)) < 2);

}