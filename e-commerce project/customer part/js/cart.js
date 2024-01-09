//-------------------firebase realtime database -----------------------

import { db } from '/./firebase.js';
import { ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const ProductsCartRef = ref(db, 'ProductsCart/');
const orderRef = ref(db, 'orderList/');
const dbref = ref(db);
const ProductsRef = ref(db, 'Products/');


//-----------authentication--------------------------

let usercreds = JSON.parse(sessionStorage.getItem("user-creds"));
let userinfo = JSON.parse(sessionStorage.getItem("user-info"));
let signoutbtn = document.querySelector(".logout");

let signout =()=>{
    sessionStorage.removeItem("user-creds");
    sessionStorage.removeItem("user-info");
    window.location.href= '/custome auth/customer_login.html'
}

let checkCred = () => {
    if (!sessionStorage.getItem("user-creds")) {
        window.location.href = '/custome auth/customer_login.html'
    } else {

    }
}

window.addEventListener('load', checkCred);

signoutbtn.onclick = signout;

//////////////////////////////////////////

//check box

let checkboxAll = document.getElementById('all');


checkboxAll.addEventListener('change', function () {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checkboxAll.checked;
    });
});

////////////////////////////////////////////
//


// Add this line at the beginning to get the loading icon element
const loadingIcon = document.getElementById('loading-icon');

// Initial load and real-time updates
loadingIcon.style.display = 'block';


//////////////////////////////////////////////////////


// page items 
const carttbody = document.querySelector(".cartbody");

const subtotalPrice = document.querySelector("#Subprice");
const taxprice = document.querySelector("#tax");
const allprice = document.querySelector("#allprice");


function updateUI(Products) {

    carttbody.innerHTML = "";
    let promises = [];
    let pricewait = 0;
    let priceAccept = 0;
    for (var product in Products) {
        let prod = Products[product];
        if (prod.customer == usercreds.uid) {

            let promise = get(child(dbref, 'Products/' + prod.prodid)).then(
                (snapshot) => {
                    if (snapshot.exists) {

                        const prodinfo = snapshot.val();

                        const row = document.createElement("tr");
                        row.dataset.id = prod.pcid;


                        const checktd = document.createElement("td");
                        const checkinp = document.createElement("input");
                        checkinp.type = "checkbox";
                        checkinp.className = "rowcheck";
                        checkinp.value = prod.pcid;
                        checktd.appendChild(checkinp);
                        row.appendChild(checktd);

                        const infotd = document.createElement("td");
                        const infodiv = document.createElement("div");
                        infodiv.className = "info";

                        const imfprd = document.createElement("img");
                        imfprd.src = prodinfo.mainimgurl;
                        infodiv.appendChild(imfprd);

                        const detialsdiv = document.createElement("div");
                        const namepar = document.createElement("p");
                        namepar.className = "pname";
                        namepar.innerText = prodinfo.prodname;
                        detialsdiv.appendChild(namepar);

                        const spantit = document.createElement("span");
                        spantit.className = "tit";
                        spantit.innerText = "Category.:";
                        detialsdiv.appendChild(spantit);
                        const catspan = document.createElement("span");
                        catspan.innerText = prodinfo.category;
                        detialsdiv.appendChild(catspan);
                        infodiv.appendChild(detialsdiv);

                        infotd.appendChild(infodiv);
                        row.appendChild(infotd);

                        let oneprice = Number(prodinfo.price);
                        let quant = Number(prod.quantity);
                        let availablenum = Number(prodinfo.quantity);
                        let Maxnum = availablenum+quant;

                        if (prod.status == "waiting") {
                            const quanttd = document.createElement("td");
                            const quantinp = document.createElement("input");

                            quantinp.type = "number";
                            quantinp.style.width="50px"
                            quantinp.min = 1;
                            quantinp.max = Maxnum;
                            quantinp.value = quant;
                            quanttd.appendChild(quantinp);
                            row.appendChild(quanttd);

                            const statustd = document.createElement("td");
                            const pstatus = document.createElement("p");
                            pstatus.className = "statusprwait";
                            pstatus.innerText = "Waiting";
                            statustd.appendChild(pstatus);
                            row.appendChild(statustd);

                            const pricetd = document.createElement("td");

                            let subtotal = oneprice * quant;
                            pricetd.innerText = "$" + subtotal.toFixed(2);
                            row.appendChild(pricetd);

                            carttbody.appendChild(row);
                            pricewait = pricewait + subtotal;
                        } else if (prod.status == "accepted") {

                            const quanttd = document.createElement("td");
                            const quantinp = document.createElement("input");
                            quantinp.type = "number";
                            quantinp.value = quant;
                            quantinp.readOnly = true;
                            quanttd.appendChild(quantinp);
                            row.appendChild(quanttd);

                            const Statustd = document.createElement("td");
                            // Statustd.dataset.label = "Status";
                            const acptprgh = document.createElement("p");
                            acptprgh.className = "statuspraccept";
                            acptprgh.innerText = "Accepted";
                            Statustd.appendChild(acptprgh);
                            row.appendChild(Statustd);

                            const pricetd = document.createElement("td");

                            let subtotal = oneprice * quant;

                            pricetd.innerText = "$" + subtotal.toFixed(2);
                            row.appendChild(pricetd);

                            carttbody.appendChild(row);
                            priceAccept = priceAccept + subtotal;
                        } else if (prod.status == "rejected") {

                            const quanttd = document.createElement("td");
                            const quantinp = document.createElement("input");
                            quantinp.type = "number";
                            quantinp.value = quant;
                            quantinp.readOnly = true;
                            quanttd.appendChild(quantinp);
                            row.appendChild(quanttd);

                            const Statustd = document.createElement("td");
                            // Statustd.dataset.label = "Status";
                            const rejprgh = document.createElement("p");
                            rejprgh.className = "statusprreject";
                            rejprgh.innerText = "Rejected";
                            Statustd.appendChild(rejprgh);
                            row.appendChild(Statustd);


                            const pricetd = document.createElement("td");

                            let subtotal = oneprice * quant;
                            pricetd.innerText = "$" + subtotal.toFixed(2);
                            row.appendChild(pricetd);

                            carttbody.appendChild(row);

                        }



                    }
                }
            );
            promises.push(promise);

        }




    }
    Promise.all(promises).then(() => {
        let wait = Number(pricewait);
        let act = Number(priceAccept);
        let all = wait + act;
        subtotalPrice.innerText = "$" + wait.toFixed(2);
        taxprice.innerText = "$" + all.toFixed(2);
        allprice.innerText = "$" + act.toFixed(2);
        myupdate();
        mydelete();
    });



}


onValue(ProductsCartRef, (snapshot) => {
    const data = snapshot.val() ? snapshot.val() : null;
    if (data) {
        console.log("you have items in cart")
        updateUI(data);
    } else {
        console.log("you dont have item yet");
        updateUI(data)

    }
    loadingIcon.style.display = 'none'
},);


function updateProductCartQuantity(pcid, newQuantity) {
    // Update the quantity in the database
    update(child(ProductsCartRef, pcid), { quantity: newQuantity })
        .then(() => {
            console.log("Product in Cart quantity updated successfully.");
            
            
        })
        .catch((error) => {
            console.error("Error updating product In Cart quantity:", error);
        });
}

function updateProductQuantity(id, newQuantity){
    update(child(ProductsRef,id), { quantity: newQuantity })
        .then(() => {
            console.log("Product quantity updated successfully.");
            
            
        })
        .catch((error) => {
            console.error("Error updating product quantity:", error);
        });

}





function mydelete() {
    
    let delbtn = document.querySelector(".btncartdel");
    delbtn.onclick = async function () {
        let checkboxes = document.querySelectorAll(".rowcheck");
        let promises = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                let itemId = checkbox.value;
                let promise = get(child(dbref, 'ProductsCart/' + itemId)).then(
                    (snapshot) => {
                        if (snapshot.exists) {
                            const prodcart = snapshot.val();
                            let productid = prodcart.prodid;
                            let cartQun = parseInt(prodcart.quantity);

                            return get(child(dbref, 'Products/' + productid)).then(
                                (snap) => {
                                    if (snap.exists) {
                                        const product = snap.val();
                                        let availablequn = parseInt(product.quantity);

                                        return { itemId, cartQun, availablequn,productid };
                                    }
                                }
                            );
                        }
                    }
                );
                promises.push(promise);
            }
        });

        Promise.all(promises).then(
            results => {
            results.forEach(({ itemId, cartQun, availablequn,productid }) => {
                let newnum = availablequn+cartQun;
                updateProductQuantity(productid, newnum);
                remove(child(ProductsCartRef, itemId)).then(
                    () => {
                        console.log("delete");
                    }
                );
                
                
            });
        });

    
    };
}



function myupdate() {
    let editBtn = document.querySelector(".btncartedit");

    editBtn.onclick = async function () {
        let checkboxes = document.querySelectorAll(".rowcheck");
        let promises = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                let itemId = checkbox.value;
                let row = checkbox.closest('tr');
                let quantInput = row.querySelector('input[type="number"]');
                let selectedQuantity = parseInt(quantInput.value);

                let promise = get(child(dbref, 'ProductsCart/' + itemId)).then(
                    (snapshot) => {
                        if (snapshot.exists) {
                            const prodcart = snapshot.val();
                            let productid = prodcart.prodid;
                            let oldqun = parseInt(prodcart.quantity);

                            return get(child(dbref, 'Products/' + productid)).then(
                                (snap) => {
                                    if (snap.exists) {
                                        const product = snap.val();
                                        let availablequn = parseInt(product.quantity);

                                        return { itemId, selectedQuantity, oldqun, availablequn,productid };
                                    }
                                }
                            );
                        }
                    }
                );
                promises.push(promise);
            }
        });

        Promise.all(promises).then(
            results => {
            results.forEach(({ itemId, selectedQuantity, oldqun, availablequn,productid }) => {
                updateProductCartQuantity(itemId, selectedQuantity);
                if (selectedQuantity > oldqun) {
                    let less = selectedQuantity - oldqun; 
                    let newnum = availablequn - less;
                    updateProductQuantity(productid, newnum)
                } else if (oldqun > selectedQuantity) {
                    let more = oldqun - selectedQuantity;
                    let newnum = availablequn + more;
                    updateProductQuantity(productid, newnum)
                }
                
            });
        });

    
    };
}


///check out btn 

const checkOutBtn = document.querySelector("#checkoutbtn");

checkOutBtn.onclick = function () {
    get(ProductsCartRef).then((snapshot) => {
        const cartData = snapshot.val();
        if (cartData) {
            for (const i in cartData) {
                const cartItem = cartData[i];
                if(cartItem.customer === usercreds.uid && cartItem.status === "accepted"){
                        get(child(dbref, 'Products/' + cartItem.prodid)).then(
                            (snap)=>{
                                let product = snap.val();
                                if(product){
                                    let oneprice = Number(product.price);
                                    let quant = Number(cartItem.quantity);
                                    let allprice = oneprice*quant;
                                    writeorderData(cartItem.customer, product.owner,cartItem.prodid,product.prodname,product.mainimgurl,allprice,product.category,quant,cartItem.orderdate);

                                }
                            }
                        ).catch(
                            (e)=>{console.log(e)}
                        )
                        remove(child(ProductsCartRef, cartItem.pcid)).then(
                            () => {
                                console.log("delete");
                            }
                        );
                        
    
                }else if (cartItem.customer === usercreds.uid && cartItem.status === "rejected"){
                    let rejqun = Number(cartItem.quantity);
                   
                    get(child(dbref, 'Products/' + cartItem.prodid)).then(
                        (snap) =>{
                            let product = snap.val();
                            if (product){
                                let availablequn = product.quantity;
                                let newnum = parseInt(availablequn)+parseInt(rejqun);
                                updateProductQuantity(cartItem.prodid, newnum);
                            }
                        }
                    ).catch(
                        (e)=>{console.log(e);}
                    );
                    remove(child(ProductsCartRef, cartItem.pcid)).then(
                        () => {
                            console.log("delete");
                        }
                    );
                    
                }else {
                    console.log('this is Still waiting')
                }
            }
                


        }else {
           
            console.log('Cart is empty');
           
        }
    }).catch((error) => {
        console.error(error);
    });

   

}


function writeorderData(_customer,_owner,prdid, _name,_mainimg,_price ,_category, _quantity,_date) {
    // Get the current date
    const formattedDate = new Date().toLocaleDateString('en-GB');

    // Generate a random number between 1 and 5
    const randomDays = Math.floor(Math.random() * 5) + 1;

    // Create a new date by adding randomDays to the current date
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + randomDays);

    // Format the new date as a string
    const formattedNewDate = newDate.toLocaleDateString('en-GB');

    // Use push to generate a unique user ID
    const neworderRef = push(orderRef);

    // Get the new user ID
    const orderId = neworderRef.key;


    set(child(orderRef, orderId), {
        id: orderId,
        customer: _customer,
        owner:_owner,
        prodid: prdid,
        prodname: _name,
        img:_mainimg,
        price:_price,
        prodCatego: _category,
        quantity: _quantity,
        orderdate:_date,
        MovingDate: formattedDate,
        DeliveryDate: formattedNewDate,
    }).then((onFullFilled) => {
        console.log("writed");
    }, (onRejected) => {
        console.log(Object);
    }

    );
}