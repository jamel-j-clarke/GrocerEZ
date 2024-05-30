import api from './api_clients/APIUserClient.js';

// Always check that the user is authenticated.
api.getUser("current").then(user => {
    if(user){
        sessionStorage.setItem("user", JSON.stringify(user));
    } else{
        console.log("User is not authenticated.");
        document.location = "/";
    }
}).catch(err => {
    console.log("User is not authenticated.");
    document.location = "/";
});

const logoutButton = document.getElementById( `logout` );
const currentListTab = document.getElementById('currentListTab');
const breakfastTab = document.getElementById('breakfastTab');
const lunchTab = document.getElementById('lunchTab');
const snacksTab = document.getElementById('snacksTab');
const dinnerTab = document.getElementById('dinnerTab');
const dessertsTab = document.getElementById('dessertsTab');
const otherTab = document.getElementById('otherTab');
const listsTab = document.getElementById('listsTab');
const itemsTab = document.getElementById('itemsTab');

logoutButton.addEventListener( `click`, (e) => {
    api.logout().then( () => {
        sessionStorage.clear();
        document.location = `/`;
    });
});

currentListTab.addEventListener('click', (e) => {
    document.location = "/currentList";
});

breakfastTab.addEventListener('click', (e) => {
    sessionStorage.setItem("recipesCategory", "Breakfast");
    document.location = "/recipes";
});

lunchTab.addEventListener('click', (e) => {
    sessionStorage.setItem("recipesCategory", "Lunch");
    document.location = "/recipes";
});

snacksTab.addEventListener('click', (e) => {
    sessionStorage.setItem("recipesCategory", "Snacks");
    document.location = "/recipes";
});

dinnerTab.addEventListener('click', (e) => {
    sessionStorage.setItem("recipesCategory", "Dinner");
    document.location = "/recipes";
});

dessertsTab.addEventListener('click', (e) => {
    sessionStorage.setItem("recipesCategory", "Dessert");
    document.location = "/recipes";
});

otherTab.addEventListener('click', (e) => {
    sessionStorage.setItem("recipesCategory", "Other");
    document.location = "/recipes";
});

listsTab.addEventListener('click', (e) => {
    document.location = "/lists";
});

itemsTab.addEventListener('click', (e) => {
    document.location = "/items";
});

function registerServiceWorker() {
    if ( !navigator.serviceWorker ) {
        return;
    }

    navigator.serviceWorker.register( `/serviceWorker.js` ).then( registration => {
        if( registration.installing ) {
            console.log( `Service worker is installing` );
        } else if ( registration.waiting ) {
            console.log( `Service worker is installed, but waiting` );
        } else if ( registration.active ) {
            console.log( `Service worker is active` );
        }
    }).catch( error => {
        console.error( `Registration failed. Here's what's wrong: ${ error }` );
    });

    navigator.serviceWorker.addEventListener( `message`, event => {
        console.log( `ServiceWorker message`, event.data );
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener( `controllerchange`, () => {
        if ( refreshing ) return;
        window.location.reload();
        refreshing = true;
    });
};

registerServiceWorker();