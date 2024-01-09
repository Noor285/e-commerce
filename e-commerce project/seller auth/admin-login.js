import { db } from '/./firebase.js';
import { ref, child, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { auth } from '/./firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const dbref = ref(db);


const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', e => {

    validateInputs();
    SignInUser(e);
    // clearForm();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    errorDisplay.style.display = 'block';
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    errorDisplay.style.display = 'none';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

function isValidEmail(email){
    const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,7}$/;
    return re.test(String(email).toLowerCase());
}


const validateInputs = () => {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if(emailValue === '') {
        setError(email, 'Please enter your email');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }

    if(passwordValue === '') {
        setError(password, 'Password is required');
    } else {
        setSuccess(password);
    }
}

// function clearForm()
// {
//     for (var i = 0; i < inputs.length; i++) 
//     {
//         inputs[i].value = '';
        
//     }
// }

function SignInUser (evt)  {
    evt.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    signInWithEmailAndPassword(auth,email.value,password.value ).then(
        (credentials) =>{
            console.log("donnnnnnnnnnnnnne");
            get(child(dbref, 'SellerAuthList/' + credentials.user.uid)).then(
                (snapshot) => {
                    if(snapshot.exists){
                        sessionStorage.setItem("Seller-info", JSON.stringify({
                            username: snapshot.val().username,
                           
                        }));
                        sessionStorage.setItem("seller-creds",JSON.stringify(credentials.user));
                        window.location.replace('/./seller part/products/Prodcrud.html');
                    }
                    else{
                        console.log("User data not found");
                    }
                }
            ).catch((e) => {
                console.log(e);
                setError(email, 'Incorrect email')
                setError(password , 'Incorrect password')
            })
        }
    ).catch((error)=>{
            console.log(error);

            if(emailValue === '') {
                setError(email, 'Please enter your email');
            }
            else{
                setError(email, 'Incorrect email');

            }
           
            if(passwordValue === '') {
                setError(password, 'Password is required');
            }
            else{
                setError(password, 'Incorrect password');

            }
        }
    )
}

