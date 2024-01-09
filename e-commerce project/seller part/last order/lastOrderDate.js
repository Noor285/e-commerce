import { db } from '/./firebase.js';
import { ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const orderRef = ref(db, 'orderList/');
const dbref = ref(db);


let Sellercreds = JSON.parse(sessionStorage.getItem("seller-creds"));
let Sellerinfo = JSON.parse(sessionStorage.getItem("Seller-info"));

let signoutbtn = document.querySelector(".logout");
let prodbtn = document.querySelector(".prod");
let categbtn = document.querySelector(".catego");
let orderbtn = document.querySelector(".order");

let signout = () => {
    sessionStorage.removeItem("seller-creds");
    sessionStorage.removeItem("Seller-info");
    window.location.replace( '../../seller auth/adminlogin.html');
}

let checkCred = () => {
    if (!sessionStorage.getItem("seller-creds")) {
        window.location.replace('../../seller auth/adminlogin.html');
    } else {


        sellername.innerText = Sellerinfo.username;
        prodbtn.onclick = () => {
            
            window.location.replace('../products/Prodcrud.html');
        }
        categbtn.onclick = () => {
            
            window.location.replace('../category/categCRUD.html');
        }
        orderbtn.onclick=()=>{
            window.location.replace('../order/orderseller.html');
        }


    }
}

window.addEventListener('load', checkCred);

signoutbtn.onclick = signout;




const tbody = document.querySelector("#tbdyprod");

// Add this line at the beginning to get the loading icon element
const loadingIcon = document.getElementById('loading-icon');

// Initial load and real-time updates
loadingIcon.style.display = 'block';
function updateUI(orders) {
    tbody.innerHTML = "";
    for (let ord in orders) {
        let order = orders[ord];
        // if (order.owner == Sellercreds.uid) {
        if(order.owner === Sellercreds.uid){
            get(child(dbref, 'customerAuthList/' + order.customer)).then(
                (snapshot) => {
                    if (snapshot.exists) {
                        let customer = snapshot.val();

                        const row = document.createElement("tr");
                        row.dataset.id = order.id;

                        let idtd = document.createElement("td");
                        idtd.dataset.label = "id";
                        idtd.innerText = order.id;
                        row.append(idtd);

                        const customerNameTd = document.createElement("td");
                        customerNameTd.dataset.label = "Customer";
                        customerNameTd.innerText = customer.username;
                        row.appendChild(customerNameTd);

                        const producrNameTd = document.createElement("td");
                        producrNameTd.dataset.label = "Name";
                        producrNameTd.innerText = order.prodname;
                        row.appendChild(producrNameTd);

                        const imgtd = document.createElement("td");
                        imgtd.dataset.label = "Img";
                        const img = document.createElement("img");
                        img.className = "imgdiv";
                        img.src = order.img;
                        imgtd.appendChild(img);
                        row.appendChild(imgtd);


                        const categotd = document.createElement("td");
                        categotd.dataset.label = "Category";
                        categotd.innerText = order.prodCatego;
                        row.appendChild(categotd);


                        const quanttd = document.createElement("td");
                        quanttd.dataset.label = "Qty";
                        quanttd.innerText = order.quantity;
                        row.appendChild(quanttd);

                        const pricetd = document.createElement("td");
                        pricetd.dataset.label = "Price";
                        pricetd.innerText = order.price + " $";
                        row.appendChild(pricetd);

                        let datestd = document.createElement("td");
                        datestd.dataset.label = "Dates";
                        let datesdiv = document.createElement("div");
                        let datediv1 = document.createElement("div");
                        datediv1.className = "datediv";
                        let span11 = document.createElement("span");
                        span11.className = "tit";
                        span11.innerText = "Order Date.:"
                        datediv1.appendChild(span11);
                        let span12 = document.createElement("span");
                        span12.innerText = order.orderdate;
                        datediv1.appendChild(span12);
                        datesdiv.appendChild(datediv1);

                        let datediv2 = document.createElement("div");
                        datediv2.className = "datediv";
                        let span21 = document.createElement("span");
                        span21.className = "tit";
                        span21.innerText = "Moving Date.:"
                        datediv2.appendChild(span21);
                        let span22 = document.createElement("span");
                        span22.innerText = order.MovingDate;
                        datediv2.appendChild(span22);
                        datesdiv.appendChild(datediv2);

                        let datediv3 = document.createElement("div");
                        datediv3.className = "datediv";
                        let span31 = document.createElement("span");
                        span31.className = "tit";
                        span31.innerText = "Deliverd Date.:"
                        datediv3.appendChild(span31);
                        let span32 = document.createElement("span");
                        span32.innerText = order.DeliveryDate;
                        datediv3.appendChild(span32);
                        datesdiv.appendChild(datediv3);
                        datestd.appendChild(datesdiv);
                        row.appendChild(datestd);


                        let btntd = document.createElement("td");
                        let delbtn = document.createElement("button");
                        delbtn.className = "btn btn-delete";
                        delbtn.innerText = "x";
                        btntd.appendChild(delbtn);
                        row.appendChild(btntd);

                        tbody.appendChild(row);





                    }
                }
            ).catch((e) => console.log(e))


        }

    }

    mydelete();
}





console.log("hi");




// reject();


onValue(orderRef, (snapshot) => {
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



function mydelete() {
    let delbtn = document.querySelectorAll(".deleteBtn");
    delbtn.forEach(del => {
        del.onclick = function () {
            let productId = del.parentElement.parentElement.dataset.id;
            remove(child(orderRef, productId)).then(
                () => {
                    console.log("delete");
                }
            )

        }
    });
}