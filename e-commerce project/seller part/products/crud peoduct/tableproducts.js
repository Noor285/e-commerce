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




// write function by set

function writeProductData(name,mimg,s1img,s2img,categ,_price,descr,_quantity) {

    // Use push to generate a unique user ID
    const newProductRef = push(ProductsRef);

    // Get the new user ID
    const ProductId = newProductRef.key;

    
    set(child(ProductsRef, ProductId), {
        prodname:name,
        mainimgurl:mimg,
        side1imgurl:s1img,
        side2imgurl:s2img,
        category:categ,
        price:_price,
        description:descr,
        quantity:_quantity,
    }).then((onFullFilled) => {
        console.log("writed");
    }, (onRejected) => {
        console.log(Object);
    }

    );
}



onValue(ProductsRef, (snapshot) => {
    const products = snapshot.val();

    tablebody.innerHTML = "";

    for (var product in products) {

        let row = document.createElement("tr");
        row.dataset.id = product;
        //
        //
        row.addEventListener("click", () => handleRowClick(row.dataset.id)); // Add this line
        //
        //
        let prod = products[product];

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
        pricetd.innerText = prod.price +"$";
        row.appendChild(pricetd);
    
        let descrtd = document.createElement("td");
        descrtd.dataset.label = "Description";
        let pdescr = document.createElement("p");
        pdescr.innerText=prod.description;
        descrtd.appendChild(pdescr);
        row.appendChild(descrtd);
    
        let quntd = document.createElement("td");
        quntd.dataset.label = "Quantity";
        quntd.innerText = prod.quantity;
        row.appendChild(quntd);
    
        let actiontd = document.createElement("td");
        actiontd.dataset.label = "Actions"
        let edbtn = document.createElement("button");
        edbtn.className = "btn btn-edit";
        edbtn.innerText = "Edit"
        actiontd.appendChild(edbtn);
        let delbtn = document.createElement("button");
        delbtn.className = "btn btn-delete";
        delbtn.innerText = "Delete"
        actiontd.appendChild(delbtn);
        row.appendChild(actiontd);
    
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
    
}, {
    // onlyOnce: true
});



// edit fun 

function myupdate (){

    let edbtn = document.querySelectorAll('.btn-edit');
    edbtn.forEach(edit => {
        edit.onclick = function () {
            addModel.classList.add('model-show');
            let productId = edit.parentElement.parentElement.dataset.id;
            get(child(ProductsRef, productId)).then(
                (snapshot) => {
                    form.prodname.value = snapshot.val().prodname; 
                    form.mainimgurl.value = snapshot.val().mainimgurl;
                    form.side1imgurl.value = snapshot.val().side1imgurl;
                    form.side2imgurl.value = snapshot.val().side2imgurl;
                    form.category.value = snapshot.val().category;
                    form.price.value = snapshot.val().price;
                    form.description.value = snapshot.val().description;
                    form.quantity.value = snapshot.val().quantity;
                    
                }
            )
            form.onsubmit = function (e) {
                e.preventDefault();
                update(child(ProductsRef, productId), {
                    prodname:form.prodname.value,
                    mainimgurl:form.mainimgurl.value,
                    side1imgurl:form.side1imgurl.value,
                    side2imgurl:form.side2imgurl.value,
                    category:form.category.value,
                    price:form.price.value,
                    description:form.description.value,
                    quantity:form.quantity.value,

                }).then((onFullFilled) => {
                    console.log("updated");
                    addModel.classList.remove('model-show');
                    form.reset()
                }, (onRejected) => {
                    console.log(onRejected);
                }

                );
            }
        }
    });
}






// Delete fun

function mydelete(){
    let delbtn = document.querySelectorAll(".btn-delete");
    delbtn.forEach(del => {
        del.onclick = function () {
            let productId = del.parentElement.parentElement.dataset.id;
            remove(child(ProductsRef, productId)).then(
                ()=>{
                    console.log("delete");
                }
            )
            
        }
    });
}

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
//--------------------------------------------------------------------
//---------------------------------------------------------------------


