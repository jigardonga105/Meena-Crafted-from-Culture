export function updateProd() {
    let elecArr = ['Mobiles', 'Mobile Accessories', 'Smart Wearable Tech', 'Health Care Appliances', 'Laptops', 'Desktop PCs', 'Gaming Accessories', 'Computer Accessories', 'Computer Peripherals', 'Tablets', 'Speakers', 'Smart Home Automation', 'Camera', 'Camera Accessories', 'Network Components']

    let tvsAppArr = ['Television', 'Washing Machine', 'Air Conditioners', 'Refrigerators', 'Kitchen Appliances', 'Healthy Living Appliances', 'Small Home Appliances']

    let menArr = ['Footwear', 'Mens Grooming', 'Top Wear', 'Bottom Wear', 'Suits, Blazers & Waistcoats', 'Ties, Socks, Cops & More', 'Fabrics', 'Winter Wear', 'Ethnic Wear', 'Innerwear & Loungewear', 'Raincoats & Windcheaters', 'Watches', 'Sports & Fitness Store', 'Smart Watches', 'Personal Care Appliances']

    let womanArr = ['Ethnic wear', 'Ethnic bottoms', 'footware', 'sandals', 'shoes', 'bllerians', 'slippers & Flip -flops', 'watches', 'smart watches', 'personal care Applications', 'eauty & Grooming', 'jewllery']

    let babyArr = ['kids clothings', 'boys clothing', 'girls clothing', 'baby boys clothing', 'kinds footware', 'boys footware', 'girls footware', 'infant footware', 'kids footware', 'character shoes', 'kids winter wear', 'boys winter wear', 'girls winter wear', 'toys', 'schools supplies', 'baby care']

    let homeArr = ['kitchen,cookware& serveware', 'Tableware &Dinner', 'kitchen storage', 'Furniture Top Offers', 'bed Room Furniture', 'Living Room Furmiture', 'Office & Study Furniture', 'DIY Furniture', 'Furnishing', 'Smart Home Automation', 'Home Improvement', 'home Decor ', 'Honme LIghting', 'Festival Decor& Gifts', 'pet Supplies', 'Durability Certified Furniture', 'Chrismas Store', 'Gardening Store']

    let sportArr = ['Food Essentials', 'Health & Nutrition', 'books', 'Stationery', 'Auto Accessories', 'industriall & Scientific tools', 'Medical Supplies', 'Music', 'Gaming', 'Grocery']

    function showSubCategory(Arr) {
        let subcategory = document.getElementById('subcategory');
        subcategory.removeAttribute('disabled')
        subcategory.innerHTML = '';
        for (let i = 0; i < Arr.length; i++) {
            let ops = document.createElement("option")
            ops.value = Arr[i]
            ops.classList = ['bg-black', 'text-white']
            ops.text = Arr[i]
            subcategory.options.add(ops)
        }
    }

    let itemdata = document.querySelector('#itemdata');
    let category = document.querySelector('#category');
    let subcategory = document.querySelector('#subcategory');
    let changename = document.getElementById('changename');
    let changedprice = document.getElementById('changedprice');
    let changeddiscount = document.getElementById('changeddiscount');
    let changedesc = document.getElementById('changedesc');

    if (itemdata) {
        let product = JSON.parse(itemdata.value);

        category.value = product.category;
        if (category.value === 'Electronics') {
            showSubCategory(elecArr);
        }
        if (category.value === 'TVs & Appliances') {
            showSubCategory(tvsAppArr);
        }
        if (category.value === 'Men') {
            showSubCategory(menArr);
        }
        if (category.value === 'Women') {
            showSubCategory(womanArr);
        }
        if (category.value === 'Baby & Kids') {
            showSubCategory(babyArr);
        }
        if (category.value === 'Home & Furniture') {
            showSubCategory(homeArr);
        }
        if (category.value === 'Sports, Books & More') {
            showSubCategory(sportArr);
        }


        category.addEventListener('change', () => {
            // console.log(category.value);
            if (category.value === 'Electronics') {
                showSubCategory(elecArr);
            }
            if (category.value === 'TVs & Appliances') {
                showSubCategory(tvsAppArr);
            }
            if (category.value === 'Men') {
                showSubCategory(menArr);
            }
            if (category.value === 'Women') {
                showSubCategory(womanArr);
            }
            if (category.value === 'Baby & Kids') {
                showSubCategory(babyArr);
            }
            if (category.value === 'Home & Furniture') {
                showSubCategory(homeArr);
            }
            if (category.value === 'Sports, Books & More') {
                showSubCategory(sportArr);
            }
        })

        subcategory.value = product.subcategory;
        changename.value = product.name;
        changedprice.value = product.price;
        changedesc.value = product.desc;
        if (product.discount) {
            changeddiscount.value = product.discount;
        }


        let stockOption1 = document.querySelector('#in')
        let stockOption2 = document.querySelector('#out')

        if (product.stock === true) {
            stockOption1.setAttribute("selected", '');
        } else if (product.stock === false) {
            stockOption2.setAttribute("selected", '');
        }
    }
    // ==============================================================================
    // ==============================================================================
    //this is for updateProd page selects
    function show(select, submitBtn, span, div, id) {

        let offer_sub_btn = document.getElementsByClassName(submitBtn)[0];
        let show_offer_span = document.getElementsByClassName(span)[0];
        let show_offer_div = document.getElementsByClassName(div)[0];

        if (select.value == 'ext') {
            if (id == 'spec') {
                let more_spec_div = document.getElementById('more-spec-div');
                more_spec_div.style.display = 'none';
            }

            offer_sub_btn.style.display = 'inline-block';
            show_offer_div.style.display = 'block';
            show_offer_span.style.display = 'none';

        } else if (select.value == 'add') {
            if (id == 'spec') {
                let more_spec_div = document.getElementById('more-spec-div');
                more_spec_div.style.display = 'block';
            }

            show_offer_div.style.display = 'none';
            offer_sub_btn.style.display = 'inline-block';
            show_offer_span.style.display = 'block';
        } else {
            if (id == 'spec') {
                let more_spec_div = document.getElementById('more-spec-div');
                more_spec_div.style.display = 'block';
            }

            offer_sub_btn.style.display = 'inline-block';
            show_offer_div.style.display = 'block';
            show_offer_span.style.display = 'block';
        }
    }

    let select = document.querySelectorAll('.select');
    for (let i = 0; i < select.length; i++) {
        select[i].addEventListener('change', () => {
            let feildSec = document.getElementById(select[i].id);
            feildSec.parentElement.style.background = 'black'


            if (select[i].id == 'spec' && select[i].value == 'add' || select[i].value == 'both') {

                let str = `<div id="sub_spec-div" class="sub_spec-div border rounded bg-gray-400 p-3 my-2">
                                    <div id="key1" class="m-1">
                                        <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="spec1" placeholder="Enter Title of Specification">
                                    </div>
                                    <div class="m-2 mt-4 flex">
                                        <input type="text" class="inline-block bg-gray-200 h-12 p-3" id="key1.1" placeholder="Enter Title">
                                        <input type="text" class="ml-3 inline-block bg-gray-200 h-12 p-3" id="value1.1" placeholder="Enter Description">
                                        <span id="plus-btn" class="bg-yellow-500 px-3 py-2 rounded-full cursor-pointer ml-5"><strong>+</strong></span>
                                    </div>
                                </div>
                                <div id="more-sub_spec-1" style="margin-left: 25%;"></div>`;

                let firstSpec = document.getElementById('firstSpec');
                firstSpec.innerHTML = '';
                firstSpec.innerHTML += str;

                show(feildSec, `${select[i].id}-sub-btn`, `show-${select[i].id}-span`, `show-${select[i].id}-div`, select[i].id)
            } else {
                let firstSpec = document.getElementById('firstSpec');
                firstSpec.innerHTML = '';
                show(feildSec, `${select[i].id}-sub-btn`, `show-${select[i].id}-span`, `show-${select[i].id}-div`, select[i].id)
            }
        })
    }
    // ==============================================================================
    // ==============================================================================
    // ==============================================================================
    // ==============================================================================

    let product;
    if (itemdata) {
        product = JSON.parse(itemdata.value);
    }

    // This for add HTML code into show-key-div
    function addHTML(key, str, len) {
        if (str != undefined) {
            let show_key_div = document.getElementsByClassName(`show-${key}-div`)[0];

            if (show_key_div) {
                show_key_div.innerHTML += str;
                show_key_div.setAttribute(`data-${key}len`, len);
            }
        }
    }

    let key;
    for (key in product) {
        // console.log(key);
        // console.log(product[key]);

        if (product[key][0]) {
            if (Object.keys(product[key][0]).length > 0) {
                // console.log(product[key][0]);

                let feild = product[key][0];

                // ==============================================================================
                // ==============================================================================

                if (key == 'color' || key == 'size' || key == 'payment_ops' || key == 'highlight' || key == 'service') {
                    // console.log(key);
                    // console.log(product[key].length);
                    let len
                    if (product[key].length > 0) {
                        len = product[key].length
                    } else {
                        len = 0;
                    }

                    function arrObj(key) {
                        product[key].map((arrEle, index) => {

                            if (key == 'payment_ops') {
                                key = 'payops';
                            }
                            if (key == 'service') {
                                key = 'services';
                            }

                            let Str = `<div>
                                            <span class="inline-block bg-blue-200 rounded px-2">${index + 1}:</span>
                                            <span class="ext-${key}-del inline-block bg-red-200 rounded mt-2 px-2 float-right cursor-pointer">-</span>
                                            <div id="ext-${key}-data-${index + 1}" class="mb-3 inline-block">
                                                <input name="${key}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="ext-${key}${index + 1}" type="text" placeholder="Enter Offer type" value="${arrEle}">
                                            </div>
                                        </div>`;

                            addHTML(key, Str, len)
                        })
                    }

                    arrObj(key);
                }

                // ==============================================================================
                // ==============================================================================
                if (key == 'specification') {
                    // console.log(key);
                    // console.log(feild);
                    let speclen = Object.keys(product[key][0]).length;
                    key = 'spec'

                    let spec;
                    for (spec in feild) {
                        // console.log(spec);
                        // console.log(Object.keys(feild).indexOf(spec));
                        let index = Object.keys(feild).indexOf(spec);

                        let specStr = `<div><span class="inline-block bg-blue-200 rounded px-2">${index + 1}:</span>
                                        <span class="ext-${key}-del inline-block bg-red-500 rounded mt-2 px-2 cursor-pointer">-</span>
                                        <div id="ext-${key}-data-${index + 1}" class="mb-3">
                                            <input name="spec" class="shadow appearance-none border rounded w-72 mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="ext-spec-title${index + 1}" type="text" placeholder="Enter Specification Title" value="${spec}">
                                            <span class="ml-1 font-bold text-white">:</span>
                                            <div class="ext-subSpec-${index + 1}"></div>
                                        </div></div>`;
                        addHTML(key, specStr, speclen)

                        let subSpec;
                        for (subSpec in feild[spec]) {
                            // console.log(subSpec);
                            // console.log(feild[spec][subSpec]);
                            let index2 = Object.keys(feild[spec]).indexOf(subSpec);
                            let subSpecStr = `<div class="sub_spec-div ml-80">
                                                <input name="spec" class="shadow appearance-none border rounded w-72 mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="ext-spec-key${index + 1}.${index2 + 1}" type="text" placeholder="Enter Specification key" value="${subSpec}">
                                                <input name="spec" class="shadow appearance-none border rounded w-72 mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="ext-spec-value${index + 1}.${index2 + 1}" type="text" placeholder="Enter Specification value" value="${feild[spec][subSpec]}">
                                                <span class="ext-${key}-del inline-block bg-red-200 rounded mt-2 px-2 cursor-pointer">-</span>
                                            </div>`;

                            let extSubSpec = document.getElementsByClassName(`ext-subSpec-${index + 1}`)[0];
                            extSubSpec.innerHTML += subSpecStr
                        }
                    }
                }
                // ==============================================================================
                // ==============================================================================

                for (let j = 0; j < Object.keys(feild).length; j++) {
                    // ==============================================================================

                    let warrStr = `<div>
                                    <span class="inline-block bg-blue-200 rounded px-2">${j + 1}:</span>
                                    <span class="ext-warr-del inline-block bg-red-200 rounded px-2 float-right cursor-pointer">-</span>
                                    <div id="ext-warr-data-${j + 1}" class="mb-3 inline-block">
                                    </div>
                                </div>`;

                    if (key == 'Warr_Garr') {
                        let warrlen = Object.keys(product[key][0]).length;

                        key = 'warr';
                        addHTML(key, warrStr, warrlen)

                    }
                    // ==============================================================================

                    let key2;
                    for (key2 in feild[j]) {
                        // console.log(key2);
                        // console.log(feild[j][key2]);

                        let offerStr;
                        let offerlen;
                        if (key == 'offer') {
                            offerlen = Object.keys(product[key][0]).length;
                            offerStr = `<div>
                                            <span class="inline-block bg-blue-200 rounded px-2">${j + 1}:</span>
                                            <span class="ext-offer-del inline-block bg-red-200 rounded px-2 float-right cursor-pointer">-</span>
                                            <div id="ext-offer-data-${j + 1}" class="mb-3 inline-block">
                                                <input name="offer" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="ext-offerstype${j + 1}" type="text" placeholder="Enter Offer type" value="${key2}">
                                                <input name="offer" class="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="ext-offersdetails${j + 1}" type="text" placeholder="Enter Offer Details" value="${feild[j][key2]}">
                                            </div>
                                        </div>`;
                        }

                        // ==============================================================================

                        if (key == 'warr') {
                            let extWarrData = document.getElementById(`ext-warr-data-${j + 1}`)
                                // console.log(extWarrData);
                                // console.log(key2);
                                // console.log(feild[j][key2]);
                            let Str = `<input name="warr-type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="ext-warr-${key2}${j + 1}" type="text" placeholder="${key2}" value="${feild[j][key2]}">`;

                            if (extWarrData) {
                                extWarrData.innerHTML += Str;
                            }
                        }

                        // ==============================================================================
                        // ==============================================================================

                        if (key == 'Warr_Garr') {
                            key = 'warr';
                        }
                        if (key == 'payment_ops') {
                            key = 'payops';
                        }
                        if (key == 'specification') {
                            key = 'spec';
                        }

                        addHTML(key, offerStr, offerlen)

                    }
                    let ext_key_del = document.getElementsByClassName(`ext-${key}-del`);
                    for (let item of ext_key_del) {
                        item.addEventListener('click', (e) => {
                            e.target.parentElement.remove()
                        })
                    }
                }
            }
        }

    }
    //==================================================================================================
    //==================================================================================================
    //==================================================================================================
    //==================================================================================================
    let feildsArr = ['offer', 'warr', 'size', 'color', 'highlight', 'payops', 'services', 'spec'];

    function formDataSend(prdID, DATA, name) {
        // action="/seller/updateitem/<%= product._id %>" method="POST"
        let form = document.createElement('form');
        form.setAttribute('action', `/seller/updateitem/${prdID}`);
        form.setAttribute('method', 'POST');

        let input = document.createElement('input');
        input.setAttribute('name', name);
        input.setAttribute('value', JSON.stringify(DATA));

        form.appendChild(input);

        let forFormDiv = document.getElementById('forForm');
        forFormDiv.appendChild(form);
        console.log(form);
        form.submit();
    }

    function offerDataColt(length, feild, id1, id2, id3) {

        for (let j = 0; j < length; j++) {

            // ============================== Offer Start ==============================
            if (feild == 'offer') {

                let offertype
                let offerdetails
                if (document.getElementById(`${id1}${j + 1}`) && document.getElementById(`${id2}${j + 1}`)) {

                    if (document.getElementById(`${id1}${j + 1}`).value != '' && document.getElementById(`${id2}${j + 1}`).value != '') {

                        offertype = document.getElementById(`${id1}${j + 1}`).value
                        offerdetails = document.getElementById(`${id2}${j + 1}`).value

                        let dataObjLen = Object.keys(offerDATA).length;

                        if (!offerDATA[dataObjLen]) {

                            offerDATA[dataObjLen] = {
                                [offertype]: offerdetails
                            }
                        }
                    }
                }
            }
            // ============================== Offer End ==============================

            // ============================== Warranty Start ==============================
            if (feild == 'warr') {

                let warrtype
                let warrdura
                let warrdesc
                if (document.getElementById(`${id1}${j + 1}`) && document.getElementById(`${id2}${j + 1}`) && document.getElementById(`${id3}${j + 1}`)) {

                    if (document.getElementById(`${id1}${j + 1}`).value != '' && document.getElementById(`${id2}${j + 1}`).value != '' && document.getElementById(`${id3}${j + 1}`).value != '') {

                        warrtype = document.getElementById(`${id1}${j + 1}`).value
                        warrdura = document.getElementById(`${id2}${j + 1}`).value
                        warrdesc = document.getElementById(`${id3}${j + 1}`).value

                        let dataObjLen = Object.keys(warrDATA).length;

                        if (!warrDATA[dataObjLen]) {

                            warrDATA[dataObjLen] = {
                                'type': warrtype,
                                'duration': warrdura,
                                'description': warrdesc
                            }
                        }
                    }
                }
            }
            // ============================== Warranty End ==============================

            // ============================== Size, Color, payops ... Start ==============================
            if (feild == 'size' || feild == 'color' || feild == 'highlight' || feild == 'payops' || feild == 'services') {
                let val
                if (document.getElementById(`${id1}${j + 1}`)) {
                    if (document.getElementById(`${id1}${j + 1}`).value != '') {

                        val = document.getElementById(`${id1}${j + 1}`).value
                        window[`${feild}ARR`].push(val);
                    }
                }

                // console.log(window[`${feild}ARR`]);

                let divsArr = window[`${feild}ARR`];
                window[`${feild}DATA`] = {
                    divsArr
                };
            }
            // ============================== Size, Color, payops ... End ==============================

            // ============================== Specification Start ==============================
            if (feild == 'spec') {
                let specTitle
                if (document.getElementById(`${id1}${j + 1}`)) {
                    if (document.getElementById(`${id1}${j + 1}`).value != undefined) {
                        specTitle = document.getElementById(`${id1}${j + 1}`).value
                            // console.log(specTitle)
                    }
                }

                let subSpecDiv = document.querySelectorAll(`.sub_spec-div`)
                if (subSpecDiv) {
                    for (let k = 0; k < subSpecDiv.length; k++) {

                        let specKey
                        let specValue

                        if (document.getElementById(`${id2}${j + 1}.${k + 1}`)) {
                            if (document.getElementById(`${id2}${j + 1}.${k + 1}`).value != undefined) {

                                specKey = document.getElementById(`${id2}${j + 1}.${k + 1}`).value
                                    // console.log(specKey)
                            }
                        }

                        if (document.getElementById(`${id3}${j + 1}.${k + 1}`)) {
                            if (document.getElementById(`${id3}${j + 1}.${k + 1}`).value != undefined) {

                                specValue = document.getElementById(`${id3}${j + 1}.${k + 1}`).value
                                    // console.log(specValue)
                            }
                        }

                        if (specTitle && specKey && specValue) {
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
                // console.log(specDATA);
            }
            // ============================== Specification End ==============================
        }
    }


    let btn = document.querySelectorAll('#btn');
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', () => {

            feildsArr.map(feild => {

                window[`${feild}DATA`] = {}; //sizeDATA = {}; create

                if (feild == btn[i].classList[0]) {

                    let show_feild_div = document.getElementsByClassName(`show-${feild}-div`)[0];
                    if (show_feild_div.children) {

                        if (feild == 'offer') {
                            //========================= Offer ============================
                            var len;
                            eval(`len = show_feild_div.dataset.${feild}len`)
                            let extid1 = 'ext-offerstype';
                            let extid2 = 'ext-offersdetails';
                            offerDataColt(len, feild, extid1, extid2);

                            let moreFeildDiv = document.getElementById(`more-${feild}-div`);
                            let counter = moreFeildDiv.dataset.count;
                            let id1 = 'offerstype';
                            let id2 = 'offersdetails';
                            offerDataColt(counter + 1, feild, id1, id2);

                            let name = 'offer'
                            formDataSend(product._id, offerDATA, name)

                            // console.log(offerDATA);
                        }

                        if (feild == 'warr') {
                            //========================= Warranty ============================
                            var len;
                            eval(`len = show_feild_div.dataset.${feild}len`)
                            let extid1 = 'ext-warr-type';
                            let extid2 = 'ext-warr-duration';
                            let extid3 = 'ext-warr-description';
                            offerDataColt(len, feild, extid1, extid2, extid3);

                            let moreFeildDiv = document.getElementById(`more-${feild}-div`);
                            let counter = moreFeildDiv.dataset.count;
                            let id1 = 'warr-type';
                            let id2 = 'warr-dura';
                            let id3 = 'warr-desc';
                            offerDataColt(counter + 1, feild, id1, id2, id3);

                            let name = 'Warr_Garr'
                            formDataSend(product._id, warrDATA, name)

                            // console.log(warrDATA);
                        }

                        if (feild == 'size' || feild == 'color' || feild == 'highlight' || feild == 'payops' || feild == 'services') {
                            window[`${feild}ARR`] = [];

                            //=========================  ============================
                            var len;
                            eval(`len = show_feild_div.dataset.${feild}len`)
                            let extid1 = `ext-${feild}`;
                            offerDataColt(len, feild, extid1);

                            let moreFeildDiv = document.getElementById(`more-${feild}-div`);
                            let counter = parseInt(moreFeildDiv.dataset.count);

                            let id1 = `${feild}`;
                            offerDataColt(counter + 1, feild, id1);

                            let name = `${feild}`;
                            if (feild == 'payops') {
                                name = 'payment_ops';
                            }
                            if (feild == 'services') {
                                name = 'service'
                            }
                            formDataSend(product._id, eval(`${feild}DATA`), name)

                            // console.log(eval(`${feild}DATA`));
                        }

                        if (feild == 'spec') {
                            //========================= Specification ============================
                            var len;
                            eval(`len = show_feild_div.dataset.${feild}len`)
                            let extid1 = 'ext-spec-title';
                            let extid2 = 'ext-spec-key';
                            let extid3 = 'ext-spec-value';
                            offerDataColt(len, feild, extid1, extid2, extid3);

                            let moreFeildDiv = document.getElementById(`more-${feild}-div`);
                            let counter = moreFeildDiv.dataset.count;
                            let id1 = 'spec';
                            let id2 = 'key';
                            let id3 = 'value';
                            offerDataColt(counter + 1, feild, id1, id2, id3);

                            let name;
                            if (feild == 'spec') {
                                name = 'specification'
                            }
                            formDataSend(product._id, specDATA, name)

                            // console.log(specDATA);
                        }
                    }
                }
            })
        })
    }
}