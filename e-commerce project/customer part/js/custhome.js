import { db } from '/./firebase.js';
import { ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


let usercreds = JSON.parse(sessionStorage.getItem("user-creds"));
let userinfo = JSON.parse(sessionStorage.getItem("user-info"));


let signoutbtn = document.querySelector(".logout");
let signout =()=>{
    sessionStorage.removeItem("user-creds");
    sessionStorage.removeItem("user-info");
    window.location.href = '/custome auth/customer_login.html'     
}

let checkCred = ()=>{
    if(!sessionStorage.getItem("user-creds")){
        window.location.href = '/custome auth/customer_login.html'     
    }else{
        
    }    
}

window.addEventListener('load', checkCred);

signoutbtn.onclick = signout;


const ProductsRef = ref(db, 'Products/');


const cards = document.querySelector(".cards");
const searchInput = document.getElementById('searchInput');
const selcat = document.querySelector(".inform");

function updateUI (products){

    cards.innerHTML = "";

    for (var product in products) {
        let prod = products[product];

        let div = document.createElement("div");
        div.dataset.id = prod.id;
        div.className = "allProduct";
        // //
        // //
        div.addEventListener("click", () => handleRowClick(prod.id)); // Add this line
        // //
        // //
        
        let divinfo = document.createElement("div");
        let prdtitle = document.createElement("h2");
        prdtitle.className ="shadowing";
        prdtitle.innerText = prod.prodname;
        divinfo.appendChild(prdtitle);
        
        let prdPrice = document.createElement("p");
        prdPrice.className = "shadowing";
        prdPrice.classList.add('prodprice');
        prdPrice.innerText = prod.price +"$";
        divinfo.appendChild(prdPrice);

        let prdCateg = document.createElement("p");
        prdCateg.className = "shadowing";
        prdCateg.innerText = prod.category;
        divinfo.appendChild(prdCateg);

        
    
        div.appendChild(divinfo);

    
        let divimg = document.createElement("div");
        divimg.className="cardImg";
        
        let imgmain = document.createElement("img");
        imgmain.className= "prdimg";
        imgmain.src =prod.mainimgurl;
        divimg.appendChild(imgmain);
        
        div.appendChild(divimg);
    
        cards.appendChild(div);

    }

}

function filterItems(data, searchTerm, property) {
    return data.filter(item =>
        item[property].toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function handleSearch() {
    const searchTerm = searchInput.value.trim();
    const selectedProperty = document.getElementById('selectProperty').value;

    onValue(ProductsRef, (snapshot) => {
        const data = snapshot ? snapshot.val() : null;

    if (data) {
        const filteredItems = filterItems(Object.values(data), searchTerm,selectedProperty);// Initially, show all items
        updateUI(filteredItems);
    } else {
        
        console.log("No data available");
        updateUI(data);
       
    }
    });
}

function filterItemsbtns(data, property) {
    return data.filter(item =>
        item.category.toString().toLowerCase() === property.toLowerCase())
        ;
}
function handleSelect(e) {
    console.log(e.target.dataset.id);

    onValue(ProductsRef, (snapshot) => {
        const data = snapshot ? snapshot.val() : null;

        if (data) {
            const filteredItems = filterItemsbtns(Object.values(data), e.target.dataset.id);// Initially, show all items
            updateUI(filteredItems);
        } else {

            console.log("No data available");
            updateUI(data);

        }
    });
}


onValue(ProductsRef, (snapshot) => {
    const products = snapshot.val();

    const data = snapshot ? snapshot.val() : null;

    if (data) {
        const filteredProducts = filterItems(Object.values(data), '',"category"); // Initially, show all items
        updateUI(filteredProducts);
    } else {
        
        console.log("No data available");
        updateUI(data);
        
    }
    // loadingIcon.style.display = 'none';

    
},);


const seenCategories = new Set();


onValue(ProductsRef, (snapshot) => {

    selcat.innerHTML = "";
    seenCategories.clear();
    var products = snapshot.val();
    for (var product in products) {

        let pr = products[product];
       
        if (!seenCategories.has(pr.category)) {
            var button = document.createElement("button");
            button.className="category";
            button.innerText=pr.category;
            button.dataset.id =pr.category;
            selcat.appendChild(button);

            seenCategories.add(pr.category);
        }
        
        
    }
    let btns = document.querySelectorAll(".category");

    btns.forEach(btn => {
    btn.addEventListener('click', handleSelect);
});

})



searchInput.addEventListener('input', handleSearch);




// Function to handle row click and navigate to another page
// function handleRowClick(productId) {
//     // Assuming you have another HTML file (e.g., details.html) to display details
//     window.location.href = `productdetials.html?productId=${productId}`;
// }




// Function to handle row click and navigate to another page
function handleRowClick(productId) {
    // Assuming you have another HTML file (e.g., details.html) to display details
    window.location.href = `/customer part/html/productdetials.html?productId=${productId}`;
}








// function switchImage(row) {
//     var currentImage = row.querySelector('.slider img:not([style*="display: none"])');
//     var nextImage = currentImage.nextElementSibling || row.querySelector('.slider img:first-child');

//     currentImage.style.display = 'none';
//     nextImage.style.display = 'block';
// }




