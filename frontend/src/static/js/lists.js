import listAPI from './api_clients/APIListClient.js';
import currentListAPI from './api_clients/APICurrentListClient.js';

let listToDelete;
let listToEdit;

const blur = document.getElementById( `blur` );
const listBox = document.getElementById( "list-box" );

const addToCurrentListButton = document.getElementById( "add-to-current-list-btn" );

// new list popup elements
const newListPopup = document.getElementById( `new-list-popup` );
const newListButton = document.getElementById( `new-list-button` );
const newListCloseButton = document.getElementById( `new-list-popup-cancel` );
const newListSubmitButton = document.getElementById( `new-list-popup-ok` );
const newListNameField = document.getElementById( `new-list-name-textbox` );

/** Delete confirmation popup elements */
const deleteListPopup = document.getElementById( `delete-list-popup` );
const deleteListCloseButton = document.getElementById( `delete-list-popup-close-button` );
const deleteListSubmitButton = document.getElementById( `delete-list-popup-submit-button` );
const deleteListMessage = document.getElementById( `delete-list-popup-message` );

/** Edit list pop-up elements */
const editListPopup = document.getElementById( `edit-list-popup` );
const editListCloseButton = document.getElementById( `edit-list-close-button` );
const editListSubmitButton = document.getElementById( `edit-list-submit-button` );
const editListNameField = document.getElementById( `edit-list-name-textbox` );
const editListItemList = document.getElementById( `edit-list-item-list` );

// add to current list popup elements
const addToCurrentListPopup = document.getElementById( `add-to-current-list-popup` );
const addToCurrentListErrorMessage = document.getElementById( `add-to-current-list-message` );
const addToCurrentListOkButton = document.getElementById( `add-to-current-list-ok-button` );

// populate the lists on the page
populateListBox();

// Listener for adding lists to the current list
addToCurrentListButton.addEventListener( 'click', (e) => {
    let lists = getCheckedLists( `main` );
    console.log( `lists: ${ lists }` );
    lists.forEach( list => {
        listAPI.getListItems( list ).then( items => {
            currentListAPI.addItems( items ).then( res => {
                addToCurrentListErrorMessage.innerHTML = ``;
                // uncheck each list
                const checkedLists = document.querySelectorAll( `main input[type='checkbox']:checked` );
                checkedLists.forEach( list => {
                    list.checked = false;
                });
            }).catch( err => {
                displayErrorPopup( err );
            });

        }).catch( err => {
            displayErrorPopup( err );
        });
    });
});

function displayErrorPopup( message ) {
    // is the background blurred?
    let blurred = blur.classList.contains( `active` );

    // if the screen ISN'T blurred and the add item popup ISN'T displayed,
    if ( !blurred ) {
        // blur the screen,
        blurToggle();
        // display the add item popup,
        addToCurrentListToggle();
        // and display the error message.
        addToCurrentListErrorMessage.innerHTML = `Here's what went wrong: ${ message }`;
    }

    // otherwise, don't do anything.
}

// Had to wrap the iteration in a promise to wait for all items to be retrieved. 
// For selecting lists and adding to current list
function getItems(ids, itemsToAdd){
    return new Promise((resolve, reject) => {
        for(let i = 0; i < ids.length; i++){
            listAPI.getListItems(ids[i]).then(res => {
                let index = i;
                let listToAdd = res;
                console.log("Response from getting list: " + JSON.stringify(res));
                itemsToAdd.push.apply(itemsToAdd, listToAdd);
                
                // If last id in the list, resolve.
                if(index == ids.length - 1){
                    resolve();
                }
            });
        }
    });
}

// blurring function
function blurToggle() {
    blur.classList.toggle( `active` );
}

// new list popup function
function newListToggle() {
    newListPopup.classList.toggle( `active` );
}

// delete list popup function
function deleteListToggle() {
    deleteListPopup.classList.toggle( `active` );
}

// edit recipe popup function
function editListToggle() {
    editListPopup.classList.toggle( `active` );
}

// add to current list error popup function {
function addToCurrentListToggle() {
    addToCurrentListPopup.classList.toggle( `active` );
}

// toggles the add to current list button
function toggleAddButtons() {
    let checked = getCheckedLists( `main` ).length > 0
    let disabled = addToCurrentListButton.disabled;
    if ( !disabled && !checked ) {
        addToCurrentListButton.disabled = true;
    } else if ( disabled && checked ) {
        addToCurrentListButton.disabled = false;
    } 
}

newListButton.addEventListener("click", (e) => {
    let blurred = blur.classList.contains( `active` );
    let newListDisplayed = newListPopup.classList.contains( `active` );

    if ( !blurred && !newListDisplayed ) {
        blurToggle();
        newListToggle();
    } else {
        e.preventDefault();
    }

    e.stopPropagation();
});

newListCloseButton.addEventListener( `click`, (e) => {
    // because the background is blurred, unblur it,
    blurToggle();
    // then remove the add item popup from view.
    newListToggle();
    // don't let the event bubble to the parent container!
    e.stopPropagation();
});

newListSubmitButton.addEventListener( `click`, (e) => {
    console.log( `new name: ${ newListNameField.value }` );
    const list = new Object();
    list.name = newListNameField.value;
    listAPI.createList( list ).then( () => {
        newListNameField.value = ``;
        clearListBox();
        populateListBox();
        blurToggle();
        newListToggle();
    });
});

deleteListCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    deleteListToggle();
    e.stopPropagation();
});

deleteListSubmitButton.addEventListener( `click`, (e) => {
    listAPI.deleteList(listToDelete).then(res => {
        listToDelete = ``;
        clearListBox();
        populateListBox();
        blurToggle();
        deleteListToggle();
        deleteListMessage.innerHTML = `Are you sure you want to delete `;
    }).catch(err => {
        console.log("Error when deleting list: " + err);
    });
});

editListCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    editListToggle();
    e.stopPropagation();
    let itemsInEdit = document.querySelectorAll( ".item-to-edit" );
    itemsInEdit.forEach( item => {
        item.remove();
    });
});

editListSubmitButton.addEventListener( `click`, (e) => {
    const list = new Object();
    list.id = listToEdit.id;
    list.name = editListNameField.value;
    let items = document.querySelectorAll( ".item-to-edit" );
    listAPI.editList(  listToEdit.id, list).then( () => {
        let itemsToEdit = [];
        for(let i = 0; i < items.length; i++){
            let item = items[i];
            let children = item.childNodes;
            let label = children[0].innerHTML;
            let quantity = children[1].value;
            if(quantity == ""){
                quantity = 0;
            }
            let it = {name: label.substring(0, label.length - 2), quantity: quantity};
            let elementId = item.id.split('-');
            it.id = elementId[0];
            itemsToEdit.push( it );
            console.log("Item built: " + JSON.stringify(it));
        }
        console.log( "Items to edit: " + itemsToEdit );
        listAPI.editItems( listToEdit.id, itemsToEdit ).then( () => {
            listToEdit = ``;
            blurToggle();
            editListToggle();
            location.reload();
        });
    });

    let itemsInEdit = document.querySelectorAll( ".item-to-edit" );
    itemsInEdit.forEach( item => {
        item.remove();
    });
});

addToCurrentListOkButton.addEventListener( `click`, (e) => {
    blurToggle();
    addToCurrentListToggle();
    addToCurrentListErrorMessage.innerHTML = ``;
});

function populateListBox() {
    listAPI.getLists().then( lists => {
        lists.forEach( list => {
            appendList( list );
        });
    }).catch(err =>{
        console.log(err);
    });
}

function clearListBox() {
    listBox.innerHTML = ``;
}

//Populate the edit list popup with the items
function populateItemList( container ) {
    editListNameField.value = listToEdit.name;
    listAPI.getListItems(listToEdit.id).then(items => {
        items.forEach(item => {
            populateItem(item, container);
        })
    });
}

// Add the item to the popup list
function populateItem( item, list ) {
    let qtyHolder = document.createElement('span');
    qtyHolder.classList.add('quantity-holder');
    qtyHolder.classList.add('item-to-edit');
    qtyHolder.id = `${item.id}-popup-item`;

    let qtyTextbox = document.createElement( `input` );
    qtyTextbox.type = `text`;
    qtyTextbox.classList.add( `number-textbox` );
    qtyTextbox.id = `${ item.id }-popup-quantity`;
    qtyTextbox.minlength = `1`;
    qtyTextbox.value = item.quantity;

    let qtyLabel = document.createElement( `label` );
    qtyLabel.for = qtyTextbox.id;
    let itemName = item.name;
    qtyLabel.innerHTML = `${ itemName }: `;
    qtyHolder.appendChild( qtyLabel );

    qtyHolder.appendChild( qtyTextbox );
    list.appendChild( qtyHolder );
}

// returns a list of the ids of the checked items
function getCheckedLists ( source ) {
    const checked = document.querySelectorAll( `${ source } input[type='checkbox']:checked` );
    const checkedLists = [];
    checked.forEach( check => {
        checkedLists.push( check.value );
    } );
    return checkedLists;
}

// create each html item for each list
function appendList( list ) {
    // Create a new content row div
    var contentRow = document.createElement('div');
    contentRow.classList.add('content-row');
    contentRow.id = list.name + "CR";

    // Create checkbox div
    var checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');

    // Create and set checkbox input field with a value
    var checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.value = list.id;
    checkboxInput.addEventListener( `click`, toggleAddButtons );
    checkbox.appendChild(checkboxInput);

    contentRow.appendChild(checkbox);

    // Create item name div
    var itemName = document.createElement('div');
    itemName.classList.add('item-name');
    itemName.innerHTML = list.name;
    contentRow.appendChild(itemName);

    // Create details button div
    var detailsButton = document.createElement('div');
    detailsButton.classList.add('details-button');
    detailsButton.innerHTML = '<button id="' + list.name + 'VDB">View Details</button>';
    contentRow.appendChild(detailsButton);

    // Create edit button div
    var editButton = document.createElement('div');
    editButton.classList.add('edit-button');
    editButton.innerHTML = `<button id="${list.name}EB">Edit</button>`;
    contentRow.appendChild(editButton);
    addEditButtonEventListener( editButton, list );

    // Create delete button div
    var deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = `<button id="${list.name}DB">Delete</button>`;
    contentRow.appendChild(deleteButton);
    addDeleteButtonEventListener( deleteButton, list );

    // Append the content row to the document
    listBox.appendChild(contentRow);

    //create content for details
    var details = document.createElement( 'div' );
    details.classList.add( 'content-row' );
    var detailsListDiv = document.createElement( 'div' );
    detailsListDiv.classList.add( 'item-name' );
    var detailsList = document.createElement( 'ul' );
    listAPI.getListItems( list.id ).then( items => {
        if(items.length == 0){
            let msg = document.createElement('label');
            msg.innerHTML = "This list has no items."
            detailsList.append(msg);
        } else {
            items.forEach( item => {
                let el = document.createElement( 'li' );
                el.textContent = item.name + ' - ' + item.quantity;
                detailsList.appendChild( el );
            });
        }
    });
    details.style.display = "none";
    details.style.borderTopWidth = "0px";
    details.id = 'details-' + list.name + 'VDB';
    detailsListDiv.appendChild( detailsList );
    detailsListDiv.style.marginLeft = "2%";
    details.appendChild( detailsListDiv );
    listBox.appendChild( details );
    contentRow.style.transition = "0s";

    //add event listener on view details button
    let viewDetails = document.getElementById( list.name + 'VDB' );
    viewDetails.addEventListener( 'click', function() {
        console.log('click');
        console.log(document.getElementById( 'details-' + this.id));
        if ( document.getElementById( 'details-' + this.id).style.display == "none" ) {
            document.getElementById( 'details-' + this.id).style.display = "block";
            document.getElementById( list.name + 'CR' ).style.borderBottomWidth = "0px";
            console.log('block');
        }
        else {
            document.getElementById( 'details-' + this.id).style.display = "none";
            document.getElementById( list.name + 'CR' ).style.borderBottomWidth = "1px";
            console.log('none');
        }
    });
}

// Get the list of checked lists for adding to current list
function getCheckedIds () {
    const checked = document.querySelectorAll( "input[type='checkbox']:checked" );
    const checkedItems = [];
    checked.forEach( check => {
        checkedItems.push( check.value );
    });
    console.log( "Checked:\n" + checkedItems );
    return checkedItems;
}

function addEditButtonEventListener( button, list ) {
    button.addEventListener( `click`, (e) => {
        listToEdit = {id:list.id, name:list.name};

        let blurred = blur.classList.contains( `active` );
        let editListDisplayed = editListPopup.classList.contains( `active` );

        if ( !blurred && !editListDisplayed ) {
            blurToggle();
            editListToggle();
            populateItemList(editListItemList);
        } else {
            e.preventDefault();
        }

        e.stopPropagation();
    });
}

function addDeleteButtonEventListener( button, list ) {
    button.addEventListener( `click`, (e) => {
        deleteListMessage.innerHTML += `"${ list.name }"?`;
        listToDelete = list.id;
        let blurred = blur.classList.contains( `active` );
        let deleteListDisplayed = deleteListPopup.classList.contains( `active` );

        if ( !blurred && !deleteListDisplayed ) {
            blurToggle();
            deleteListToggle();
        } else {
            e.preventDefault();
        }

        e.stopPropagation();
    });
}