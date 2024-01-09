//--------firebase realtime datebase ------------------

import { db } from '/./firebase.js';
import { ref, child, get, set, push, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


const ProductsCartRef = ref(db, 'ProductsCart/');
const ProductsRef = ref(db, 'Products/');


// ----------------authentication--------------------

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
//-------------about redirect -----------------------

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
const ProductRef = ref(db, `Products/${productId}`);

//----------------page items ----------------------------

const all = document.querySelector(".container");
const nameOut = document.querySelector("#prodname");
const mainImgOut = document.querySelector("#mainimg");
const mainImg2Out = document.querySelector("#img1");
const side1ImgOut = document.querySelector("#img2");
const side2ImgOut = document.querySelector("#img3");
const categOut = document.querySelector("#prodcat");
const priceOut = document.querySelector("#prodprice");
const quantOut = document.querySelector("#quantid");
const descrOut = document.querySelector("#proddescr");
const formcart = document.querySelector(".formcart");
const cartbtn = document.querySelector(".btn-cart");
const wishbtn = document.querySelector(".btn-Wish");


//---------------------------Fetch date 

get(ProductRef).then(
    (snapshot) => {
        const product = snapshot.val();
        if (product) {
            nameOut.innerText = product.prodname;
            mainImgOut.src = product.mainimgurl;
            mainImg2Out.src = product.mainimgurl;
            side1ImgOut.src = product.side1imgurl;
            side2ImgOut.src = product.side2imgurl;
            categOut.innerText = product.category;
            priceOut.innerText = product.price + " $";
            quantOut.max = product.quantity;
            descrOut.innerText = product.description;
            formcart.onsubmit = function (e) {
                e.preventDefault();
                updateProductQuantity(product.id,formcart.quant.value,product.quantity);
                Check(product.id, formcart.quant.value);
                formcart.reset();
                

            }

            wishbtn.onclick = addtoCookies;




        } else {
            all.innerHTML = `<p> data not found </p>`
        }
    }
).catch(
    (error) => {
        console.error(error);
    }
)



//---------- add to cart -----------

function Check(prodid, qun) {
    // Fetch data from ProductsCartRef
    get(ProductsCartRef).then((snapshot) => {
        const cartData = snapshot.val();
        if (cartData) {
            // Iterate through cartData to check if prodid already exists
            for (const i in cartData) {
                const cartItem = cartData[i];
                if (cartItem.prodid === prodid && cartItem.customer === usercreds.uid && cartItem.status === "waiting") {
                    // Product is already in the cart
                    console.log('Product is already in the cart');
                    let oldqun = Number(cartItem.quantity);
                    let addqun = Number(qun);
                    let newqun = oldqun + addqun;
                    update(child(ProductsCartRef, cartItem.pcid), {
                        quantity: newqun,
                    });
                    window.location.href = "/customer part/html/cart.html";


                    return;
                }


            }
            console.log('Product is not in the cart');
            writeProductCartData(prodid, qun);
            window.location.href = "/customer part/html/cart.html";

        } else {
            // Cart is empty
            console.log('Cart is empty');
            // Proceed with adding the product to the cart
            writeProductCartData(prodid, qun);
            window.location.href = "/customer part/html/cart.html";
        }
    }).catch((error) => {
        console.error(error);
    });
}



function writeProductCartData(prdid, _quantity) {
    // Get the current date
    const formattedDate = new Date().toLocaleDateString('en-GB');

    // Use push to generate a unique user ID
    const newProductCartRef = push(ProductsCartRef);

    // Get the new user ID
    const ProductCardId = newProductCartRef.key;


    set(child(ProductsCartRef, ProductCardId), {
        pcid: ProductCardId,
        customer: usercreds.uid,
        prodid: prdid,
        quantity: _quantity,
        orderdate: formattedDate,
        status: "waiting"
    }).then((onFullFilled) => {
        console.log("writed");
    }, (onRejected) => {
        console.log(Object);
    }

    );
}


function updateProductQuantity(id, addqun , oldqun){
    
    let newqun = parseInt(oldqun)-parseInt( addqun);
   
    update(child(ProductsRef,id), { quantity: newqun })
        .then(() => {
            console.log("Product quantity updated successfully.");
            // Refresh the UI after updating the quantity
            
        })
        .catch((error) => {
            console.error("Error updating product quantity:", error);
        });

}


//-------wishlist Cookies --------------------------

function addtoCookies() {
    const productData = {
        prodid: productId,
        customer: usercreds.uid
    };

    console.log(productData);



    let checkname = getAllnameCookies();

    console.log(checkname);

    if (checkname.includes(productId)) {
        console.log('Product is already in the wishlist');
    
    } else {
        setCookie(productId, productData, 3);
        console.log('Product added to the wishlist');
        const allCookies = getAllCookies();
        console.log(allCookies);
        window.location.href = "/customer part/html/wishlist.html"
    }



}


function getAllnameCookies() {
    const cookies = document.cookie.split(';');
    const allCookieValues = [];

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const [name, value] = cookie.split('=');

        // Add the cookie value to the object
        allCookieValues.push(decodeURIComponent(name));
    }

    return allCookieValues;
}


function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookieValue = encodeURIComponent(JSON.stringify(value));
    document.cookie = `${name}=${cookieValue}; expires=${expires.toUTCString()}; path=/; domain=${window.location.hostname.replace(/^[^.]*\.(\w+\.\w+)$/, '$1')}`;
    console.log('Cookie set:', document.cookie);
}


function getAllCookies() {
    const cookies = document.cookie.split(';');
    const allCookieValues = [];
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const [name, value] = cookie.split('=');
      
      // Add the cookie value to the object
        allCookieValues.push(JSON.parse (decodeURIComponent(value)));
    }
  
    return allCookieValues;
  }


