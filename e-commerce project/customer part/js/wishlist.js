import { db } from '/./firebase.js';
import { ref, child, get, set, push, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const ProductsCartRef = ref(db, 'ProductsCart/');
const ProductsRef = ref(db, 'Products/');


/**----------------------- auth -------------------- */
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

function deleteRow(id) {
  console.log(id);
  delete_cookie(id);
  window.location.reload();
}

function delete_cookie(name) {
  document.cookie = `${name}=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=${window.location.hostname.replace(/^[^.]*\.(\w+\.\w+)$/, '$1')}`;
}

const existingWishlist = getAllCookies();
console.log('Parsed Wishlist:', existingWishlist);

const tbody = document.querySelector(".newRow");





function UpdateUi() {

  tbody.innerHTML = "";

  existingWishlist.forEach(
    obj => {
      if(obj.customer === usercreds.uid){
      const ProductRef = ref(db, `Products/${obj.prodid}`);
      get(ProductRef).then(
        (snapshot) => {
            const product = snapshot.val();
            if (product) {
              
              const row = document.createElement("tr");
              row.dataset.id  = obj.prodid;
              const imgtd = document.createElement("td");
              const img= document.createElement("img");
              img.src = product.mainimgurl;
              imgtd.appendChild(img);
              row.appendChild(imgtd);
              const nametd = document.createElement("td");
              nametd.innerText=product.prodname;
              row.appendChild(nametd);
              const pricetd = document.createElement("td");
              pricetd.innerText=product.price;
              row.appendChild(pricetd);
              const statustd = document.createElement("td");
              if (product.quantity > 0){
                statustd.innerText="In Stock";
                row.appendChild(statustd);
                const addtd = document.createElement("td");
                const addbtn = document.createElement("button");
                addbtn.className="addBtn";
                addbtn.innerText="Add to Cart"
                addbtn.onclick=()=>{ 
                  updateProductQuantity(obj.prodid,1,product.quantity);
                  Check(obj.prodid,1);
                };
                addtd.appendChild(addbtn);
                row.appendChild(addtd);
              }
              else{
                statustd.innerText="Out of Stock";
                row.appendChild(statustd);
                const addtd = document.createElement("td");
                const addbtn = document.createElement("button");
                addbtn.className="addBtn";
                addbtn.innerText="Add to Cart"
                addbtn.disabled = true;
                addtd.appendChild(addbtn);
                row.appendChild(addtd);
              }
             
              const deltd = document.createElement("td");
              const delbtn = document.createElement("button");
              delbtn.className="removeBtn";
              delbtn.innerText="Remove";
              delbtn.onclick =()=>{ deleteRow(obj.prodid)};
              deltd.appendChild(delbtn);
              row.appendChild(deltd);
          
              tbody.append(row);
    
    
            } else {
                tbody.innerHTML = `<p> data not found </p>`
            }
        }
    ).catch(
        (error) => {
            console.error(error);
        }
    )
    }
    

  });



}


UpdateUi();

//cookies family 

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return JSON.parse(decodeURIComponent(cookie.substring(name.length + 1))) || [];
    }
  }
  return [];
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookieValue = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${name}=${cookieValue}; expires=${expires.toUTCString()}; path=/; domain=${window.location.hostname.replace(/^[^.]*\.(\w+\.\w+)$/, '$1')}`;
  console.log('Cookie set:', document.cookie);
}






// function getAllnameCookies() {
//   const cookies = document.cookie.split(';');
//   const allCookieValues = [];

//   for (let i = 0; i < cookies.length; i++) {
//     const cookie = cookies[i].trim();
//     const [name, value] = cookie.split('=');
    
//     // Add the cookie value to the object
//       allCookieValues.push(decodeURIComponent(name));
//   }

//   return allCookieValues;
// }



function getAllCookies() {
  const cookies = document.cookie.trim();

  if (cookies === "") {
    return [];
  }

  const allCookieValues = [];

  const cookieArray = cookies.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    const [name, value] = cookie.split('=');

    // Add the cookie value to the object
    allCookieValues.push(JSON.parse(decodeURIComponent(value)));
  }

  return allCookieValues;
}





//cart family 





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


function updateProductQuantity(id, addqun , oldqun){
    
  let newqun = parseInt(oldqun)-parseInt( addqun);
  console.log(newqun);
  update(child(ProductsRef,id), { quantity: newqun })
      .then(() => {
          console.log("Product quantity updated successfully.");
          // Refresh the UI after updating the quantity
          
      })
      .catch((error) => {
          console.error("Error updating product quantity:", error);
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


