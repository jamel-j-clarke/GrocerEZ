import currentListAPI from './api_clients/APICurrentListClient.js';
import listAPI from './api_clients/APIListClient.js';
import itemAPI from './api_clients/APIItemClient.js';

const blur = document.getElementById( `blur` );
const itemBox = document.getElementById( `item-box` );

// save to list popup elements
const saveToListPopup = document.getElementById( `save-to-list-popup` );
const saveToListButton = document.getElementById( `save-to-list-button` );
const saveToListCloseButton = document.getElementById( `save-to-list-close-button` );
const saveToListSubmitButton = document.getElementById( `save-to-list-submit-button` );
const saveToListNameInput = document.getElementById(`save-to-list-input-textbox`);
const saveToListErrMsg = document.getElementById(`save-to-list-err-msg`);

// clear items popup elements
const clearItemsPopup = document.getElementById( `clear-items-popup` );
const clearItemsButton = document.getElementById( `clear-button` );
const clearItemsCloseButton = document.getElementById( `clear-items-close-button` );
const clearItemsSubmitButton = document.getElementById( `clear-items-submit-button` );

// edit item popup elements
const editItemPopup = document.getElementById( `edit-item-popup` );
const editItemCloseButton = document.getElementById( `edit-item-close-button` );
const editItemSubmitButton = document.getElementById( `edit-item-submit-button` );
const editItemNameField = document.getElementById( `edit-item-name-textbox` );
const editItemQuantityField = document.getElementById( `edit-item-quantity-textbox` );
const editItemErrorMsg = document.getElementById( `edit-item-popup-error-message` );

// remove item popup elements
const removeItemPopup = document.getElementById( `delete-item-popup` );
const removeItemCloseButton = document.getElementById( `delete-item-close-button` );
const removeItemSubmitButton = document.getElementById( `delete-item-submit-button` );
const removeItemMessage = document.getElementById( `delete-item-message` );

// current item id
let currentId;

populateItemBox();

// blurring function
function blurToggle() {
    blur.classList.toggle( `active` );
}

// save to list popup function
function saveToListToggle() {
    saveToListPopup.classList.toggle( `active` );
}

// clear items popup function
function clearItemsToggle() {
    clearItemsPopup.classList.toggle( `active` );
}

// edit item popup function
function editItemToggle() {
    editItemPopup.classList.toggle( `active` );
}

// remove item popup function
function removeItemToggle() {
    removeItemPopup.classList.toggle( `active` );
}

saveToListButton.addEventListener( `click`, (e) => {
    let blurred = blur.classList.contains( `active` );
    let saveToListDisplayed = saveToListPopup.classList.contains( `active` );

    if ( !blurred && !saveToListDisplayed ) {
        blurToggle();
        saveToListToggle();
    } else {
        e.preventDefault();
    }

    e.stopPropagation();
});

clearItemsButton.addEventListener( `click`, (e) => {
    let blurred = blur.classList.contains( `active` );
    let clearItemsDisplayed = clearItemsPopup.classList.contains( `active` );

    let checked = getCheckedItems();

    if ( !blurred && !clearItemsDisplayed && checked.length > 0) {
        blurToggle();
        clearItemsToggle();
    } else {
        e.preventDefault();
    }

    e.stopPropagation();
});

saveToListCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    saveToListToggle();
    e.stopPropagation();
});

clearItemsCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    clearItemsToggle();
    e.stopPropagation();
});

editItemCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    editItemToggle();
    e.stopPropagation();
});

removeItemCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    removeItemToggle();
    e.stopPropagation();
    removeItemMessage.innerHTML = `Are you sure you want to delete `;
});

saveToListSubmitButton.addEventListener( `click`, (e) => {
    let listName = saveToListNameInput.value;
    
    if( listName ){
        saveToListErrMsg.innerHTML =  "";
        currentListAPI.getCurrentList().then(results =>{
            let items = results;
            if(items){
                let newList = {name: listName};
                listAPI.createList(newList).then(list =>{
                    let listId = list.id;
                    listAPI.addItems(listId, items).then(res => {
                        // On success, redirect to list page
                        document.location = "/lists";
                    }).catch(err => {
                        console.log("Error adding items to newly created list: " + err);
                    });
                }).catch(err => {
                    console.log("Error creating list: " + err);
                });
            }
        }).catch(err => {
            console.log("Error getting current list items" + err);
        });
    } else {
        saveToListErrMsg.innerHTML = "Must provide a name for the new list";
    }
});

clearItemsSubmitButton.addEventListener( `click`, (e) => {
    let items = getCheckedItems();
    console.log("Items to clear: "  + JSON.stringify(items));
    currentListAPI.deleteItems( items ).then(res => {
        clearItemBox();
        populateItemBox();
        blurToggle();
        clearItemsToggle();
    }).catch(err =>{
        console.log("Error clearing items from current list: " + err);
    });
});

editItemSubmitButton.addEventListener( `click`, (e) => {
    editItemErrorMsg.style.display = "none";
    const item = new Object();
    item.id = currentId;
    item.name = editItemNameField.value;
    item.quantity = editItemQuantityField.value;
    if(!item.name || !item.quantity){
        editItemErrorMsg.style.display = "block";
        return;
    }
    currentListAPI.editItem( currentId, item ).then ( () => {
        editItemNameField.value = ``;
        editItemQuantityField.value = ``;
        clearItemBox();
        populateItemBox();
        blurToggle();
        editItemToggle();
    }).catch( err => {
        editItemErrorMsg.innerHTML = err;
        editItemErrorMsg.style.display = "block";
    });
});

removeItemSubmitButton.addEventListener( `click`, (e) => {
    let items = [ currentId ];
    removeItemMessage.innerHTML = `Are you sure you want to delete `;
    currentListAPI.deleteItems( items ).then( res => {
        clearItemBox();
        populateItemBox();
        blurToggle();
        removeItemToggle();
    });
});

function clearItemBox() {
    itemBox.innerHTML = ``;
}

function getCheckedItems () {
    const checked = document.querySelectorAll( "input[type='checkbox']:checked" );
    const checkedItems = [];
    checked.forEach( check => {
        checkedItems.push( check.value );
    });
    console.log( "Checked:\n" + checkedItems );
    return checkedItems;
}

function populateItemBox() {
    currentListAPI.getCurrentList().then(results =>{
        results.forEach(item => {
            appendItem( item );
        });
    }).catch(err =>{
        console.log(err);
    });
}

function appendItem( item ) {
    // Create a new content row div
    var contentRow = document.createElement('div');
    contentRow.classList.add('current-content-row');

    // Create checkbox div
    var checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');

    // Create and set checkbox input field with a value
    var checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.value = item.id;
    checkbox.appendChild(checkboxInput);

    contentRow.appendChild(checkbox);

    // Create item name div
    var itemName = document.createElement('div');
    itemName.classList.add('item-name');
    itemName.innerHTML = item.name;
    contentRow.appendChild(itemName);

    // Create quantity div
    var itemQty = document.createElement('div');
    itemQty.classList.add('quantity');
    itemQty.innerHTML = "Qty: " + item.quantity;
    contentRow.appendChild(itemQty);

    // Create edit button div
    var editButton = document.createElement('div');
    editButton.classList.add('edit-button');
    editButton.innerHTML = '<button id="editBtn">Edit</button>';
    addEditButtonEventListener( editButton, item );
    contentRow.appendChild(editButton);

    // Create delete button div
    var removeButton = document.createElement('div');
    removeButton.classList.add('delete-button');
    removeButton.innerHTML = '<button id="deleteBtn">Delete</button>';
    addRemoveButtonEventListener( removeButton, item );
    contentRow.appendChild(removeButton);

    // Append the content row to the document
    itemBox.appendChild(contentRow);
}

function addEditButtonEventListener( button, item ) {
    button.addEventListener( `click`, (e) => {
        editItemNameField.value = item.name;
        editItemQuantityField.value = item.quantity;
        currentId = item.id;

        let blurred = blur.classList.contains( `active` );
        let editPopupDisplayed = editItemPopup.classList.contains( `active` );

        if ( !blurred && !editPopupDisplayed ) {
            blurToggle();
            editItemToggle();
        } else {
            e.preventDefault();
        }
        e.stopPropagation();
    });
}

function addRemoveButtonEventListener( button, item ) {
    button.addEventListener( `click`, (e) => {
        removeItemMessage.innerHTML += `${ item.name }?`;
        currentId = item.id;

        let blurred = blur.classList.contains( `active` );
        let removePopupDisplayed = removeItemPopup.classList.contains( `active` );
        if ( !blurred && !removePopupDisplayed ) {
            blurToggle();
            removeItemToggle();
        } else {
            e.preventDefault();
        }
        e.stopPropagation();
    });
}