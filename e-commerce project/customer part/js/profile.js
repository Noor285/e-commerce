
import { db } from '/./firebase.js';
import { ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


const orderRef = ref(db, 'orderList/');
const dbref = ref(db);


//-----------authentication--------------------------

let usercreds = JSON.parse(sessionStorage.getItem("user-creds"));
let userinfo = JSON.parse(sessionStorage.getItem("user-info"));
let signoutbtn = document.querySelector(".logout");
let signout2btn = document.querySelector(".sdlogout");
const sellername = document.querySelector("#sellername");

let signout =()=>{
    sessionStorage.removeItem("user-creds");
    sessionStorage.removeItem("user-info");
    window.location.href= '/custome auth/customer_login.html'
}

let checkCred = () => {
    if (!sessionStorage.getItem("user-creds")) {
        window.location.href = '/custome auth/customer_login.html'
    } else {
        sellername.innerText = userinfo.username;
    }
}

window.addEventListener('load', checkCred);
signoutbtn.onclick = signout;
signout2btn.onclick = signout;

const tbody = document.querySelector("#tbdyprod");


// Add this line at the beginning to get the loading icon element
const loadingIcon = document.getElementById('loading-icon');

// Initial load and real-time updates
loadingIcon.style.display = 'block';



function updateUI (orders){

    tbody.innerHTML="";

    for (let ord in orders){
        let order = orders[ord];
        if (order.customer === usercreds.uid){

            let row = document.createElement("tr");
            row .dataset.id = order.id;
            let idtd = document.createElement("td");
            idtd.innerText=order.id;
            row.append(idtd);
    
            let nametd = document.createElement("td");
            nametd.innerText=order.prodname;
            row.appendChild(nametd);
    
            let imgtd = document.createElement("td");
            let imgself = document.createElement("img");
            imgself.className = "imgColumn";
            imgself.src=order.img;
            imgself.alt="Product img";
            imgtd.appendChild(imgself);
            row.appendChild(imgtd);
    
            let catetd = document.createElement("td");
            catetd.innerText=order.prodCatego;
            row.appendChild(catetd);
    
            let qtytd = document.createElement("td");
            qtytd.innerText=order.quantity,
            row.appendChild(qtytd);
    
            let pricetd = document.createElement("td");
            pricetd.innerText=order.price+" $";
            row.appendChild(pricetd);
    
            let datestd = document.createElement("td");
            let datesdiv = document.createElement("div");
            let datediv1 = document.createElement("div");
            datediv1.className="datediv";
            let span11 = document.createElement("span");
            span11.className="tit";
            span11.innerText = "Order Date.:"
            datediv1.appendChild(span11);
            let span12 = document.createElement("span");
            span12.innerText=order.orderdate;
            datediv1.appendChild(span12);
            datesdiv.appendChild(datediv1);

            let datediv2 = document.createElement("div");
            datediv2.className="datediv";
            let span21 = document.createElement("span");
            span21.className="tit";
            span21.innerText = "Moving Date.:"
            datediv2.appendChild(span21);
            let span22 = document.createElement("span");
            span22.innerText=order.MovingDate;
            datediv2.appendChild(span22);
            datesdiv.appendChild(datediv2);

            let datediv3 = document.createElement("div");
            datediv3.className="datediv";
            let span31 = document.createElement("span");
            span31.className="tit";
            span31.innerText = "Deliverd Date.:"
            datediv3.appendChild(span31);
            let span32 = document.createElement("span");
            span32.innerText=order.DeliveryDate;
            datediv3.appendChild(span32);
            datesdiv.appendChild(datediv3);
            datestd.appendChild(datesdiv);
            row.appendChild(datestd);
    
            let btntd = document.createElement("td");
            let delbtn = document.createElement("button");
            delbtn.className="deleteBtn";
            delbtn.innerText="x";
            btntd.appendChild(delbtn);
            row.appendChild(btntd);
    
            tbody.appendChild(row);
        }

        mydelete();

    }
}

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
