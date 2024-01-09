import { db } from '/./firebase.js';
import { ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const ProductsRef = ref(db, 'Products/');


const cards = document.querySelector(".cards");




onValue(ProductsRef, (snapshot) => {
    const products = snapshot.val();

    cards.innerHTML = "";

    for (var product in products) {
        let prod = products[product];

        let div = document.createElement("div");
        div.dataset.id = prod.id;
        div.className = "allProduct";
        
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


    
},);






