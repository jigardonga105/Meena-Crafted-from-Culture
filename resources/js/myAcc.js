import axios from "axios";
import validator from "validator";
// import otpGenerator from "otp-generator";


export function myAcc() {

    let user = document.getElementById('user');
    if (user) {
        user = user.value;
        user = JSON.parse(user);
        var userID = user._id;
        var oldEmail = user.email;
        var oldPhoneNum = user.phone;

        // ========================================================================
        // ========================================================================
        //General Functions Start
        function putDataInField() {
            document.getElementById("fname").value = user.first_name;
            document.getElementById("lname").value = user.last_name;
            document.getElementById("email").value = user.email;
            document.getElementById("phone").value = user.phone;


            if (user.gender) {
                if (user.gender == 'Male') {
                    document.getElementById("inlineRadio1").checked = true;
                } else if (user.gender == 'Female') {
                    document.getElementById("inlineRadio2").checked = true;
                }
            }
        }
        putDataInField();

        function showErrField(str, inputField) {
            let p = document.createElement("p");
            p.setAttribute('class', 'show-err');
            p.innerHTML = str;
            inputField.parentElement.insertBefore(p, inputField.previousSibling);

            setTimeout(() => {
                document.querySelector('.show-err').remove();
            }, 3000);
        }

        function showMSG(span, color) {
            let p = document.createElement("p");
            p.setAttribute('class', 'showMSG-p');
            if (color == 'red') {
                p.innerHTML = 'Something went wrong!'
            } else {
                p.innerHTML = 'Updated ✔';
            }

            span.parentNode.insertBefore(p, span.nextSibling);
            document.querySelector('.showMSG-p').style.display = 'inline-block';
            document.querySelector('.showMSG-p').style.color = color;

            setTimeout(() => {
                document.querySelector('.showMSG-p').remove();
            }, 3000);
        }

        function showErrMSG(data) {
            if (data == 'We are facing some essuse. Please try again later 🙏') {
                showErrField('We are facing some essuse. Please try again later 🙏');
                errCome();
            } else {
                user = data;
            }
        }

        function errCome() {
            document.getElementById("phone").style.display = "inline-block";
            document.getElementById("phone-otp-btn").style.display = "inline-block";
            document.getElementById("phoneOtp").style.display = "none";
            document.getElementById("phone-save-btn").style.display = "none";
        }

        function errFree() {
            document.getElementById("phone").style.display = "inline-block";
            document.getElementById("phone-otp-btn").style.display = "none";
            document.getElementById("phoneOtp").style.display = "inline-block";
            document.getElementById("phone-save-btn").style.display = "inline-block";
        }

        function sendEmail(email, subject, body) {
            Email.send({
                Host: "smtp.gmail.com",
                Username: "zayshop2021@gmail.com",
                Password: "Zayshop@2021-22",
                To: email,
                From: "zayshop2021@gmail.com",
                Subject: subject,
                Body: body,
            })
        }

        let allAddDiv = document.getElementById('allAddDiv');

        function addAllAddress() {

            user.address.forEach((address, index) => {
                let key = Object.keys(user.address)[index];

                let addStr = `<div class="border p-4 mt-4">
                                <div id="edit-del-add-div" class="float-right">
                                    <div id="addEdit-${key}" class="addEdit bg-green-100 rounded-full p-1 inline-block hover:bg-green-300 cursor-pointer" style="font-size: 14px !important;">
                                        Edit</div>
                                    <div id="addDel-${key}" class="addDel bg-green-100 rounded-full p-1 inline-block hover:bg-green-300 cursor-pointer" style="font-size: 14px !important;">
                                        Delete</div>
                                </div>
                                <span class="bg-gray-200 text-sm p-1 rounded text-gray-600">${address['add-type']}</span>
                                <div class="mt-1">
                                    <span class="text-base font-bold mr-2">${address['add-name']}</span>
                                    <span class="text-base font-bold ml-2">${address['add-phone']}</span>
                                </div>
                                <div class="mt-1">
                                    <div class="w-3/4">
                                        <span class="text-base">${address['add-area&street']}</span>,
                                        <span class="text-base">${address['add-locality']}</span>
                                        <br>
                                        <span class="text-base">${address['add-city']} District</span>,
                                        <span class="text-base">${address['add-state']}</span>, -
                                        <span class="font-bold">${address['add-pin']}</span>
                                    </div>
                                </div>
                            </div>`;

                allAddDiv.innerHTML += addStr;
            })
        }
        //General Functions End
        // ========================================================================
        // ========================================================================
        document.getElementById("per-info-save-btn").style.display = "none";
        let perInfoASpan = document.querySelector('#per-info-a-span');

        perInfoASpan.addEventListener('click', () => {
            if (perInfoASpan.innerHTML == 'Edit') {
                perInfoASpan.innerHTML = 'Cancel';

                document.getElementById("fname").classList.remove('cursor-not-allowed');
                document.getElementById("fname").classList.remove('text-color-gray');
                document.getElementById("fname").removeAttribute('disabled', '');

                document.getElementById("lname").classList.remove('cursor-not-allowed');
                document.getElementById("lname").classList.remove('text-color-gray');
                document.getElementById("lname").removeAttribute('disabled', '');

                document.getElementById("inlineRadio1").classList.remove('cursor-not-allowed');
                document.getElementById("inlineRadio1").removeAttribute('disabled', '');
                document.getElementById("inlineRadio2").classList.remove('cursor-not-allowed');
                document.getElementById("inlineRadio2").removeAttribute('disabled', '');

                document.getElementById("per-info-save-btn").style.display = "inline-block";
            } else {
                perInfoASpan.innerHTML = 'Edit';

                document.getElementById("fname").classList.add('cursor-not-allowed');
                document.getElementById("fname").classList.add('text-color-gray');
                document.getElementById("fname").setAttribute('disabled', '');

                document.getElementById("lname").classList.add('cursor-not-allowed');
                document.getElementById("lname").classList.add('text-color-gray');
                document.getElementById("lname").setAttribute('disabled', '');

                document.getElementById("inlineRadio1").classList.add('cursor-not-allowed');
                document.getElementById("inlineRadio1").setAttribute('disabled', '');
                document.getElementById("inlineRadio2").classList.add('cursor-not-allowed');
                document.getElementById("inlineRadio2").setAttribute('disabled', '');

                document.getElementById("per-info-save-btn").style.display = "none";
            }
        })

        let emailInp = document.getElementById("email");
        let emailVarBtn = document.getElementById('email-var-btn');
        let emailVarDiv = document.getElementById('email-var-div');
        emailVarBtn.style.display = 'none';
        emailVarDiv.style.display = 'none';

        let emailSpan = document.querySelector('#email-span');
        emailSpan.addEventListener('click', () => {
            if (emailSpan.innerHTML == 'Edit') {
                emailSpan.innerHTML = 'Cancel';

                emailInp.classList.remove('cursor-not-allowed');
                emailInp.classList.remove('text-color-gray');
                emailInp.removeAttribute('disabled', '');

                emailVarBtn.style.display = 'inline-block';
            } else {
                emailSpan.innerHTML = 'Edit';

                emailInp.classList.add('cursor-not-allowed');
                emailInp.classList.add('text-color-gray');
                emailInp.setAttribute('disabled', '');

                emailVarBtn.style.display = 'none';
                emailVarDiv.style.display = 'none';
            }
        })

        function OTPInput() {
            const inputs = document.querySelectorAll('#otp > *[id]');
            if (inputs) {
                for (let i = 0; i < inputs.length; i++) {
                    // console.log(inputs[i]);
                    inputs[i].addEventListener('keydown', function(event) {
                        if (event.key === "Backspace") {
                            inputs[i].value = '';
                            if (i !== 0)
                                inputs[i - 1].focus();
                        } else {
                            if (i === inputs.length - 1 && inputs[i].value !== '') {
                                return true;
                            } else if (event.keyCode > 47 && event.keyCode < 58) {
                                inputs[i].value = event.key;
                                if (i !== inputs.length - 1)
                                    inputs[i + 1].focus();
                                event.preventDefault();
                            } else if (event.keyCode > 64 && event.keyCode < 91) {
                                inputs[i].value = String.fromCharCode(event.keyCode);
                                if (i !== inputs.length - 1)
                                    inputs[i + 1].focus();
                                event.preventDefault();
                            }
                        }
                    });
                }
            }
        }
        OTPInput();

        document.getElementById("phone-save-btn").style.display = "none";
        document.getElementById("phoneOtp").style.display = "none";
        document.getElementById("phone-otp-btn").style.display = "none";

        let phoneSpan = document.querySelector('#phone-span');

        phoneSpan.addEventListener('click', () => {
            if (phoneSpan.innerHTML == 'Edit') {
                phoneSpan.innerHTML = 'Cancel';

                document.getElementById("phone").classList.remove('cursor-not-allowed');
                document.getElementById("phone").classList.remove('text-color-gray');
                document.getElementById("phone").removeAttribute('disabled', '');

                document.getElementById("phone-otp-btn").style.display = "inline-block";
            } else {
                phoneSpan.innerHTML = 'Edit';

                document.getElementById("phone").classList.add('cursor-not-allowed');
                document.getElementById("phone").classList.add('text-color-gray');

                document.getElementById("phone").setAttribute('disabled', '');

                document.getElementById("phone-otp-btn").style.display = "none";

                document.getElementById("phoneOtp").style.display = "none";
                document.getElementById("phone-save-btn").style.display = "none";

            }
        })

        //==========================================================================
        //Profile Pic.
        //==========================================================================
        let img_userID = document.getElementById('img-userID');
        img_userID.value = user._id;

        let changeIMG = document.getElementById('changeIMG');
        if (user.image.length > 0) {
            changeIMG.setAttribute('src', `/uploadedImages/${user.image[0].img}`);            
        }else{
            if (user.gender == 'Male') {
                changeIMG.setAttribute('src', `/img/male.jpg`);            
            }else
            {
                changeIMG.setAttribute('src', `/img/female.jpg`);            
            }
        }
        changeIMG.setAttribute('alt', `${user.first_name} image`);

        let newImg = document.getElementById('newImg');
        newImg.addEventListener('change', (event) => {
            changeIMG.setAttribute('src', `${URL.createObjectURL(event.target.files[0])}`);
        });

        //==========================================================================
        //Name and Gender
        //==========================================================================
        let genderInp = document.getElementsByName('gender');
        let gender;
        for (let i = 0; i < genderInp.length; i++) {
            genderInp[i].addEventListener('click', () => {
                gender = genderInp[i].value;
            })
        }

        document.getElementById('per-info-save-btn').addEventListener('click', () => {
            let fnameInp = document.getElementById('fname');
            let lnameInp = document.getElementById('lname');

            let fname = fnameInp.value;
            let lname = lnameInp.value;
            if (gender == undefined) {
                gender = 'Male';
            }

            axios.post('/changeMyAcc', { userID, fname, lname, gender })
                .then((response) => {
                    showErrMSG(response.data)

                    document.querySelector('#per-info-a-span').click();
                    putDataInField();
                    showMSG(document.getElementById('per-info-a-span'), '#4ab74a');
                })
                .catch((err) => {
                    console.log(err);
                    showMSG(document.getElementById('per-info-a-span'), 'red');
                })
        })

        //==================================================================================
        //Email
        //==================================================================================

        emailVarBtn.addEventListener('click', () => {
            if (emailInp.value == '') {
                showErrField('Email field should not be Blank!', emailInp);

            } else if (emailInp.value == oldEmail) {
                showErrField('Please change your Email!', emailInp);
            } else {
                let email = emailInp.value

                const isEmail = validator.isEmail(email)
                if (!isEmail) {
                    showErrField('Please enter valid Email!', emailInp);
                } else {

                    let otp = Math.floor(100000 + Math.random() * 900000);
                    let subject = 'Verify Your Email Address';
                    let body = `<div>
                                <span>
                                    <h1>Your varification code is: ${otp}</h1>
                                    <br>
                                    <h3>for update email address in Meena Shop.</h3>
                                </span>
                            </div>`;

                    sendEmail(email, subject, body);
                    emailVarDiv.style.display = 'block';

                    document.getElementById("email-pass-save-btn").addEventListener("click", () => {
                        let varCodeInp = document.getElementById('varCode');
                        if (varCodeInp.value == otp) {
                            axios.post('/changeMyAcc', { userID, email })
                                .then((response) => {
                                    showErrMSG(response.data)

                                    document.querySelector('#email-span').click();
                                    putDataInField();
                                    showMSG(document.getElementById('email-span'), '#4ab74a');

                                    let subject = 'Successfully changed your email address';
                                    let body = `<div>
                                                <img src="/img/apple-icon.png" style="margin: auto;">
                                                <span>
                                                    <h1>You have successfully changed your email address</h1>
                                                    <br>
                                                    <h2>Your new email address is: ${user.email}</h2>
                                                    <br>
                                                    <h3>Thank you for using Meena Shop.</h3>
                                                </span>
                                            </div>`;

                                    sendEmail(user.email, subject, body);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                    });
                }
            }
        })

        //==================================================================================
        //Phone Number
        //==================================================================================

        var otp;
        document.getElementById("phone-otp-btn").addEventListener("click", () => {
            document.getElementById("phone").style.display = "inline-block";
            document.getElementById("phoneOtp").style.display = "inline-block";
            document.getElementById("phone-otp-btn").style.display = "none";
            document.getElementById("phone-save-btn").style.display = "inline-block";

            let phoneInp = document.getElementById("phone");
            let phoneErr = document.getElementById("phone-err");
            phoneErr.style.display = "none";



            if (phoneInp.value == '') {
                showErrField('Contact Number field should not be Blank!', phoneInp);
                errCome();

            } else if (phoneInp.value.length != 10) {
                showErrField('Contact Number length should be 10!', phoneInp);
                errCome();

            } else if (phoneInp.value == oldPhoneNum) {
                showErrField('Please change your Contact Number!', phoneInp);
                errCome();

            } else {
                errFree();
                let phoneNumber = phoneInp.value;
                axios.post(`/otp`, { phoneNumber })
                    .then((response) => {
                        // console.log(response.data);
                        if (response.data == 'We are facing some essuse. Please try again later 🙏') {
                            showErrField('We are facing some essuse. Please try again later 🙏', phoneInp);
                            errCome();
                        } else {
                            otp = response.data;
                        }
                    }, (error) => {
                        console.log(error);
                        showErrField(error, phoneInp);
                    });
            }
        })

        document.getElementById("phone-save-btn").addEventListener("click", () => {

            const inputs = document.querySelectorAll('#otp > *[id]');
            let otpArr = [];
            for (let i = 0; i < inputs.length; i++) {
                otpArr.push(inputs[i].value);
            }
            let userEnterOTP = otpArr.join('');
            // console.log(userEnterOTP);

            if (otp == userEnterOTP) {
                // console.log('matched');
                let phoneInp = document.getElementById("phone");

                let phoneNumber = phoneInp.value;
                axios.post(`/changeMyAcc`, { phoneNumber, userID })
                    .then((response) => {

                        showErrMSG(response.data)

                        document.querySelector('#phone-span').click();
                        putDataInField();
                        showMSG(document.getElementById('phone-span'), '#4ab74a');

                        let subject = 'Successfully changed your Contact Number';
                        let body = `<div>
                                    <img src="/img/apple-icon.png" style="margin: auto;">
                                    <span>
                                        <h1>You have successfully changed your Contact Number</h1>
                                        <br>
                                        <h2>Your new Contact Number is: ${user.phone}</h2>
                                        <br>
                                        <h3>Thank you for using Meena Shop.</h3>
                                    </span>
                                </div>`;

                        sendEmail(user.email, subject, body);

                    }, (error) => {
                        console.log(error);
                        showMSG(document.getElementById('phone-span'), 'red');
                    });
            } else {
                showErrField('Please Enter valid OTP!');
            }
        })

        //==================================================================================
        //Address
        //==================================================================================
        //fill options in State select tag
        let stateArray = ["Andhra Pradesh",
            "Arunachal Pradesh",
            "Assam",
            "Bihar",
            "Chhattisgarh",
            "Goa",
            "Gujarat",
            "Haryana",
            "Himachal Pradesh",
            "Jammu and Kashmir",
            "Jharkhand",
            "Karnataka",
            "Kerala",
            "Madhya Pradesh",
            "Maharashtra",
            "Manipur",
            "Meghalaya",
            "Mizoram",
            "Nagaland",
            "Odisha",
            "Punjab",
            "Rajasthan",
            "Sikkim",
            "Tamil Nadu",
            "Telangana",
            "Tripura",
            "Uttarakhand",
            "Uttar Pradesh",
            "West Bengal",
            "Andaman and Nicobar Islands",
            "Chandigarh",
            "Dadra and Nagar Haveli",
            "Daman and Diu",
            "Delhi",
            "Lakshadweep",
            "Puducherry"
        ];

        stateArray.map((state) => {
            let option = document.createElement("option");
            option.text = state;
            option.value = state;
            document.getElementById('add-state').options.add(option);
        })

        //Set value of address type (Home/Work)
        let addTypes = document.getElementsByName(`add-type`);
        var addType;
        for (let i = 0; i < addTypes.length; i++) {
            addTypes[i].addEventListener('click', () => {
                addType = addTypes[i].value;
                // console.log(addType);
            })
        }

        function newAddFieldMsg(str) {
            document.getElementById('requiredMSGSpan').innerHTML = str;
            setTimeout(() => {
                document.getElementById('requiredMSGSpan').innerHTML = '';
            }, 3000);

            document.getElementById('addNewAddressBtnDiv').style.display = 'none';
            document.getElementById('addNewAddressBox').style.display = 'block';
        }

        //when add new address save button click send data with POST method
        let addFieldArr = ['add-name', 'add-phone', 'add-pin', 'add-locality', 'add-area&street', 'add-city', 'add-state', 'add-landmark', 'add-altphone', 'add-type'];

        document.getElementById('add-save-btn').addEventListener('click', () => {
            var sendAddData = false;

            //check if fields value is not empty
            for (let addField of addFieldArr) {
                // console.log(addField);
                if (addField != 'add-type') {
                    if (addField != 'add-landmark' && addField != 'add-altphone') {
                        window[`${addField}`] = document.getElementById(addField);

                        if (window[`${addField}`].value == '') {
                            sendAddData = false;
                            newAddFieldMsg('<sup>*</sup>Some fields are required');
                            break;

                        } else if (addField == 'add-state' && window[`${addField}`].value == 'null') {
                            sendAddData = false;
                            newAddFieldMsg('<sup>*</sup>Please select a State');
                            break;

                        } else if (addField == 'add-phone' && window[`${addField}`].value.length != 10) {
                            sendAddData = false;
                            newAddFieldMsg('<sup>*</sup>Please enter valid Phone number');
                            break;

                        } else if (addField == 'add-phone') {
                            window[`${addField}`].value = parseInt(window[`${addField}`].value);

                            if (window[`${addField}`].value.length != 10) {
                                sendAddData = false;
                                newAddFieldMsg('<sup>*</sup>Please enter valid Phone number');
                                break;
                            }

                        } else {
                            document.getElementById('requiredMSGSpan').innerHTML = '';
                            sendAddData = true;
                        }
                    }
                }
            }

            // console.log(sendAddData);
            //If sendAddData is true, send the data to the server
            if (sendAddData) {
                let address = {};

                //find all fields value using array and fill into address = {}
                addFieldArr.map((addField) => {
                    if (addField != 'add-type') {
                        window[`${addField}`] = document.getElementById(addField);
                        address[addField] = window[`${addField}`].value;
                    } else {
                        if (addType == undefined) {
                            addType = 'Home';
                        }
                        address[addField] = addType;
                    }
                })
                axios.post('/changeMyAcc', { userID, address })
                    .then((response) => {
                        // console.log(response.data);
                        showErrMSG(response.data);

                        document.getElementById('addNewAddressBtnDiv').style.display = 'block';
                        document.getElementById('addNewAddressBox').style.display = 'none';

                        allAddDiv.innerHTML = '';
                        addAllAddress();
                        editAddress();
                        deleteAddress();
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        });
        //=================================================
        //Add New Address box show-hide
        let addNewAddressBtn = document.getElementById('addNewAddressBtn');
        let addNewAddressBox = document.getElementById('addNewAddressBox');
        addNewAddressBox.style.display = 'none';

        addNewAddressBtn.addEventListener('click', () => {
            document.getElementById('editAddDiv').innerHTML = '';
            document.getElementById('addNewAddressBtnDiv').style.display = 'none';
            addNewAddressBox.style.display = 'block';

            if (document.getElementById('allAddDiv').style.display == 'none') {
                document.getElementById('allAddDiv').style.display = 'block';
            }
        })

        let add_cancel_btn = document.getElementById('add-cancel-btn');
        add_cancel_btn.addEventListener('click', () => {
            document.getElementById('addNewAddressBtnDiv').style.display = 'block';
            addNewAddressBox.style.display = 'none';
        })

        //===================================================
        //show all addresses
        addAllAddress();

        //===================================================
        //fill edit address box
        function editAddress() {
            var editAddType;
            let addEdit = document.getElementsByClassName('addEdit');
            let editAddDiv = document.getElementById('editAddDiv');

            for (let i = 0; i < addEdit.length; i++) {
                addEdit[i].addEventListener('click', () => {
                    allAddDiv.style.display = 'none';

                    let editIdKey = addEdit[i].id.replace('addEdit-', '');

                    user.address.forEach((address, index) => {
                        var editKey = Object.keys(user.address)[index];
                        if (editIdKey == editKey) {
                            document.getElementById('addNewAddressBtnDiv').style.display = 'block';
                            document.getElementById('addNewAddressBox').style.display = 'none';
                            // console.log(editKey);

                            let editAddStr = `<div id="editAddressBox" class="border p-2 mt-4 bg-green-100">
                                            <span class="text-sm font-bold">EDIT ADDRESS</span>
                                            <span id="editClear" class="text-sm float-right cursor-pointer right-4" style="margin-right: 25rem;">Clear</span>
                                            <span id="edit-requiredMSGSpan" class="text-sm ml-4 text-red-500"></span>
                                            <div class="mt-3">
                                                <input type="text" name="edit-add-name" id="edit-add-name" class="border w-72 h-10 focus:outline-none rounded p-1" placeholder="Name" value="${address['add-name']}">
                                                <input type="tel" name="edit-add-phone" id="edit-add-phone" class="border w-72 h-10 focus:outline-none rounded p-1" placeholder="10 digit Mobile Number" maxlength="10" value="${address['add-phone']}">
                                            </div>
                                            <div class="mt-3">
                                                <input type="tel" name="edit-add-pin" id="edit-add-pin" class="border w-72 h-10 focus:outline-none rounded p-1" placeholder="Pincode" maxlength="6" value="${address['add-pin']}">
                                                <input type="text" name="edit-add-locality" id="edit-add-locality" class="border w-72 h-10 focus:outline-none rounded p-1" placeholder="Locality" value="${address['add-locality']}">
                                            </div>
                                            <div class="mt-3">
                                                <textarea name="edit-add-area&street" id="edit-add-area&street" class="edit-add-area-street border focus:outline-none rounded p-1" cols="63" rows="3" placeholder="Address (Area and Street)">${address['add-area&street']}</textarea>
                                            </div>
                                            <div class="mt-2">
                                                <input type="text" name="edit-add-city" id="edit-add-city" class="border w-72 h-10 focus:outline-none rounded p-1" placeholder="City/District/Town" value="${address['add-city']}">
                                                <select name="edit-add-state" id="edit-add-state" class="border w-72 h-10 focus:outline-none rounded p-1">
                                                    <option value="null">-Select State-</option>
                                                </select>
                                            </div>
                                            <div class="mt-3">
                                                <input type="text" name="edit-add-landmark" id="edit-add-landmark" class="border w-72 h-10 focus:outline-none rounded p-1" placeholder="Landmark (optional)" value="${address['add-landmark']}">
                                                <input type="tel" name="edit-add-altphone" id="edit-add-altphone" class="border w-72 h-10 focus:outline-none rounded p-1" placeholder="Alternate Phone (optional)" maxlength="10" value="${address['add-altphone']}">
                                            </div>
                                            <div class="mt-3">
                                                <span class="text-sm">Address type</span>
                                                <br>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="edit-add-type" id="edit-add-type" value="Home">
                                                    <label class="form-check-label" for="home">Home</label>
                                                </div>
                                                <div class="form-check form-check-inline ml-4">
                                                    <input class="form-check-input" type="radio" name="edit-add-type" id="edit-add-type" value="Work">
                                                    <label class="form-check-label" for="work">Work</label>
                                                </div>
                                            </div>
                                            <div class="mt-3">
                                                <button id="edit-add-save-btn" class="bg-green-400 w-56 h-12 rounded ml-5 focus:outline-none">
                                                    Save
                                                </button>
                                                <button id="edit-add-cancel-btn" class=" ml-5 focus:outline-none">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>`;
                            editAddDiv.innerHTML = editAddStr

                            stateArray.map((state) => {
                                let option = document.createElement("option");
                                option.text = state;
                                option.value = state;
                                document.getElementById('edit-add-state').options.add(option);
                            })

                            let addTypes = document.querySelectorAll('#edit-add-type');

                            let addType;
                            // address['add-type']
                            for (let i = 0; i < addTypes.length; i++) {
                                if (addTypes[i].value == address['add-type']) {
                                    addTypes[i].setAttribute('checked', '');
                                }
                            }
                            //============================================================================
                            //Set value of address type (Home/Work) for edit Address Box
                            let editAddTypes = document.getElementsByName(`edit-add-type`);
                            if (editAddTypes) {
                                for (let i = 0; i < editAddTypes.length; i++) {
                                    editAddTypes[i].addEventListener('click', () => {
                                        editAddType = editAddTypes[i].value;
                                        // console.log(editAddType);
                                    })
                                }
                            }
                            //============================================================================
                            let edit_add_cancel_btn = document.getElementById('edit-add-cancel-btn');
                            if (edit_add_cancel_btn) {
                                edit_add_cancel_btn.addEventListener('click', () => {
                                    editAddDiv.innerHTML = '';
                                    allAddDiv.style.display = 'block';
                                })
                            }
                        }
                    });

                    // ===================================================
                    function editAddFieldMsg(str) {
                        document.getElementById('edit-requiredMSGSpan').innerHTML = str;
                        setTimeout(() => {
                            document.getElementById('edit-requiredMSGSpan').innerHTML = '';
                        }, 3000);

                        // document.getElementById('addNewAddressBtnDiv').style.display = 'none';
                        // document.getElementById('addNewAddressBox').style.display = 'block';
                    }

                    //send edit address data to the server
                    let editAddFieldArr = ['edit-add-name', 'edit-add-phone', 'edit-add-pin', 'edit-add-locality', 'edit-add-area&street', 'edit-add-city', 'edit-add-state', 'edit-add-landmark', 'edit-add-altphone', 'edit-add-type'];
                    let editAddSaveBtn = document.getElementById('edit-add-save-btn');
                    if (editAddSaveBtn) {
                        editAddSaveBtn.addEventListener('click', () => {

                            var sendEditAddData = false;

                            //check if fields value is not empty
                            for (let addField of editAddFieldArr) {
                                if (addField != 'edit-add-type') {
                                    if (addField != 'edit-add-landmark' && addField != 'edit-add-altphone') {
                                        window[`${addField}`] = document.getElementById(addField);

                                        if (window[`${addField}`].value == '') {
                                            sendEditAddData = false;
                                            editAddFieldMsg('<sup>*</sup>Some fields are required');
                                            break;

                                        } else if (addField == 'edit-add-state' && window[`${addField}`].value == 'null') {
                                            sendEditAddData = false;
                                            editAddFieldMsg('<sup>*</sup>Please select a State');
                                            break;

                                        } else if (addField == 'edit-add-phone' && window[`${addField}`].value.length != 10) {
                                            sendEditAddData = false;
                                            editAddFieldMsg('<sup>*</sup>Please enter valid Phone number');
                                            break;

                                        } else if (addField == 'edit-add-phone') {
                                            window[`${addField}`].value = parseInt(window[`${addField}`].value);

                                            if (window[`${addField}`].value.length != 10) {
                                                sendEditAddData = false;
                                                editAddFieldMsg('<sup>*</sup>Please enter valid Phone number');
                                                break;
                                            }

                                        } else {
                                            document.getElementById('edit-requiredMSGSpan').innerHTML = '';
                                            sendEditAddData = true;
                                        }
                                    }
                                }
                            }

                            // console.log(sendEditAddData);
                            if (sendEditAddData) {
                                let address = {};

                                //find all fields value using array and fill into address = {}
                                editAddFieldArr.map((addField) => {
                                        let dbFiled = addField.replace('edit-', '');

                                        if (addField != 'edit-add-type') {
                                            window[`${addField}`] = document.getElementById(addField);
                                            address[dbFiled] = window[`${addField}`].value;
                                        } else {
                                            // console.log(editAddType);
                                            if (editAddType == undefined) {
                                                editAddType = 'Home';
                                            }
                                            address[dbFiled] = editAddType;
                                        }
                                    })
                                    // console.log(address);

                                let editAddressData = address;
                                let editKey = i;
                                axios.post('/changeMyAcc', { userID, editAddressData, editKey })
                                    .then((response) => {
                                        // console.log(response.data);
                                        showErrMSG(response.data);

                                        editAddDiv.innerHTML = '';
                                        allAddDiv.style.display = 'block';

                                        allAddDiv.innerHTML = '';
                                        addAllAddress();

                                        editAddress();
                                        deleteAddress();
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                            }
                        })
                    }

                    //user click on clear button clear all fields of edit Address box
                    let editClear = document.getElementById('editClear');
                    editClear.addEventListener('click', () => {
                        for (let addField of editAddFieldArr) {
                            if (addField != 'edit-add-state' && addField != 'edit-add-type') {
                                window[`${addField}`] = document.getElementById(addField);
                                window[`${addField}`].value = '';
                                window[`${addField}`].innerHTML = '';
                            }
                        }
                    })
                })
            }
        }
        editAddress();

        //===================================================
        //Delete address POST
        function deleteAddress() {
            let addDel = document.getElementsByClassName('addDel');

            for (let i = 0; i < addDel.length; i++) {
                addDel[i].addEventListener('click', () => {

                    let delIdKey = addDel[i].id.replace('addDel-', '');

                    user.address.forEach((address, index) => {
                        var delKey = Object.keys(user.address)[index];
                        if (delIdKey == delKey) {
                            let askDel = confirm('Are you sure you want to delete this address');
                            if (askDel) {
                                let delAddress = address;
                                axios.post('/changeMyAcc', { userID, delAddress })
                                    .then((response) => {
                                        // console.log(response.data);
                                        showErrMSG(response.data);

                                        allAddDiv.innerHTML = '';
                                        addAllAddress();
                                        editAddress();
                                        deleteAddress();
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                            }
                        }
                    });
                })
            }
        }
        deleteAddress();

        //==================================================================================

    }
}