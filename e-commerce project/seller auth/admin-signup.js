import { db } from '/./firebase.js';
import { ref, child, get,set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', e => {

    validateInputs();

    RegisterUser(e);
    
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

const isValidEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,7}$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if(usernameValue === '') {
        setError(username, 'Username is required');
    } else {
        setSuccess(username);
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }

    if(passwordValue === '') {
        setError(password, 'Password is required');
    } else if (passwordValue.length <6 ) {
        setError(password, 'Password must be at least 6 character.')
    } else {
        setSuccess(password);
    }

    if(password2Value === '') {
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
    } else {
        setSuccess(password2);
    }

};


function RegisterUser (evt) {
    evt.preventDefault();


    createUserWithEmailAndPassword(auth,email.value,password.value).then(
        (credentials) =>{
            console.log("sucess")
            set(ref(db, 'SellerAuthList/' + credentials.user.uid),{
                username: username.value,
            })
            .then(
                ()=>{
                    window.location.href = 'adminlogin.html';
                }
            )
        }
    ).catch(
        (error)=>{
            if(emailValue === email.value){
                setError(email, 'This email is already used before');
            }
            console.log(error)
        }
    )

    
}
