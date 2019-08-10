function GenerateRandomSpirographPattern(q, r) {
    r = floor(r);
    // do {
    for (let i = 1; i < ChildrenCount + 1; i++) {
        arr_revs[i] = q * i * param1 * pow(param3, i);
        arr_radius[i] = r / (pow(param2, i - 1));
        arr_radoffset[i] = 0; //random(-50, 50);
    }
    arr_radoffset[1]=offsets_Inputs[0].value;
    arr_radoffset[2]=offsets_Inputs[1].value;
    //arr_revs[3] = 2;f
    //console.log(arr_revs);
    // } while (abs(arr_revs.reduce((pv, cv, i) => {
    //         if (i < 3) {
    //             return pv * cv;
    //         } else {
    //             return pv;
    //         }
    //     }, 1)) < 2);

    for (let k = 0; k < 2; k++) {
        revs_Inputs[k].value = arr_revs[k + 1];
        offsets_Inputs[k].value = arr_radoffset[k + 1];
        radius_Inputs[k].value = arr_radius[k + 1];
    }
}