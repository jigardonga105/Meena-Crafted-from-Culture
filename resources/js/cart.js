import axios from "axios";
import Noty from "noty";

export function cart() {
    let addToCartBtn = document.getElementsByClassName("addToCartBtn");
    let cartCounter = document.getElementById("cartCounter");

    function cartUpdateNoty(msg, type) {
        new Noty({
            type: type,
            timeout: 3000,
            text: msg,
            progressBar: false,
        }).show();
    }

    function updateCart(product) {
        //if user click on shopSingle page counter
        var prdQty;
        let shopSingleCounter = document.getElementsByClassName('shopSingleCounter')[0];
        if (shopSingleCounter) {
            prdQty = shopSingleCounter.innerHTML;
        } else {
            prdQty = 1;
        }

        //if user select color
        var color;
        let colorImg = document.getElementsByClassName('select')[0];
        if (colorImg) {
            color = colorImg.nextElementSibling.dataset.value;
        }

        //if user select size
        var size
        let selectedSize = document.getElementsByClassName('selectedSize')[0];
        if (selectedSize) {
            size = selectedSize.dataset.value;
        }

        axios.post("/addToCart", { product, prdQty, color, size })
            .then((response) => {
                if (response.data.msg) {
                    let msg = response.data.msg;
                    if (msg == "You are not logged in") {
                        cartUpdateNoty(msg, "information");
                    } else if (
                        msg == "We are facing some essuse. Please try again later 🙏"
                    ) {
                        cartUpdateNoty(msg, "information");
                    } else if (msg == "Currently you are not Customer.") {
                        cartUpdateNoty(msg, "information");
                    }
                } else if (response.data.totalQty) {
                    let totalQty = response.data.totalQty;

                    // cartCounter.innerText = '';
                    cartCounter.innerText = totalQty;

                    cartUpdateNoty("Item added to cart", "success");
                }
            })
            .catch((err) => {
                cartUpdateNoty("Something went wrong", "error");
            });
    }

    if (addToCartBtn) {
        for (let i = 0; i < addToCartBtn.length; i++) {
            let btn = addToCartBtn[i];

            btn.addEventListener("click", (e) => {
                let product = JSON.parse(btn.dataset.product);
                // console.log(product);
                updateCart(product);
            });
        }
    }

    //==================================================================
    //==================================================================
    //==================================================================
    function forRightSideDiv(cartTotalQty, cartTotalPrice, cartTotalDiscount) {

        let cartRightDiv = document.getElementById('cartRightDiv');

        let cartRightDivStr = `<div>
                                <div class="p-3 border-b">
                                    <span class="text-muted">PRICE DETAILS</span>
                                </div>

                                <div class="m-3 border-b-4 border-dotted">
                                    <div class="my-3">
                                        <span id="rightDivPriceItem">Price (${cartTotalQty} items)</span>
                                        <span id="rightDivPrice" class="float-right">₹${cartTotalPrice}</span>
                                    </div>
                                    <div class="my-3">
                                        <span>Discount</span>
                                        <span id="rightDivDisc" class="float-right text-green-600">- ₹${cartTotalDiscount}</span>
                                    </div>
                                    <div class="my-3">
                                        <span>Delivery Charges</span>
                                        <span class="float-right text-green-600">Free</span>
                                    </div>
                                </div>

                                <div class="m-3 border-b-4 border-dotted">
                                    <div class="my-3">
                                        <span>Total Amount</span>
                                        <span id="rightDivFinalPrice" class="float-right font-bold">₹${cartTotalPrice - cartTotalDiscount}</span>
                                    </div>
                                </div>

                                <div class="m-3">
                                    <div class="my-3">
                                        <span id="rightDivSavePrice" class="text-green-700 font-bold">You will save ₹${cartTotalDiscount} on this order</span>
                                    </div>
                                </div>
                            </div>`;
        cartRightDiv.innerHTML = cartRightDivStr;
    }

    function fillDataCart(user, cartData, prdData, strNameArr, day, month, dateToday) {
        let allCartProduct = document.getElementById('allCartProduct');
        allCartProduct.innerHTML = '';

        let cartTotalQty = cartData['custID_' + user['_id'] + '_cart'].totalQty;
        let cartTotalPrice = cartData['custID_' + user['_id'] + '_cart'].totalPrice;
        let cartTotalDiscount = 0;

        document.getElementById('itemLength').innerHTML = `My Cart(${cartTotalQty})`;

        prdData.map((prd, index) => {
            let priceAftDisc = prd.price - ((prd.price / 100) * prd.discount);
            priceAftDisc = Math.round(priceAftDisc);

            let prdService;
            prd.service.map((service) => {
                if (service.search("return") >= 0) {
                    prdService = service;
                } else if (service.search("Return") >= 0) {
                    prdService = service;
                } else if (service.search("Replacement") >= 0) {
                    prdService = service;
                } else if (service.search("replacement") >= 0) {
                    prdService = service;
                }
            })

            let feature = cartData[`custID_${user._id}_cart`].items[`${prd._id}`].feature

            for (let featureKey in feature) {

                let prdStr = `<div class="cartSinglePrdMain grid grid-cols-6 my-4 pt-3 border-t">
                                <div class="cartSinglePrdImg flex flex-col col-span-1">
                                    <div class="h-24 overflow-hidden mx-auto">
                                        <img class="w-40 cursor-pointer" src="/uploadedImages/${prd.image[0].img}" onclick="window.location.href = '/productview/${prd._id}'" alt="Product Image">
                                    </div>
                                    <div class="cartSingleCounter mt-2 mx-auto">
                                        <span id="cartMinBtn" data-prd='${JSON.stringify({ id: prd._id, featureKey })}' class="cartPlusMin rounded-full px-2 py-1 cursor-pointer focus:outline-none">-</span>
                                        <span id="cartItemLen" class="${prd._id}_qty bg-gray-100 px-4 py-2">${feature[featureKey].qty}</span>
                                        <span id="cartPlusBtn" data-prd='${JSON.stringify({ id: prd._id, featureKey })}' class="cartPlusMin rounded-full px-2 py-1 cursor-pointer focus:outline-none">+</span>
                                    </div>
                                </div>
    
                                <div class="cartSinglePrdInfo col-span-3 px-2">
                                    <div>
                                        <div>
                                            <span class="text-base font-bold cursor-pointer" onclick="window.location.href = '/productview/${prd._id}'">${prd.name.substring(0, 45)}${prd.name.length > 45 ? '...' : ''}</span>
                                        </div>
                                        <div>
                                            <span class="text-base text-muted">Seller: ${strNameArr[index]}</span>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <span class="font-bold">₹${priceAftDisc}</span>
                                        <span class="line-through text-base text-muted ml-2">₹${prd.price}</span>
                                        <span class="text-green-800 font-bold text-sm ml-2">${prd.discount}% off</span>
                                        <span class="text-green-800 font-bold text-sm ml-2">
                                            ${Object.keys(prd.offer[0]).length} offer available
                                            <i id="cartOfferIcon" class="fas fa-info-circle cursor-pointer"></i>
                                            <div id="cartOfferDiv" class="cartOfferDiv w-72 border absolute z-10 bg-white rounded">
                                                <div class="text-12 p-3">
                                                    <div class="m-1 border-b-4 border-dotted">
                                                        <div class="my-1">
                                                            <span class="text-muted">MRP</span>
                                                            <span class="float-right line-through">₹${prd.price}</span>
                                                        </div>
                                                        <div class="my-1">
                                                            <span class="text-muted">Selling Price</span>
                                                            <span class="float-right">₹${priceAftDisc}</span>
                                                        </div>
                                                        <div class="my-1">
                                                            <span class="text-muted">Extra Discount</span>
                                                            <span class="float-right text-green-600">${prd.extraDiscount ? prd.extraDiscount : 0}%</span>
                                                        </div>
                                                        <div class="my-1">
                                                            <span class="text-muted">Special Price</span>
                                                            <span class="float-right">₹${priceAftDisc}</span>
                                                        </div>
                                                    </div>
    
                                                    <div class="m-1 border-b-4 border-dotted">
                                                        <div class="my-1">
                                                            <span class="text-muted">Total</span>
                                                            <span class="float-right font-bold">₹${priceAftDisc}</span>
                                                        </div>
                                                    </div>
    
                                                    <div class="m-1">
                                                        <div class="my-1">
                                                            <span class="text-green-700 font-bold">Save more
                                                                with these offers</span>
                                                        </div>
                                                        <div class="my-1">
                                                            <ul id="cartOfferUl" data-prdInd="${index}" class="pl-0">
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div class="cartSinglePrdRemBuNowMain flex justify-content-center gap-x-5 mt-3">
                                        <div>
                                            <form action="/deleteCartPrd" id="${prd._id}_cartRemovePrdForm" method="POST">
                                                <input type="hidden" name="removePrdId" value="${prd._id}"/>
                                                <input type="hidden" name="removePrdPrice" value="${prd.price}"/>
                                                <input type="hidden" name="removePrdfeatKey" value="${featureKey}"/>
                                                <input type="hidden" name="haveToRedirect" value="true"/>
                                                <button class="cartItemRemBtn shadow px-2 py-1 rounded focus:outline-none">Remove</button>
                                            </form>
                                        </div>
                                        <div>
                                            <form action="/buyNow" id="${prd._id}_cartBuyNowForm" method="POST">
                                                <input type="hidden" name="product" value='${JSON.stringify(prd)}'/>
                                                <input type="hidden" id="${prd._id}_onlyPrdQty" name="prdQty" value=""/>
                                                <input type="hidden" name="color" ${feature[featureKey].color ? `value="${feature[featureKey].color}"` : ''} />
                                                <input type="hidden" name="size" ${feature[featureKey].size ? `value="${feature[featureKey].size}"` : ''} />
                                            </form>
                                            <button id="cartBuyNowFormSubBtn" class="cartItemOnlyBtn cartBuyNowFormSubBtn shadow px-2 py-1 rounded focus:outline-none" value="${prd._id}">Buy this only</button>
                                        </div>
                                    </div>
                                </div>
    
                                <div class="cartSinglePrdFeat col-span-2">
                                    <div>
                                        <span class="text-base">
                                            Delivery by ${day} ${month} ${dateToday} |
                                            <span class="text-green-900">Free</span>
                                            <span class="line-through">₹40</span>
                                        </span>
                                    </div>
                                    <div>
                                        <span class="text-muted text-sm">${prdService == undefined ? 'No Return Policy' : prdService}</span>
                                    </div>
                                    <div class="mt-3 bg-gray-100 p-2 shadow">
                                        ${feature[featureKey].color ? '<div><span class="font-bold mr-2">Color:</span>' + feature[featureKey].color + '</div>' : ''}
                                        ${feature[featureKey].size ? '<div><span class="font-bold mr-2">Size:</span>' + feature[featureKey].size + '</div>' : ''}
                                    </div>
                                </div>
                            </div>`;

                allCartProduct.innerHTML += prdStr;

                let cartItemsQty = feature[featureKey].qty
                cartTotalDiscount = cartTotalDiscount + Math.round([((prd.price / 100) * prd.discount)] * parseInt(cartItemsQty));
            }

        })
        let cartOfferUl = document.querySelectorAll('#cartOfferUl');

        for (let i = 0; i < cartOfferUl.length; i++) {

            let prdInd = cartOfferUl[i].dataset.prdind

            for (let offer in prdData[prdInd].offer[0]) {

                for (let key in prdData[prdInd].offer[0][offer]) {

                    let li = document.createElement("li");
                    li.classList.add('m-1', 'list-disc')
                    li.innerHTML = `${prdData[prdInd].offer[0][offer][key]}`

                    cartOfferUl[i].appendChild(li);
                }
            }
        }


        forRightSideDiv(cartTotalQty, cartTotalPrice, cartTotalDiscount)
    }


    let cartDataInp = document.getElementById('cartData');
    let prdDataInp = document.getElementById('prdData');
    let strNameArrInp = document.getElementById('strNameArr');

    let user;
    let cartData;
    let prdData;
    let strNameArr;
    let date;
    let day;
    let month;
    let dateToday;

    if (cartDataInp && prdDataInp && strNameArrInp) {
        user = JSON.parse(cartDataInp.dataset.user);
        cartData = JSON.parse(cartDataInp.value);
        prdData = JSON.parse(prdDataInp.value);
        strNameArr = JSON.parse(strNameArrInp.value);

        if (prdData.length > 5) {
            date = new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000));
        } else if (prdData.length > 2) {
            date = new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000));
        } else if (prdData.length > 0) {
            date = new Date(new Date().getTime() + (8 * 24 * 60 * 60 * 1000));
        }
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        day = days[date.getDay()];
        month = months[date.getMonth()];
        dateToday = date.getDate();

        fillDataCart(user, cartData, prdData, strNameArr, day, month, dateToday);
    }

    // =====================================================================================
    // =====================================================================================
    // =====================================================================================

    //counter of cart plus-min button
    function cartPlusMinFunc() {
        let cartPlusBtn = document.querySelectorAll('#cartPlusBtn');
        let cartMinBtn = document.querySelectorAll('#cartMinBtn');
        let cartItemLen = document.querySelectorAll('#cartItemLen');

        function hideMinBtn(cartItemLen, cartPlusBtn, cartMinBtn) {
            if (cartItemLen.innerHTML < 4) {
                cartPlusBtn.classList.remove("hidden");
            } else {
                cartPlusBtn.classList.add("hidden");
            }

            if (cartItemLen.innerHTML == 1) {
                cartMinBtn.classList.add("hidden");
            } else {
                cartMinBtn.classList.remove("hidden");
            }
        }

        function changeCartItemData(qty, totalQty, totalPrice, prdData) {
            document.getElementById('itemLength').innerHTML = `My Cart(${totalQty})`;
            document.getElementById('rightDivPriceItem').innerHTML = `Price (${totalQty} items)`;
            document.getElementById('cartCounter').innerHTML = qty;

            let cartTotalDiscount = 0;
            prdData.map((prd, index) => {
                cartTotalDiscount = cartTotalDiscount + Math.round([((prd.price / 100) * prd.discount)] * qty);
            });

            document.getElementById('rightDivPrice').innerHTML = `₹${totalPrice}`;
            document.getElementById('rightDivDisc').innerHTML = `₹${cartTotalDiscount}`;
            document.getElementById('rightDivFinalPrice').innerHTML = `₹${totalPrice - cartTotalDiscount}`;
            document.getElementById('rightDivSavePrice').innerHTML = `You will save ₹${cartTotalDiscount} on this order`;
        }

        let product;

        function findProduct(prdData, prdID) {
            prdData.map((prd, index) => {
                if (prd._id == prdID) {
                    product = prd;
                }
            });
        }

        //cartPlusBtn:
        for (let i = 0; i < cartPlusBtn.length; i++) {

            hideMinBtn(cartItemLen[i], cartPlusBtn[i], cartMinBtn[i]);

            cartPlusBtn[i].addEventListener("click", () => {

                let data = JSON.parse(cartPlusBtn[i].dataset.prd);

                let prdID = data['id']
                let featureKey = data['featureKey']
                findProduct(prdData, prdID);
                let prdPrice = product.price;
                let plus = true;

                axios.post("/updateCart", { prdID, plus, prdPrice, featureKey })
                    .then((response) => {
                        if (response.data.qty) {
                            cartItemLen[i].innerHTML = response.data.qty;
                            changeCartItemData(response.data.qty, response.data.totalQty, response.data.totalPrice, prdData);
                            hideMinBtn(cartItemLen[i], cartPlusBtn[i], cartMinBtn[i]);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        }

        //cartMinBtn:
        for (let i = 0; i < cartMinBtn.length; i++) {

            hideMinBtn(cartItemLen[i], cartPlusBtn[i], cartMinBtn[i]);

            cartMinBtn[i].addEventListener("click", () => {

                let data = JSON.parse(cartMinBtn[i].dataset.prd);

                let prdID = data['id']
                let featureKey = data['featureKey']
                findProduct(prdData, prdID);
                let prdPrice = product.price;
                let min = true;

                axios.post("/updateCart", { prdID, min, prdPrice, featureKey })
                    .then((response) => {
                        if (response.data.qty) {
                            cartItemLen[i].innerHTML = response.data.qty;
                            changeCartItemData(response.data.qty, response.data.totalQty, response.data.totalPrice, prdData);
                            hideMinBtn(cartItemLen[i], cartPlusBtn[i], cartMinBtn[i]);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        }
    }

    cartPlusMinFunc();

    //================================================================
    //================================================================
    //================================================================
    let deliverToImg = document.getElementById('deliverToImg');
    let url = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZWxsaXBzZSBjeD0iOSIgY3k9IjE0LjQ3OCIgZmlsbD0iI0ZGRTExQiIgcng9IjkiIHJ5PSIzLjUyMiIvPjxwYXRoIGZpbGw9IiMyODc0RjAiIGQ9Ik04LjYwOSA3LjAxYy0xLjA4IDAtMS45NTctLjgyNi0xLjk1Ny0xLjg0NSAwLS40ODkuMjA2LS45NTguNTczLTEuMzA0YTIuMDIgMi4wMiAwIDAgMSAxLjM4NC0uNTRjMS4wOCAwIDEuOTU2LjgyNSAxLjk1NiAxLjg0NCAwIC40OS0uMjA2Ljk1OS0uNTczIDEuMzA1cy0uODY0LjU0LTEuMzgzLjU0ek0zLjEzIDUuMTY1YzAgMy44NzQgNS40NzkgOC45MjIgNS40NzkgOC45MjJzNS40NzgtNS4wNDggNS40NzgtOC45MjJDMTQuMDg3IDIuMzEzIDExLjYzNCAwIDguNjA5IDAgNS41ODMgMCAzLjEzIDIuMzEzIDMuMTMgNS4xNjV6Ii8+PC9nPjwvc3ZnPg==';
    if (deliverToImg) {
        deliverToImg.setAttribute('src', url);
    }
    //================================================================

    //================================================================
    let cartOfferIcon = document.querySelectorAll('#cartOfferIcon');
    let cartOfferDiv = document.querySelectorAll('#cartOfferDiv');

    if (cartOfferIcon) {
        for (let i = 0; i < cartOfferIcon.length; i++) {
            cartOfferDiv[i].style.display = 'none';
            cartOfferIcon[i].addEventListener('mouseover', () => {
                cartOfferDiv[i].style.display = 'inline-block';
            })
            cartOfferDiv[i].addEventListener('mouseover', () => {
                cartOfferDiv[i].style.display = 'inline-block';
            })
            cartOfferDiv[i].addEventListener('mouseout', () => {
                cartOfferDiv[i].style.display = 'none';
            })
            cartOfferIcon[i].addEventListener('mouseout', () => {
                cartOfferDiv[i].style.display = 'none';
            })
        }
    }
    //================================================================


    //================================================================
    function cartBuyNowPerform() {
        let cartBuyNowFormSubBtns = document.getElementsByClassName('cartBuyNowFormSubBtn');
        for (let i = 0; i < cartBuyNowFormSubBtns.length; i++) {
            const cartBuyNowFormSubBtn = cartBuyNowFormSubBtns[i];
            if (cartBuyNowFormSubBtn) {
                cartBuyNowFormSubBtn.addEventListener('click', () => {
                    let prdId = cartBuyNowFormSubBtn.value;
                    if (prdId) {
                        let cartBuyNowForm = document.getElementById(`${prdId}_cartBuyNowForm`);
                        let onlyPrdQty = document.getElementById(`${prdId}_onlyPrdQty`);

                        let prdQty = document.getElementsByClassName(`${prdId}_qty`)[0];
                        if (prdQty) {
                            onlyPrdQty.setAttribute('value', prdQty.innerHTML)
                        }

                        //================================================================

                        let cartRemovePrdForm = document.getElementById(`${prdId}_cartRemovePrdForm`)
                        const formData = new FormData(cartRemovePrdForm);
                        let dto = {};
                        for (const [key, value] of formData) {
                            dto[`${key}`] = value;
                        }
                        dto['haveToRedirect'] = 'false';
                        axios.post("/deleteCartPrd", dto)
                            .then(response => {
                                if (response) {
                                    cartBuyNowForm.submit();
                                }
                            })
                            .catch(err => {
                                cartUpdateNoty("Something went wrong", "error");
                            });
                    }
                })
            }
        }
    }
    cartBuyNowPerform();
    //================================================================
}