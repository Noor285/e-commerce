import { db } from '/./firebase.js';
import { ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const ProductsRef = ref(db, 'Products/');

let tablebody = document.querySelector("#tbdyprod");
const addModel = document.querySelector(".add-model")
let btnAdd = document.querySelector(".btn-add");
let form = document.querySelector(".form");
let productnameInp = document.querySelector("#nameid");
let mainimgInp = document.querySelector("#img1id");
let side1imgInp = document.querySelector("#img2id");
let side2imgInp = document.querySelector("#img3id");
let productCatInp = document.querySelector("#catid");
let productPriceInp = document.querySelector("#priceid");
let productDescrInp = document.querySelector("#descrid");
let productQuanInp = document.querySelector("#quanid");

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

            let row = document.createElement("tr");

            //
            //
            // row.addEventListener("click", () => handleRowClick(row.dataset.id)); // Add this line
            //
            //
            let prod = products[product];
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

        }
        //edit 
        myupdate();

        //delete 

        mydelete();
    }
    else {
        tablebody.innerHTML = "<tr><td colspan='7'>No products found</td></tr>";
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

        if (!seenCategories.has(pr.category)) {
            var option = document.createElement("option");
            option.value = pr.category;
            option.text = pr.category;
            selcat.appendChild(option);

            seenCategories.add(pr.category);
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







btnAdd.onclick = function () {
    addModel.classList.add('model-show');
    form.onsubmit = function (e) {
        e.preventDefault();
        writeProductData(
            productnameInp.value,
            mainimgInp.value,
            side1imgInp.value,
            side2imgInp.value,
            productCatInp.value,
            productPriceInp.value,
            productDescrInp.value,
            productQuanInp.value);
        addModel.classList.remove('model-show');
        form.reset()
    }
}

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
                console.log(productId);
                remove(child(ProductsRef, productId)).then(
                    () => {
                        console.log("delete");
                    }
                )
            }
        });
    };
}




// edit fun 

// function myupdate() {

//     let edbtn = document.querySelector('.btn-edit');
//     edbtn.onclick = function () {
//         console.log("start")
//         addModel.classList.add('model-show');
//         let i =0;
//         let checkboxes = document.querySelectorAll(".rowcheck");
//         checkboxes.forEach(checkbox => {
//             if (checkbox.checked) {
//                 let productId = checkbox.value;
//                 console.log(i+productId);
//                 get(child(ProductsRef, productId)).then(
//                     (snapshot) => {
//                         form.category.value = snapshot.val().category;
            
//                     }
//                 )
//                 form.onsubmit = function (e) {
//                     e.preventDefault();
//                     update(child(ProductsRef, productId), {
//                         category: form.category.value,
            
//                     }).then((onFullFilled) => {
//                         console.log("updated");
//                         addModel.classList.remove('model-show');
//                         form.reset()
//                     }, (onRejected) => {
//                         console.log(onRejected);
//                     }
            
//                     );
//                 }
//                 i++
//             }
//         });
//     };
    
// }

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

        form.onsubmit = function (e) {
            e.preventDefault();

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






function writeProductData(name, mimg, s1img, s2img, categ, _price, descr, _quantity) {

    // Use push to generate a unique user ID
    const newProductRef = push(ProductsRef);

    // Get the new user ID
    const ProductId = newProductRef.key;


    set(child(ProductsRef, ProductId), {
        prodname: name,
        mainimgurl: mimg,
        side1imgurl: s1img,
        side2imgurl: s2img,
        category: categ,
        price: _price,
        description: descr,
        quantity: _quantity,
        id: ProductId,
    }).then((onFullFilled) => {
        console.log("writed");
    }, (onRejected) => {
        console.log(Object);
    }

    );
}




function switchImage(row) {
    var currentImage = row.querySelector('.slider img:not([style*="display: none"])');
    var nextImage = currentImage.nextElementSibling || row.querySelector('.slider img:first-child');

    currentImage.style.display = 'none';
    nextImage.style.display = 'block';
}



//--------------------------------------------------------
//------------------------------------------------------
//---------------------------------------------------------------
//-----------------------------------------------------------------
//


// Function to handle row click and navigate to another page
// function handleRowClick(productId) {
//     // Assuming you have another HTML file (e.g., details.html) to display details
//     window.location.href = `productdetials.html?productId=${productId}`;
// }




// // Function to handle row click and navigate to another page
// function handleRowClick(productId) {
//     // Assuming you have another HTML file (e.g., details.html) to display details
//     window.location.href = `productdetials.html?productId=${productId}`;
// }
