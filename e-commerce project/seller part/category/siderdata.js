import { db } from '/./firebase.js';
import { ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let Sellercreds = JSON.parse(sessionStorage.getItem("seller-creds"));
let Sellerinfo = JSON.parse(sessionStorage.getItem("Seller-info"));

let signoutbtn = document.querySelector(".logout");
let prodbtn = document.querySelector(".prod");
let orderbtn = document.querySelector(".order");
let lastOrdbtn = document.querySelector(".lstord");

let signout = () => {
    sessionStorage.removeItem("seller-creds");
    sessionStorage.removeItem("Seller-info");
    window.location.replace ( '../../seller auth/adminlogin.html');
}

let checkCred = () => {
    if (!sessionStorage.getItem("seller-creds")) {
        window.location.replace( '../../seller auth/adminlogin.html');
    } else {

        sellername.innerText = Sellerinfo.username;
        prodbtn.onclick = () => {
            
            window.location.replace('../products/Prodcrud.html');
        }
        orderbtn.onclick=()=>{
            window.location.href='../order/orderseller.html';
        }
        lastOrdbtn.onclick=()=>{
            window.location.replace('../last order/lastorder.html');
        }

    }
}

window.addEventListener('load', checkCred);

signoutbtn.onclick = signout;

const ProductsRef = ref(db, 'Products/');
const ProductsCartRef = ref(db, 'ProductsCart/');

let tablebody = document.querySelector("#tbdyprod");
const addModel = document.querySelector(".add-model");
let form = document.querySelector(".form");

let checkboxAll = document.getElementById('all');


checkboxAll.addEventListener('change', function () {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checkboxAll.checked;
    });
});




// Add this line at the beginning to get the loading icon element
const loadingIcon = document.getElementById('loading-icon');

// Initial load and real-time updates
loadingIcon.style.display = 'block';


//select for category 
const selcat = document.querySelector("#selectcateg");

function updateUI(products) {
    tablebody.innerHTML = "";
    if (products && Object.keys(products).length > 0) {
        for (var product in products) {
            let prod = products[product];
            console.log(prod.owner);
            console.log(Sellercreds.uid);
            if (prod.owner == Sellercreds.uid) {
                console.log("equal");

                let row = document.createElement("tr");
                row.dataset.id = prod.id;
                console.log(prod);

                let checkboxTd = document.createElement("td");
                let checkybox = document.createElement("input");
                checkybox.type = "checkbox";
                checkybox.className = "rowcheck";
                checkybox.value = prod.id;
                checkboxTd.appendChild(checkybox);
                row.appendChild(checkboxTd);

                let nametd = document.createElement("td");
                nametd.dataset.label = "name";
                nametd.innerText = prod.prodname;
                row.appendChild(nametd);



                let imgstd = document.createElement("td");
                imgstd.dataset.label = "img";
                imgstd.className = "slider-td";



                let divimgs = document.createElement("div");
                divimgs.className = "slider";


                let img1 = document.createElement("img");
                img1.src = prod.mainimgurl;
                divimgs.appendChild(img1);

                let img2 = document.createElement("img");
                img2.src = prod.side1imgurl;
                divimgs.appendChild(img2);

                let img3 = document.createElement("img");
                img3.src = prod.side2imgurl;
                divimgs.appendChild(img3);

                imgstd.appendChild(divimgs);
                row.appendChild(imgstd);


                let cattd = document.createElement("td");
                cattd.dataset.label = "category";
                cattd.innerText = prod.category;
                row.appendChild(cattd);

                let pricetd = document.createElement("td");
                pricetd.dataset.label = "Price";
                pricetd.innerText = prod.price + "$";
                row.appendChild(pricetd);

                let descrtd = document.createElement("td");
                descrtd.dataset.label = "Description";
                let pdescr = document.createElement("p");
                pdescr.innerText = prod.description;
                descrtd.appendChild(pdescr);
                row.appendChild(descrtd);

                let quntd = document.createElement("td");
                quntd.dataset.label = "Quantity";
                quntd.innerText = prod.quantity;
                row.appendChild(quntd);



                let imgswitch = row.querySelector(".slider"); // Select .slider within the current row
                imgswitch.onclick = function () {
                    switchImage(row);
                };

                tablebody.appendChild(row);

            }else {
                console.log("you dont have a data")
                
            }
        }
        //edit 
        myupdate();

        //delete 

        mydelete();
    }
    else {
        tablebody.innerHTML = "<tr><td colspan='7'>hello</td></tr>";
    }
}


function filterItems(data, property) {
    return data.filter(item =>
        item.category.toString().toLowerCase() === property.toLowerCase())
        ;
}

function handleSelect(selectedProperty) {

    onValue(ProductsRef, (snapshot) => {
        const data = snapshot ? snapshot.val() : null;

        if (data) {
            const filteredItems = filterItems(Object.values(data), selectedProperty);// Initially, show all items
            updateUI(filteredItems);
        } else {

            console.log("No data available");
            updateUI(data);

        }
    });
}

const seenCategories = new Set();

onValue(ProductsRef, (snapshot) => {

    selcat.innerHTML = "";
    seenCategories.clear();
    var products = snapshot.val();
    for (var product in products) {

        let pr = products[product];
        if (pr.owner == Sellercreds.uid){
            if (!seenCategories.has(pr.category)) {
                var option = document.createElement("option");
                option.value = pr.category;
                option.text = pr.category;
                selcat.appendChild(option);
    
                seenCategories.add(pr.category);
            }
        }

        
    }

})


onValue(ProductsRef, (snapshot) => {
    const data = snapshot ? snapshot.val() : null;

    if (data) {
        updateUI(data);
    } else {

        console.log("No data available");
        updateUI(data);

    }
    loadingIcon.style.display = 'none';
});

selcat.addEventListener("change", function () {
    // This function will be called when an option is selected
    const selectedValue = selcat.value;
    console.log(selectedValue);
    // Call your custom function or perform actions based on the selected value
    handleSelect(selectedValue);
});





//user click anywhere outside model

window.onclick = function (e) {

    if (e.target === addModel) {
        addModel.classList.remove('model-show');
        form.reset()
    }

}

function mydelete() {
    let delbtn = document.querySelector(".btn-delete");
    delbtn.onclick = function () {
        let checkboxes = document.querySelectorAll(".rowcheck");
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                let productId = checkbox.value;
                get(ProductsCartRef).then(
                    (snap) => {
                        let cart = snap.val();
                        for (let i in cart) {
                            let item = cart[i];
                            if (item.prodid === productId) {
                                remove(child(ProductsCartRef, item.pcid)).then(
                                    () => {
                                        console.log("delete");
                                    }
                                ).then(
                                    remove(child(ProductsRef, productId)).then(
                                        () => {
                                            console.log("delete");
                                        }
                                    )
                                )
    
                            }
                        }
                    }
                )
            }
        });
    };
}





function myupdate() {
    let edbtn = document.querySelector('.btn-edit');
    edbtn.onclick = function () {
        addModel.classList.add('model-show');
        let checkboxes = document.querySelectorAll(".rowcheck");
        let promises = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                let productId = checkbox.value;
                promises.push(
                    get(child(ProductsRef, productId)).then((snapshot) => {
                        form.category.value = snapshot.val().category;
                    })
                );
            }
        });

        form.onsubmit = function () {


            // Use Promise.all to wait for all promises to resolve
            Promise.all(promises).then(() => {
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        let productId = checkbox.value;
                        update(child(ProductsRef, productId), {
                            category: form.category.value,
                        }).then(
                            (onFullFilled) => {
                                console.log(`Product with ID ${productId} updated`);
                            },
                            (onRejected) => {
                                console.log(onRejected);
                            }
                        );
                    }
                });

                addModel.classList.remove('model-show');
                form.reset();
            });
        };
    };
}









function switchImage(row) {
    var currentImage = row.querySelector('.slider img:not([style*="display: none"])');
    var nextImage = currentImage.nextElementSibling || row.querySelector('.slider img:first-child');

    currentImage.style.display = 'none';
    nextImage.style.display = 'block';
}


