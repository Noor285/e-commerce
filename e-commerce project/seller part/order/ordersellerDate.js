import { db } from '/./firebase.js';
import { ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";



let Sellercreds = JSON.parse(sessionStorage.getItem("seller-creds"));
let Sellerinfo = JSON.parse(sessionStorage.getItem("Seller-info"));

let signoutbtn = document.querySelector(".logout");
let prodbtn = document.querySelector(".prod");
let categbtn = document.querySelector(".catego");
let lastOrdbtn = document.querySelector(".lstord");


let signout = () => {
    sessionStorage.removeItem("seller-creds");
    sessionStorage.removeItem("Seller-info");
    window.location.href = '../../seller auth/adminlogin.html'
}

let checkCred = () => {
    if (!sessionStorage.getItem("seller-creds")) {
        window.location.href = '/seller auth/adminlogin.html'
    } else {


        sellername.innerText = Sellerinfo.username;
        prodbtn.onclick = () => {
            console.log("hi")
            window.location.href = '../products/Prodcrud.html';
        }
        categbtn.onclick = () => {
            console.log("hi");
            window.location.href = '../category/categCRUD.html';
        }
        lastOrdbtn.onclick=()=>{
            window.location.replace('../last order/lastorder.html');
        }



    }
}

window.addEventListener('load', checkCred);

signoutbtn.onclick = signout;

const ProductsCartRef = ref(db, 'ProductsCart/');
const dbref = ref(db);


const tbody = document.querySelector("#tbdyprod");

// Add this line at the beginning to get the loading icon element
const loadingIcon = document.getElementById('loading-icon');

// Initial load and real-time updates
loadingIcon.style.display = 'block';
function updateUI(products) {
    tbody.innerHTML = "";
    for (let product in products) {
        let prod = products[product];
        get(child(dbref, 'Products/' + prod.prodid)).then(
            (snapshot) => {
                if (snapshot.exists) {
                    const prodinfo = snapshot.val();
                    if (prodinfo.owner == Sellercreds.uid) {
                        get(child(dbref, 'customerAuthList/' + prod.customer)).then(
                            (snapshot) => {
                                if (snapshot.exists) {
                                    let customer = snapshot.val();

                                    const row = document.createElement("tr");
                                    row.dataset.id = prod.pcid;


                                    const customerNameTd = document.createElement("td");
                                    customerNameTd.dataset.label = "Customer";
                                    customerNameTd.innerText = customer.username;


                                    row.appendChild(customerNameTd);

                                    const producrNameTd = document.createElement("td");
                                    producrNameTd.dataset.label = "Name";
                                    producrNameTd.innerText = prodinfo.prodname;
                                    row.appendChild(producrNameTd);

                                    const imgtd = document.createElement("td");
                                    imgtd.dataset.label = "Img";
                                    const img = document.createElement("img");
                                    img.className = "imgdiv";
                                    img.src = prodinfo.mainimgurl;
                                    imgtd.appendChild(img);
                                    row.appendChild(imgtd);


                                    const categotd = document.createElement("td");
                                    categotd.dataset.label = "Category";
                                    categotd.innerText = prodinfo.category;
                                    row.appendChild(categotd);

                                    let quant = Number(prod.quantity);
                                    let price = Number(prodinfo.price);
                                    const quanttd = document.createElement("td");
                                    quanttd.dataset.label = "No";
                                    quanttd.innerText = quant;
                                    row.appendChild(quanttd);

                                    const pricetd = document.createElement("td");
                                    pricetd.dataset.label = "Price";
                                    pricetd.innerText = quant * price + " $";
                                    row.appendChild(pricetd);

                                    const datetd = document.createElement("td");
                                    datetd.dataset.label = "Order Date";
                                    datetd.innerText = prod.orderdate;
                                    row.appendChild(datetd);
                                    if (prod.status == "waiting") {
                                        const Statustd = document.createElement("td");
                                        Statustd.dataset.label = "Actions";
                                        const btnAcpt = document.createElement("button");
                                        btnAcpt.className = "btn btn-edit";
                                        btnAcpt.innerText = "Accept";
                                        btnAcpt.onclick = function () {accept(prod.pcid)}
                                        Statustd.appendChild(btnAcpt);
                                        const btnaRej = document.createElement("button");
                                        btnaRej.classList.add("btn", "btn-delete");
                                        btnaRej.innerText = "Reject";
                                        btnaRej.onclick = function(){reject(prod.pcid)};
                                        Statustd.appendChild(btnaRej);
                                        row.appendChild(Statustd);
                                    }else if (prod.status == "accepted"){
                                        const Statustd = document.createElement("td");
                                        Statustd.dataset.label = "Status";
                                        const acptprgh = document.createElement("p");
                                        acptprgh.className = "statuspraccept";
                                        acptprgh.innerText = "Accepted";
                                        Statustd.appendChild(acptprgh);
                                        row.appendChild(Statustd);
                                    }else if (prod.status == "rejected"){
                                        const Statustd = document.createElement("td");
                                        Statustd.dataset.label = "Status";
                                        const rejprgh = document.createElement("p");
                                        rejprgh.className = "statusprreject";
                                        rejprgh.innerText = "Rejected";
                                        Statustd.appendChild(rejprgh);
                                        row.appendChild(Statustd);
                                    }


                                    tbody.appendChild(row);

                                    



                                }
                            }
                        ).catch((e)=>console.log(e))


                    }

                }
            }
        ).catch((e)=>console.log(e));




            console.log("hi");

    }


    // reject();
}


onValue(ProductsCartRef, (snapshot) => {
    const data = snapshot ? snapshot.val() : null;
    if (data) {
        console.log('ther is data')
        updateUI(data);
    }
    else {

        console.log("No data available");
        updateUI(data);

    }
    loadingIcon.style.display = 'none';


},);


function accept(id) {
    update(child(ProductsCartRef, id),{
        status:"accepted",
    })
}

function reject(id) {
    update(child(ProductsCartRef, id),{
        status:"rejected",
    })
}


