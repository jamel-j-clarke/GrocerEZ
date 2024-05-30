import api from './api_clients/APIUserClient.js';

document.addEventListener(`DOMContentLoaded`, (event) => {
    // const body = document.querySelector( `body` );
    const blur = document.getElementById( `blur` );
    const loginPopup = document.getElementById('login-popup');
    const signupPopup = document.getElementById('signup-popup');

    const loginButton = document.getElementById(`login-button`);
    const signupButton = document.getElementById(`signup-button`);
    const haveAccountButton = document.getElementById( `have-account-button` );

    const noAccountButton = document.getElementById( `no-account-button` );
    const closeLoginButton = document.getElementById(`login-close-button`);
    const closeSignupButton = document.getElementById(`signup-close-button`);

    // blurring function
    function blurToggle() {
        blur.classList.toggle( `active` );
    }

    // login popup function
    function loginToggle() {
        loginPopup.classList.toggle( `active` );
    }

    // signup popup function
    function signupToggle() {
        signupPopup.classList.toggle( `active` );
    }

    loginButton.addEventListener( `click`, (e) => {

        // is the background blurred?
        let blurred = blur.classList.contains( `active` );
        // is the login popup displayed?
        let loginDisplayed = loginPopup.classList.contains( `active` );

        // if the screen ISN'T blurred and the login popup ISN'T displayed...
        if ( !blurred && !loginDisplayed ) {
            // blur the screen
            blurToggle();
            // and display the login popup.
            loginToggle(); 
        }

        // or if the screen IS blurred and the login popup ISN'T displayed,
        // this means the signup popup is displayed. therefore...
        else if ( blurred && !loginDisplayed ) {
            // remove the signup popup from view
            signupToggle();
            // and display the login popup.
            loginToggle();
        }

        // in any other case, don't do anything.
        else {
            e.preventDefault();
        }

        // don't let the event bubble to the parent containers!
        e.stopPropagation();
    });

    haveAccountButton.addEventListener( `click`, (e) => {
        // because the signup popup is displayed, remove it from view
        signupToggle();
        // and display the login popup.
        loginToggle();

        // don't let the event bubble to the parent containers!
        e.stopPropagation();
    });

    closeLoginButton.addEventListener( `click`, (e) => {
        // because the background is blurred, unblur it
        blurToggle();
        // and remove the login popup from view.
        loginToggle();

        // don't let the event bubble to the parent containers!
        e.stopPropagation();
    });

    signupButton.addEventListener( `click`, (e) => {
        // is the background blurred?
        let blurred = blur.classList.contains( `active` );
        // is the signup popup displayed?
        let signupDisplayed = signupPopup.classList.contains( `active` );

        // if the screen ISN'T blurred and the signup popup ISN'T displayed,
        if ( !blurred && !signupDisplayed ) {
            // blur the screen
            blurToggle();
            // and display the signup popup.
            signupToggle(); 
        }

        // or if the screen IS blurred and the signup popup ISN'T displayed,
        // this means the login popup is displayed. therefore...
        else if ( blurred && !signupDisplayed ) {
            // remove the login popup from view
            loginToggle();
            // and display the signup popup
            signupToggle();
        }

        // in any other case, don't do anything.
        else {
            e.preventDefault();
        }

        // don't let the event bubble to the parent containers!
        e.stopPropagation();
    });

    noAccountButton.addEventListener( `click`, (e) => {
        // because the login popup is currently displayed, remove it from view,
        loginToggle();
        // then display the signup popup.
        signupToggle();
        // don't let the event bubble to the parent containers!
        e.stopPropagation();
    });

    closeSignupButton.addEventListener( `click`, (e) => {
        // because the background is blurred, unblur it,
        blurToggle();
        // then remove the signup popup from view.
        signupToggle();
        // don't let the event bubble to the parent containers!
        e.stopPropagation();
    });

    // body.addEventListener( `click`, (e) => {
    //     // if a popup is in view...
    //     if ( blur.classList.contains( `active` ) ) {
    //         // and it's the login popup, remove it from view,
    //         if ( loginPopup.classList.contains( `active` ) ) {
    //             loginToggle();
    //         } 
    //         // or it's the signup popup, remove it from view,
    //         else if ( signupPopup.classList.contains( `active` ) ) {
    //             signupToggle();
    //         }
    //         // and unblur the background.
    //         blurToggle();
    //     }
    // });

    let signupSubmit = document.getElementById("signup-form");
    signupSubmit.addEventListener('submit', (e) => {
        // Get all elements necessary for sign up
        let name = document.getElementById("signup-name-textbox");
        let email = document.getElementById("signup-email-textbox");
        let pwd = document.getElementById("signup-password-textbox");
        let repPwd = document.getElementById("signup-repeat-password-textbox");
        // Error message div
        let errMsg = document.getElementById("signup-error-msg");
        
        // Prevent Default because we will determine its behaviour
        e.preventDefault();

        // Check name
        if(!name.value){
            errMsg.innerHTML = "<br>Name is a required field.";
            /** Could also add specific style for error */
        }
        // Check email
        else if(!email.value){
            errMsg.innerHTML = "<br>Email is a required field.";
        }
        // Check passwords
        else if(!pwd.value && !repPwd.value){
            errMsg.innerHTML = "<br>Password is a required field.";
        }
        else if(pwd.value != repPwd.value){
            // Add error message
            errMsg.innerHTML = "<br>Passwords do not match. Please try again.";
            
        } 
        // Attempt sign up
        else {
            errMsg.innerHTML = "";
            let body = {name:name.value, email:email.value, password:pwd.value};
            api.createUser(body).then(res => {
                console.log("Res: " + JSON.stringify(res));
                document.location = "/currentList";
            }).catch(err =>{
                errMsg.innerHTML = "Sign up unsuccessful.";
                console.log("Error signing up: " + err);
            });
        }
    });

    let loginSubmit = document.getElementById("login-form");
    loginSubmit.addEventListener('submit', (e) => {
        // Get all elements necessary for sign up
        let email = document.getElementById("login-email-textbox");
        let pwd = document.getElementById("login-password-textbox");
        // Error message div
        let errMsg = document.getElementById("login-error-msg");

        // Prevent Default because we will determine its behaviour
        e.preventDefault();

        // Check email
        if(!email.value){
            errMsg.innerHTML = "<br>Email is a required field.";
        } // Check password
        else if(!pwd.value){
            errMsg.innerHTML = "<br>Password is a required field.";
        }
        // Attempt login
        else {
            errMsg.innerHTML = "";
            let body = {"email":email.value, "password":pwd.value};
            api.login(body).then(res => {
                console.log("Res: " + JSON.stringify(res));
                localStorage.setItem('user', JSON.stringify(res));
                document.location = "/currentList";
            }).catch(err =>{
                errMsg.innerHTML = "<br>Login unsuccessful.";
                console.log("Error logging in: " + err);
            });
        }
    });
});