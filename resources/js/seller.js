import axios from 'axios'
import Noty from 'noty'


let deleteItemBtn = document.querySelectorAll(".delete-item-btn");
let deleteStrBtn = document.querySelectorAll(".delete-strimg-btn");
var snackbar = document.getElementById("snackbar");
var snackbar_span = document.getElementById("snackbar-span");


export function handleStore() {
    deleteItemImg();
    deleteStrImg();

    function ImageNoty(message) {
        snackbar_span.innerHTML = message;
        snackbar.className = "show";
        setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    }

    function reload() {
        setTimeout(() => {
            location.reload();
        }, 1000)
        let message = 'Image Deleted!'
        ImageNoty(message);
    }

    function deleteConfirmStore(img, strID) {
        axios.post(`/deleteImgStore/${img}/${strID}`)
            .then(res => {}, reload())
            .catch(err => {
                new Noty({
                    type: 'error',
                    timeout: 1000,
                    text: 'Something went wrong',
                    progressBar: false,
                }).show();
            })
    }

    function deleteConfirmItem(img, strID) {
        axios.post(`/deleteImgItem/${img}/${strID}`)
            .then(res => {}, reload())
            .catch(err => {
                new Noty({
                    type: 'error',
                    timeout: 1000,
                    text: 'Something went wrong',
                    progressBar: false,
                }).show();
            })
    }

    async function deleteItemImg() {
        //This is for Delete item image
        if (deleteItemBtn) {

            for (let i = 0; i < deleteItemBtn.length; i++) {


                deleteItemBtn[i].addEventListener('click', (e) => {
                    // console.log(deleteItemBtn[i]);

                    let item = JSON.parse(deleteItemBtn[i].dataset.item)
                    if (item) {

                        for (let k = 0; k < item.image.length; k++) {

                            if (item.image[k]._id === deleteItemBtn[i].value) {

                                let confirm = window.confirm('Are you sure you want to delete this image?')
                                if (confirm) {
                                    console.log('ok');
                                    deleteConfirmItem(item.image[k].img, deleteItemBtn[i].id);
                                } else {
                                    console.log('no');
                                }
                            }
                        }
                    }
                })
            }
        }
    }

    async function deleteStrImg() {
        //This is for Delete item image
        if (deleteStrBtn) {

            for (let i = 0; i < deleteStrBtn.length; i++) {


                deleteStrBtn[i].addEventListener('click', (e) => {

                    let item = JSON.parse(deleteStrBtn[i].dataset.item)
                        // console.log(item);
                    if (item) {

                        for (let k = 0; k < item[0].image.length; k++) {

                            if (item[0].image[k]._id === deleteStrBtn[i].value) {

                                let confirm = window.confirm('Are you sure you want to delete this image?')
                                if (confirm) {
                                    // console.log('ok');
                                    deleteConfirmStore(item[0].image[k].img, deleteStrBtn[i].id);
                                } else {
                                    // console.log('no');
                                }
                            }
                        }
                    }
                })
            }
        }
    }
}