export function addProd() {
    //this is for addProduct page selects
    function addProdSelShow(select) {
        let id = select.id
        let value = select.value

        let show_feild_span = document.getElementsByClassName(`show-${id}-span`)[0];
        let show_feild_div = document.getElementsByClassName(`show-${id}-div`)[0];

        if (value == 'add' && show_feild_span && show_feild_div) {
            if (id == 'spec') {
                let more_sub_spec_1 = document.getElementById('more-sub_spec-1');
                let more_spec_div = document.getElementById('more-spec-div');

                more_sub_spec_1.style.display = 'block';
                more_spec_div.style.display = 'block';
            }

            show_feild_span.style.display = 'inline-block';
            show_feild_div.style.display = 'block';
        } else if (show_feild_span && show_feild_div) {
            if (id == 'spec') {
                let more_sub_spec_1 = document.getElementById('more-sub_spec-1');
                let more_spec_div = document.getElementById('more-spec-div');

                more_sub_spec_1.style.display = 'none';
                more_spec_div.style.display = 'none';
            }

            show_feild_span.style.display = 'none';
            show_feild_div.style.display = 'none';
        }
    }

    let add_prod_form = document.getElementsByClassName('add-prod-form')[0];
    if (add_prod_form) {
        // console.log(add_prod_form);
        for (let seleFor = 0; seleFor < add_prod_form.length; seleFor++) {
            let select = add_prod_form.getElementsByTagName('select')[seleFor]
            if (select) {
                // console.log(select);
                select.addEventListener('change', () => {
                    // console.log(select.id + ' selected');
                    addProdSelShow(select)
                })
            }
        }
    }
    // ==========================================================================
    // ==========================================================================

    //this is for 
    function elementGenFunction(string_main) {
        let div = document.createElement('div')
        div.innerHTML = string_main;
        return div.firstElementChild;
    }

    let feildsArr = ['offer', 'warr', 'size', 'color', 'highlight', 'payops', 'services', 'spec']
    let offerCount
    let warrCount
    let sizeCount
    let colorCount
    let highlightCount
    let payopsCount
    let servicesCount
    let specCount
    let more_main_spec_counter_len

    function addFeildHTML(feild, counter) {
        if (counter == undefined) {
            counter = 0;
        }
        let plus_spanBtn_feild = document.getElementById(`plus-spanBtn-${feild}`)

        if (plus_spanBtn_feild) {
            plus_spanBtn_feild.addEventListener('click', () => {
                let more_feild_div = document.getElementById(`more-${feild}-div`);

                let offerStr = `<div id="offer-data-${counter + 2}"><hr>
                            <span id="delete-spanBtn-offer" class="bg-red-500 float-right rounded-full cursor-pointer px-2.5 py-0.5 mb-1"><strong>-</strong></span>
                            <input name="offers" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="offerstype${counter + 2}" type="text" placeholder="Enter Offer type">
                            <input name="offers" class="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="offersdetails${counter + 2}" type="text" placeholder="Enter Offer Details">
                        </div>`;

                let warrStr = `<div id="warr-data-${counter + 2}"><hr>
                        <span id="delete-spanBtn-warr" class="bg-red-500 float-right rounded-full cursor-pointer px-2.5 py-0.5 mb-1"><strong>-</strong></span>
                        <input name="warr-type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="warr-type${counter + 2}" type="text" placeholder="type Warranty / Garranty">
                        <input name="warr-dura" class="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="warr-dura${counter + 2}" type="text" placeholder="Enter Duration ( 2 Years )">
                        <input name="warr-desc" class="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="warr-desc${counter + 2}" type="text" placeholder="Enter Description">
                    </div>`;

                let sizeStr = `<div id="size-data-${counter + 2}"><hr>
                        <span id="delete-spanBtn-size" class="bg-red-500 float-right rounded-full cursor-pointer px-2.5 py-0.5 mb-1"><strong>-</strong></span>
                        <input name="sizes" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="size${counter + 2}" type="text" placeholder="Enter sizes ( S,M,L,XL.. )">
                    </div>`;

                let colorStr = `<div id="color-data-${counter + 2}"><hr>
                        <span id="delete-spanBtn-color" class="bg-red-500 float-right rounded-full cursor-pointer px-2.5 py-0.5 mb-1"><strong>-</strong></span>
                        <input name="colors" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="color${counter + 2}" type="text" placeholder="Enter colors">
                    </div>`;

                let highlightStr = `<div id="highlight-data-${counter + 2}">
                        <hr>
                        <span id="delete-spanBtn-highlight" class="bg-red-500 float-right rounded-full cursor-pointer px-2.5 py-0.5 mb-1"><strong>-</strong></span>
                        <input name="highlights" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="highlight${counter + 2}" type="text" placeholder="Enter highlights">
                    </div>`;

                let payopsStr = `<div id="payops-data-${counter + 2}">
                        <hr>
                        <span id="delete-spanBtn-payops" class="bg-red-500 float-right rounded-full cursor-pointer px-2.5 py-0.5 mb-1"><strong>-</strong></span>
                        <input name="payops" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="payops${counter + 2}" type="text" placeholder="Enter payment options">
                    </div>`;

                let servicesStr = `<div id="services-data-${counter + 2}">
                        <hr>
                        <span id="delete-spanBtn-services" class="bg-red-500 float-right rounded-full cursor-pointer px-2.5 py-0.5 mb-1"><strong>-</strong></span>
                        <input name="services" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="services${counter + 2}" type="text" placeholder="Enter services">
                    </div>`;

                let specStr = `<div id="spec-data-${counter + 2}">
                    <div id="sub_spec-div" class="sub_spec-div border rounded bg-gray-400 p-3 my-2">
                        <div id="key1" class="m-1">
                            <input required type="text" class="titleOfSpecField inline-block shadow appearance-none border rounded w-11/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="spec${counter + 2}" placeholder="Enter Title of Specification">
                            <span id="delete-spanBtn-spec" class="inline-block bg-red-500 float-right rounded-full cursor-pointer px-3 py-1"><strong>-</strong></span>
                        </div>
                        <div class="m-2 mt-4 flex specKeyValueField">
                            <input type="text" class="inline-block bg-gray-200 h-12 p-3" id="key${counter + 2}.1" placeholder="Enter Title">
                            <input type="text" class="ml-3 inline-block bg-gray-200 h-12 p-3" id="value${counter + 2}.1" placeholder="Enter Description">
                            <span id="plus-btn" class="bg-yellow-500 px-3 py-2 rounded-full cursor-pointer ml-5"><strong>+</strong></span>
                        </div>
                    </div>
                    <div id="more-sub_spec-${counter + 2}"></div>
                </div>`;

                let string
                eval(`string = ${feild}Str`)
                more_feild_div.appendChild(elementGenFunction(string));
                more_feild_div.setAttribute('data-count', counter + 1);
                if (feild == 'spec') {
                    showSubSpec() //when new mainSpec will add then plusBtn value(means -> nodelist update) for subSpec will be changed so again called showSubSpec()
                }

                //this is for delete feilds
                let delete_spanBtn_feild = document.querySelectorAll(`#delete-spanBtn-${feild}`);
                for (let item of delete_spanBtn_feild) {
                    item.addEventListener('click', (e) => {
                        if (feild == 'spec') {
                            e.target.parentElement.parentElement.parentElement.remove();
                        } else {
                            if (e.target.parentElement.tagName == 'SPAN') {
                                e.target.parentElement.parentElement.remove();
                            } else {
                                e.target.parentElement.remove();
                            }
                        }
                    })
                }

                counter++; //counter increment
                eval(`${feild}Count = ${counter}`) //specific counter is upadte

                return counter;
            })
        }
    }
    feildsArr.map(feild => {
        let counter
        eval(`counter = ${feild}Count`);

        for (let i = 0; i < feildsArr.length; i++) {
            if (feild == feildsArr[i]) {
                addFeildHTML(feild, counter)
            }
        }

        if (eval(`${feild}Count == undefined`)) {
            eval(`${feild}Count = 0`)
        }

    })

    // ==========================================================================================================================================

    //this is for add new sub_spec
    let more_sub_spec_counter = 0;

    function showSubSpec() {
        let plus_btn = document.querySelectorAll('#plus-btn');
        for (let i = 0; i < plus_btn.length; i++) {

            // console.log(plus_btn[i]);

            if (plus_btn[i]) {
                plus_btn[i].addEventListener('click', () => {

                    let more_sub_spec = document.getElementById(`more-sub_spec-${i + 1}`);
                    // console.log(more_sub_spec);

                    let string = `<div id="sub_spec-div" class="sub_spec-div mb-3">
                        <div style="margin-left: 22px;" class="specKeyValueField">
                            <input type="text" class="inline-block bg-gray-200 h-12 p-3" id="key${i + 1}.${more_sub_spec_counter + 2}" placeholder="Enter Title">
                            <input type="text" class="ml-3 inline-block bg-gray-200 h-12 p-3" id="value${i + 1}.${more_sub_spec_counter + 2}" placeholder="Enter Description">
                            <span class="plus-btn bg-red-500 px-3 py-2 pt-2 ml-2 rounded-full cursor-pointer"><strong>-</strong></span>
                        </div>
                    </div>`;

                    more_sub_spec.appendChild(elementGenFunction(string));

                    let plus_btn = document.getElementsByClassName('plus-btn')
                    for (let item of plus_btn) {
                        item.addEventListener('click', (e) => {
                            if (e.target.parentElement.tagName == 'DIV') {
                                e.target.parentElement.parentElement.remove();
                            } else {
                                // e.target.parentElement.tagName == 'SPAN'
                                e.target.parentElement.parentElement.parentElement.remove();
                            }
                        })
                    }

                    more_sub_spec_counter++;
                })
            }
        }
    }
    showSubSpec()


    // ==================================================================================================================================================================================
    // ==================================================================================================================================================================================

    // ===========================================================
    // Data fetching after submitting Form:-
    // ===========================================================

    let form = document.getElementById('form')
    let addProdSubBtn = document.getElementById('addProdSubBtn')
    if (addProdSubBtn) {
        addProdSubBtn.addEventListener('click', (e) => {
            // e.preventDefault();

            // ===========================================================
            //this is for find all data div and store into the new array
            // ===========================================================
            function feildDivPush(feild, counter) {
                let arr = [];
                for (let i = 0; i < counter + 2; i++) {
                    let feildDataDivs = document.getElementById(`${feild}-data-${i + 1}`)
                    if (feildDataDivs != null) {
                        arr.push(feildDataDivs);
                    }
                }
                return arr;
            }

            feildsArr.map(feild => {
                window[`${feild}DATA`] = {}; //sizeDATA = {}; create
                window[`${feild}DataDivsArr`] = []; //sizeDataDivsArr = []; create

                let counter = eval(`${feild}Count`) //counter = sizeCount

                let subArr = (feildDivPush(feild, counter)) //feildDivPush() called and return array of all data-divs
                let divsArr
                if (subArr != undefined) {
                    for (let j = 0; j < subArr.length; j++) {

                        divsArr = eval(`${feild}DataDivsArr`) //divsArr = sizeDataDivsArr
                        divsArr.push(subArr[j]) //push add data-div into divArr
                    }
                }
                window[`${feild}DataDivsArr`] = divsArr //copy divArr into sizeDataDivsArr
            })

            // ===========================================================
            //data collecting:-

            // ================== Offer ============================
            // let offerDataFor
            if (offerDataDivsArr != undefined) {
                for (let offerDataFor = 0; offerDataFor < offerDataDivsArr.length; offerDataFor++) {
                    let offertype
                    let offerdetails
                    if (document.getElementById(`offerstype${offerDataFor + 1}`) && document.getElementById(`offersdetails${offerDataFor + 1}`)) {

                        if (document.getElementById(`offerstype${offerDataFor + 1}`).value != '' && document.getElementById(`offersdetails${offerDataFor + 1}`).value != '') {
                            offertype = document.getElementById(`offerstype${offerDataFor + 1}`).value
                            offerdetails = document.getElementById(`offersdetails${offerDataFor + 1}`).value

                            if (!offerDATA[offerDataFor]) {
                                offerDATA[offerDataFor] = {
                                    [offertype]: offerdetails
                                }
                            }
                        }
                    }
                }
            }
            // console.log(offerDATA);

            // ==============================================
            // ================== Warranty ============================
            // let warrDataFor
            if (warrDataDivsArr != undefined) {
                for (let warrDataFor = 0; warrDataFor < warrDataDivsArr.length; warrDataFor++) {
                    let warrtype
                    let warrdura
                    let warrdesc

                    if (document.getElementById(`warr-type${warrDataFor + 1}`) && document.getElementById(`warr-dura${warrDataFor + 1}`) && document.getElementById(`warr-desc${warrDataFor + 1}`)) {

                        if (document.getElementById(`warr-type${warrDataFor + 1}`).value != '' && document.getElementById(`warr-dura${warrDataFor + 1}`).value != '' && document.getElementById(`warr-desc${warrDataFor + 1}`).value != '') {

                            warrtype = document.getElementById(`warr-type${warrDataFor + 1}`).value
                            warrdura = document.getElementById(`warr-dura${warrDataFor + 1}`).value
                            warrdesc = document.getElementById(`warr-desc${warrDataFor + 1}`).value

                            if (!warrDATA[warrDataFor]) {
                                warrDATA[warrDataFor] = {
                                    'type': warrtype,
                                    'duration': warrdura,
                                    'description': warrdesc
                                }
                            }
                        }
                    }
                }
            }
            // console.log(warrDATA);

            // ==============================================
            // ================== ['size', 'color', 'highlight', 'payops', 'services'] ============================

            let arrTypeFeild = ['size', 'color', 'highlight', 'payops', 'services']

            function arrTFFunc(feild, len) {
                if (len != undefined) {
                    var arr = [];
                    for (let arrTF = 1; arrTF < len.length + 1; arrTF++) {
                        let val

                        if (document.getElementById(feild + arrTF)) {
                            if (document.getElementById(feild + arrTF).value != '') {

                                val = document.getElementById(feild + arrTF).value
                                arr.push(val);
                            }
                        }
                    }
                }
                return arr;
            }

            arrTypeFeild.map(feild => {
                window[`${feild}ARR`] = []; //var sizeARR = []; (create)

                let len = eval(`${feild}DataDivsArr`) // let len = sizeDataDivsArr

                let subArr = (arrTFFunc(feild, len)) // function called and return array of values

                //iterate array and push value into divsArr
                let divsArr
                if (subArr != undefined) {
                    for (let j = 0; j < subArr.length; j++) {
                        divsArr = eval(`${feild}ARR`)
                        divsArr.push(subArr[j])
                    }
                }

                window[`${feild}DATA`] = {
                    divsArr
                };

                // console.log(window[`${feild}DATA`]);
            })

            // ==============================================
            // ================== specification ============================

            if (specDataDivsArr != undefined) {

                for (let j = 0; j < specDataDivsArr.length; j++) {

                    let specTitle
                    if (document.getElementById(`spec${j + 1}`).value != undefined) {
                        specTitle = document.getElementById(`spec${j + 1}`).value
                            // console.log(specTitle)
                    }

                    let subSpecDiv = document.querySelectorAll(`.sub_spec-div`)
                    if (subSpecDiv) {
                        for (let k = 0; k < subSpecDiv.length; k++) {

                            let specKey
                            let specValue

                            if (document.getElementById(`key${j + 1}.${k + 1}`)) {
                                if (document.getElementById(`key${j + 1}.${k + 1}`).value != undefined) {

                                    specKey = document.getElementById(`key${j + 1}.${k + 1}`).value
                                        // console.log(specKey)
                                }
                            }

                            if (document.getElementById(`value${j + 1}.${k + 1}`)) {
                                if (document.getElementById(`value${j + 1}.${k + 1}`).value != undefined) {

                                    specValue = document.getElementById(`value${j + 1}.${k + 1}`).value
                                        // console.log(specValue)
                                }
                            }

                            if (specKey && specValue) {
                                if (!specDATA[`${specTitle}`]) {
                                    specDATA[specTitle] = {
                                        [specKey]: specValue
                                    }
                                } else {
                                    let obj = {
                                        [specKey]: specValue
                                    }
                                    specDATA[specTitle] = {
                                        ...specDATA[specTitle],
                                        ...obj
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // console.log(specDATA);


            let last_form_data = document.getElementsByClassName('last_form_data')[0];
            let add_prod_fields_2 = document.getElementsByClassName('add-prod-fields-2')[0];
            let add_prod_fields_3 = document.getElementsByClassName('add-prod-fields-3')[0];

            let formHTML = `<div>
                        <input value='${JSON.stringify(offerDATA)}' type="text" name="offer">
                        <input value='${JSON.stringify(warrDATA)}' type="text" name="warr">
                        <input value='${JSON.stringify(sizeDATA)}' type="text" name="size">
                        <input value='${JSON.stringify(colorDATA)}' type="text" name="color">
                        <input value='${JSON.stringify(highlightDATA)}' type="text" name="highlight">
                        <input value='${JSON.stringify(payopsDATA)}' type="text" name="payops">
                        <input value='${JSON.stringify(servicesDATA)}' type="text" name="service">
                        <input value='${JSON.stringify(specDATA)}' type="text" name="specification">
                    </div>`;

            add_prod_fields_2.remove();
            add_prod_fields_3.remove();

            last_form_data.innerHTML = formHTML

            form.submit();
        })
    }

    // ===========================================================

    //This is for prodUpdate.ejs page --> when specification select will be change and click on [add ya both] options then showSubSpec() function will be called because of #plus-btn elements will be updated.
    let select = document.querySelectorAll('.select');
    for (let i = 0; i < select.length; i++) {
        select[i].addEventListener('change', () => {

            if (select[i].id == 'spec' && select[i].value == 'add' || select[i].value == 'both') {
                showSubSpec()
            }
        })
    }
}