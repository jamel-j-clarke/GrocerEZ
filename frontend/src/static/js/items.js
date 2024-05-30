import itemAPI from './api_clients/APIItemClient.js';
import recipeAPI from './api_clients/APIRecipeClient.js';
import listAPI from './api_clients/APIListClient.js';
import currentListAPI from './api_clients/APICurrentListClient.js';

let idTracker = 1;

const blur = document.getElementById( `blur` );
const itemBox = document.getElementById( "item-box" );

// new item popup elements
const newItemPopup = document.getElementById( `add-item-popup` );
const newItemButton = document.getElementById( `add-item-button` );
const newItemCloseButton = document.getElementById( `add-item-close-button` );
const newItemSubmitButton = document.getElementById( `add-item-submit-button` );
const newItemNameField = document.getElementById( 'add-item-name-textbox' );
const newItemQuantityField = document.getElementById( 'add-item-quantity-textbox' );
const newItemErrorMessage = document.querySelector( '.add-item-error-message' );

// add to recipe popup elements
const addToRecipePopup = document.getElementById( `add-to-recipe-popup` );
const addToRecipeItemList = document.getElementById( "add-to-recipe-item-list" );
const addToRecipeButton = document.getElementById( `add-to-recipe-button` );
const addToRecipeCloseButton = document.getElementById( `add-to-recipe-close-button` );
const addToRecipeSubmitButton = document.getElementById( `add-to-recipe-submit-button` );
const addToRecipeDropdown = document.getElementById( `add-to-recipe-dropdown` );
const addToRecipeTypeDropdown = document.getElementById( `add-to-recipe-type-dropdown` );
const addToRecipeTypeDropdownHolder = document.getElementById( `add-to-recipe-dropdown-holder` );
const addToRecipeErrorMsg = document.getElementById( `add-to-recipe-error-message` );

// add to list popup elements
const addToListPopup = document.getElementById( `add-to-list-popup` );
const addToListItemList = document.getElementById( "add-to-list-item-list" );
const addToListButton = document.getElementById( `add-to-list-button` );
const addToListCloseButton = document.getElementById( `add-to-list-close-button` );
const addToListSubmitButton = document.getElementById( `add-to-list-submit-button` );
const addToListDropdown = document.getElementById( `add-to-list-dropdown` );
const addToListErrorMsg = document.getElementById( `add-to-list-error-message` );

// new recipe popup elements
const newRecipePopup = document.getElementById( `new-recipe-popup` );
const newRecipeCloseButton = document.getElementById( `new-recipe-close-button` );
const newRecipeSubmitButton = document.getElementById( `new-recipe-submit-button` );
const newRecipeNameField = document.getElementById( `new-recipe-name-textbox` );
const newRecipeTypeField = document.getElementById( `new-recipe-type-dropdown` );
const newRecipeErrorMsg = document.getElementById( `new-recipe-error-message` );

// new list popup elements
const newListPopup = document.getElementById( `new-list-popup` );
const newListCloseButton = document.getElementById( `new-list-close-button` );
const newListSubmitButton = document.getElementById( `new-list-submit-button` );
const newListErrorMsg = document.getElementById( `new-list-error-message` );
const newListNameField = document.getElementById( `new-list-name-textbox` );

// edit item popup elements
const editItemPopup = document.getElementById( `edit-item-popup` );
const editItemCloseButton = document.getElementById( `edit-item-close-button` );
const editItemSubmitButton = document.getElementById( `edit-item-submit-button` );
const editItemNameField = document.getElementById( `edit-item-name-textbox` );
const editItemQuantityField = document.getElementById( `edit-item-quantity-textbox` );
const editItemErrorMsg = document.getElementById( `edit-item-popup-error-message` );

// delete item popup elements
const deleteItemPopup = document.getElementById( `delete-item-popup` );
const deleteItemCloseButton = document.getElementById( `delete-item-close-button` );
const deleteItemSubmitButton = document.getElementById( `delete-item-submit-button` );
const deleteItemMessage = document.getElementById( `delete-item-message` );

// current item id
let currentId;

populateItemBox();

// blurring function
function blurToggle() {
    blur.classList.toggle( `active` );
}

// add item popup function
function addItemToggle() {
    newItemPopup.classList.toggle( `active` );
}

// add to recipe popup function
function addToRecipeToggle() {
    addToRecipeDropdown.innerHTML = ``;
    populateListOfRecipes();
    // addPopupButtons( addToRecipePopup, `recipe` );
    addToRecipePopup.classList.toggle( `active` );
}

// add to list popup function
function addToListToggle() {
    addToListDropdown.innerHTML = ``;
    populateListOfLists();
    // addPopupButtons( addToListPopup, `list` );
    addToListPopup.classList.toggle( `active` );
}

// new recipe popup function
function newRecipeToggle() {
    newRecipePopup.classList.toggle( `active` );
    newRecipeTypeField.value = sessionStorage.getItem("recipesCategory");
}

// new list popup function
function newListToggle() {
    newListPopup.classList.toggle( `active` );
}

// edit item popup function
function editItemToggle() {
    editItemPopup.classList.toggle( `active` );
}

// delete item popup function
function deleteItemToggle() {
    deleteItemPopup.classList.toggle( `active` );
}

// toggles the add to list and add to recipe buttons
function toggleAddButtons() {
    // are any checkboxes checked?
    let checked = getCheckedItems( `main` ).length > 0

    // are the buttons disabled (if one's enabled, all are)
    let disabled = addToListButton.disabled;
    // if the buttons are already enabled (something else is already checked)...
    if ( !disabled ) {
        // if there are no other checked checkboxes, turn the buttons off
        if ( !checked ) {
            addToListButton.disabled = true;
            addToRecipeButton.disabled = true;
        }
    }
    // otherwise...
    else {
        // if the checkbox is checked, enable the buttons
        if ( checked ) {
            addToListButton.disabled = false;
            addToRecipeButton.disabled = false;
        }
    } 
}

newItemButton.addEventListener( `click`, (e) => {
    // is the background blurred?
    let blurred = blur.classList.contains( `active` );
    // is the add item popup displayed?
    let addItemDisplayed = newItemPopup.classList.contains( `active` );

    // if the screen ISN'T blurred and the add item popup ISN'T displayed,
    if ( !blurred && !addItemDisplayed ) {
        newItemErrorMessage.style.display = "none";
        // blur the screen
        blurToggle();
        // and display the add item popup.
        addItemToggle();
    }
    // otherwise, don't do anything.
    else {
        e.preventDefault();
    }
    // don't let the event bubble to the parent containers!
    e.stopPropagation();
});

addToRecipeButton.addEventListener( `click`, (e) => {
    let blurred = blur.classList.contains( `active` );
    let addToRecipeDisplayed = newItemPopup.classList.contains( `active` );

    if ( !blurred && !addToRecipeDisplayed ) {
        blurToggle();
        addToRecipeDropdown.innerHTML = ``;
        addToRecipeItemList.innerHTML = ``;
        populateItemList( addToRecipeItemList );
        addToRecipeToggle();
    } else {
        e.preventDefault();
    }
    e.stopPropagation();
});

addToListButton.addEventListener( `click`, (e) => {
    let blurred = blur.classList.contains( `active` );
    let addToListDisplayed = newItemPopup.classList.contains( `active` );

    if ( !blurred && !addToListDisplayed ) {
        blurToggle();
        addToListDropdown.innerHTML = ``;
        addToListItemList.innerHTML = ``;
        populateItemList( addToListItemList );
        addToListToggle();
    } else {
        e.preventDefault();
    }
    e.stopPropagation();
});

addToRecipeTypeDropdown.addEventListener( `change`, (e) => {
    sessionStorage.setItem( `recipesCategory`, addToRecipeTypeDropdown.value );
    populateListOfRecipes();
    //addToRecipeTypeDropdownHolder.classList.toggle( `hidden` );
});

addToRecipeDropdown.addEventListener( `click`, (e) => {
    let options = addToRecipeDropdown.querySelectorAll( `option` );
    let count = options.length;
    if ( count < 2 ) {
        addToRecipeToggle();
        newRecipeToggle();
    }
});

addToRecipeDropdown.addEventListener( `change`, (e) => {
    if ( addToRecipeDropdown.value == `(+) New Recipe` ) {
        addToRecipeToggle();
        newRecipeToggle();
    }
});

addToListDropdown.addEventListener( `click`, (e) => {
    let options = addToListDropdown.querySelectorAll( `option` );
    let count = options.length;
    if ( count < 2 ) {
        addToListToggle();
        newListToggle();
    }
});

addToListDropdown.addEventListener( `change`, (e) => {
    if ( addToListDropdown.value == `(+) New List` ) {
        addToListToggle();
        newListToggle();
    }
});

newItemCloseButton.addEventListener( `click`, (e) => {
    // because the background is blurred, unblur it,
    blurToggle();
    // then remove the add item popup from view.
    addItemToggle();
    // don't let the event bubble to the parent container!
    e.stopPropagation();
    // make sure any error messages don't appear
    newItemErrorMessage.style.display = "none";
});

newRecipeCloseButton.addEventListener( `click`, (e) => {
    newRecipeToggle();
    addToRecipeDropdown.innerHTML = ``;
    addToRecipeToggle();
    e.stopPropagation();
});

newListCloseButton.addEventListener( `click`, (e) => {
    newListToggle();
    addToListDropdown.innerHTML = ``;
    populateListOfLists();
    addToListToggle();
    e.stopPropagation();
});

addToRecipeCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    addToRecipeToggle();
    e.stopPropagation();
    addToRecipeItemList.innerHTML = ``;
});

addToListCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    addToListToggle();
    e.stopPropagation();
    addToListItemList.innerHTML = ``;
});

editItemCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    editItemToggle();
    e.stopPropagation();
});

deleteItemCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    deleteItemToggle();
    e.stopPropagation();
    deleteItemMessage.innerHTML = `Are you sure you want to delete `;
});

newItemSubmitButton.addEventListener( 'click', function(e) {
    // if the item name or quantity is empty, display the error message
    if ( newItemNameField.value == "" || newItemQuantityField.value == "" ) {
        newItemErrorMessage.style.display = "block";
    }
    // otherwise...
    else {
        const item = new Object();
        item.name = newItemNameField.value;
        item.id = idTracker;
        idTracker++;
        item.quantity = newItemQuantityField.value;
        console.log(item);
        const itemList = [ item ];
        itemAPI.createItem( itemList ).then( res => {
            appendItem( item );
            newItemNameField.value = ``;
            newItemQuantityField.value = ``;
            blurToggle();
            addItemToggle();
            e.stopPropagation();
            newItemErrorMessage.textContent = "Please fill out all fields.";
            newItemErrorMessage.style.display = "none";
            
            // clear the fields
            let name = document.querySelector( `#add-item-name-textbox` );
            let qty = document.querySelector( `#add-item-quantity-textbox` );
            name.innerHTML = ``;
            qty.innerHTML = ``;
            clearCheckboxes();
        }).catch(err =>{
            console.log(err);
            newItemErrorMessage.textContent = "Error adding item";
            newItemErrorMessage.style.display = "block";
        });
    }
});

addToRecipeSubmitButton.addEventListener( `click`, (e) => {
    let selectedRecipe = addToRecipeDropdown.value;
    console.log("Selected recipe: " + selectedRecipe);
    if(selectedRecipe == ``){
        addToRecipeErrorMsg.style.display = `block`;
        return;
    }
    else if ( selectedRecipe == `(+) New Recipe` ) {
        newRecipeToggle();
    } else {
        const checkedItems = getCheckedItems( `main` );
        let items = [];
        getItems(checkedItems, items).then(res => {
            console.log("Items to add: " + items);
            
            recipeAPI.addItems( selectedRecipe, items ).then( res => {
                console.log("Response from adding items: " + res);
                items.forEach(item =>{
                    let itemRow = document.getElementById( `${ item.id }-list-row` );
                    itemRow.innerHTML = ``;
                });
                // clear the checkboxes
                clearCheckboxes();
            }).catch( err => {
                addToRecipeErrorMsg.style.display = `block`;
                addToRecipeErrorMsg.innerHTML = `Error: ${ err }`;
                return;
            });
        }).catch(err => {
            console.log("Error getting items: " + err);
        });
        blurToggle();
        addToRecipeToggle();
        e.stopPropagation();
        addToRecipeErrorMsg.style.display = "none";
        addToRecipeErrorMsg.textContent = "Please fill out all fields.";
    }
    // clear the fields 
    let qtyHolders = document.querySelectorAll( `.quantity-holder` );
    qtyHolders.forEach( holder => {
        holder.innerHTML = ``; 
    });
});

addToListSubmitButton.addEventListener( `click`, (e) => {
    let listId = addToListDropdown.value;
    if(listId == ``){
        addToListErrorMsg.style.display = `block`;
        return;
    }
    else if ( listId == `(+) New List` ) {
        newListToggle();
    } else {
        const checkedItems = getCheckedItems( `main` );
        let items = [];
        getItems(checkedItems, items).then(res => {
            console.log("Items to add: " + items);
            if(listId == "Current"){
                currentListAPI.addItems(items ).then( res => {
                    console.log("Response from adding items: " + res);
                    items.forEach(item =>{
                        let itemRow = document.getElementById( `${ item.id }-list-row` );
                        itemRow.innerHTML = ``;
                    });
                    clearCheckboxes();
                }).catch( err => {
                    addToListErrorMsg.style.display = `block`;
                    addToListErrorMsg.innerHTML = `Error: ${ err }`;
                    return;
                });
            } else {
                listAPI.addItems( listId, items ).then( res => {
                    console.log("Response from adding items: " + res);
                    items.forEach(item =>{
                        let itemRow = document.getElementById( `${ item.id }-list-row` );
                        itemRow.innerHTML = ``;
                    });
                    clearCheckboxes();
                }).catch( err => {
                    addToListErrorMsg.style.display = `block`;
                    addToListErrorMsg.innerHTML = `Error: ${ err }`;
                    return;
                });
            }
        }).catch(err => {
            console.log("Error getting items: " + err);
        });
        blurToggle();
        addToListToggle();
        e.stopPropagation();
        addToListErrorMsg.style.display = "none";
        addToListErrorMsg.textContent = "Please fill out all fields.";
        // clear the fields 
        let qtyHolders = document.querySelectorAll( `.quantity-holder` );
        qtyHolders.forEach( holder => {
            holder.innerHTML = ``; 
        });
    }
});

function getItems(ids, items){
    return new Promise((resolve, reject) => {
        for(let i = 0; i < ids.length; i++){
            let index = i;
            let item = {
                id: ids[index],
                name: document.getElementById( `${ ids[index] }-name` ).innerHTML,
                quantity: document.getElementById( `${ ids[index] }-popup-quantity` ).value
            };
            items.push( item );
            if(index == ids.length - 1){
                resolve();
            }
        }
    });
}

newRecipeSubmitButton.addEventListener( `click`, (e) => {
    // if the recipe name is empty, display the error message
    if ( newRecipeNameField.value == "" ) {
        newRecipeErrorMsg.style.display = `block`;
    }

    // OPTIONAL
    // if the recipe name is taken, then display the corresponding error message
        // get the list of recipe names
        // iterate and see if there's a duplicate
        // newRecipeErrorMsg.innerHTML = `Please enter a unique recipe name`;
        // newRecipeErrorMsg.style.display = `block`;

    // otherwise...
    else {
        const recipe = new Object();
        recipe.name = newRecipeNameField.value;
        sessionStorage.setItem( `recipesCategory`, newRecipeTypeField.value );
        recipeAPI.createRecipe( newRecipeTypeField.value, recipe ).then ( () => {
            newRecipeNameField.innerHTML = ``;
            newRecipeToggle();
            addToRecipeToggle();
        }).catch( err => {
            newRecipeErrorMsg.style.display = `block`;
            newRecipeErrorMsg.innerHTML = `Error: ${ err }`;
        });
        
    }
});

newListSubmitButton.addEventListener( `click`, (e) => {
    // if the list name is empty, display the default error message
    if ( newListNameField.value == "" ) {
        newListErrorMsg.style.display = `block`;
    }
    
    // OPTIONAL
    // if the list name is taken, then display the corresponding error message
        // get the list of list names
        // iterate and see if there's a duplicate
        // newListErrorMsg.innerHTML = `Please enter a unique list name`;
        // newListErrorMsg.style.display = `block`;

    else {
        const list = new Object();
        list.name = newListNameField.value;
        listAPI.createList( list ).then( res => {
            newListNameField.innerHTML = ``;
            newListToggle();
            populateListOfLists();
        }).catch( err => {
            newListErrorMsg.style.display = `block`;
            newListErrorMsg.innerHTML = `Error: ${ err }`;
        });
        addToListToggle();
        
    }
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
    itemAPI.editItem( currentId, item ).then ( () => {
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

deleteItemSubmitButton.addEventListener( `click`, (e) => {
    let items = [ currentId ];
    deleteItemMessage.innerHTML = `Are you sure you want to delete `;
    itemAPI.deleteItems( items ).then( res => {
        clearItemBox();
        populateItemBox();
        blurToggle();
        deleteItemToggle();
    });
});

function clearCheckboxes() {
    // uncheck each item
    const checkedItems = document.querySelectorAll( `main input[type='checkbox']:checked` );
    checkedItems.forEach( item => {
        item.checked = false;
    });
}

function clearItemBox() {
    itemBox.innerHTML = ``;
}

function populateItemBox() {
    itemAPI.getItems().then( results => {
        if ( results.length > 0 ) {
            results.forEach( item => {
                appendItem( item );
            });
        }
    }).catch(err =>{
        console.log(err);
    });
}

function populateListOfRecipes() {
    addToRecipeDropdown.innerHTML = "";
    let option = document.createElement( `option` );
    option.value = ``;
    option.disabled = true;
    option.selected = true;
    option.innerHTML = ` -- select an option -- `;
    addToRecipeDropdown.appendChild( option );
    let selectedCategory = addToRecipeTypeDropdown.value;
    console.log("Category selected: " + selectedCategory);
    recipeAPI.getRecipes( selectedCategory ).then( recipes => {
        recipes.forEach( recipe => {
            let option = document.createElement( `option` );
            option.value = recipe.id;
            option.innerHTML = recipe.name;
            addToRecipeDropdown.appendChild( option );
        });
    });

    option = document.createElement( `option` );
    option.value = `(+) New Recipe`;
    option.innerHTML = `(+) New Recipe`;
    addToRecipeDropdown.appendChild( option );
}

function populateListOfLists() {
    addToListDropdown.innerHTML = ``;
    let option = document.createElement( `option` );
    option.value = ``;
    option.disabled = true;
    option.selected = true;
    option.innerHTML = ` -- select an option -- `;
    addToListDropdown.appendChild( option );

    listAPI.getLists().then( lists => {
        lists.forEach( list => {
            console.log("List: " + JSON.stringify(list));
            let option = document.createElement( `option` );
            option.value = list.id;
            option.innerHTML = list.name;
            addToListDropdown.appendChild( option );
        });
    });

    option = document.createElement( `option` );
    option.value = `(+) New List`;
    option.innerHTML = `(+) New List`;
    addToListDropdown.appendChild( option );

    option = document.createElement( `option` );
    option.value = `Current`;
    option.innerHTML = `Current`;
    addToListDropdown.appendChild( option );
}

function populateItemList( container ) {
    const checkedItems = getCheckedItems( `main` );
    console.log( checkedItems );
    // let 
    checkedItems.forEach( item => {
        addCheckedItem( item, container );
    });
}

// returns a list of the ids of the checked items
function getCheckedItems ( source ) {
    const checked = document.querySelectorAll( `${ source } input[type='checkbox']:checked` );
    const checkedItems = [];
    checked.forEach( check => {
        checkedItems.push( check.value );
    } );
    return checkedItems;
}

function addCheckedItem( item, list ) {
    let qtyHolder = document.createElement('span');
    qtyHolder.classList.add('quantity-holder');
    if ( list == addToRecipeItemList ) {
        qtyHolder.id = `${ item }-recipe-row`;
    } else if ( list == addToListItemList ) {
        qtyHolder.id = `${ item }-list-row`;
    }
    
    qtyHolder.appendChild.checkbox;

    let qtyTextbox = document.createElement( `input` );
    qtyTextbox.type = `text`;
    qtyTextbox.classList.add( `number-textbox` );
    qtyTextbox.id = `${ item }-popup-quantity`;
    qtyTextbox.minlength = `1`;
    qtyTextbox.value = document.getElementById( `${ item }-quantity` ).innerHTML.substring(5);

    let qtyLabel = document.createElement( `label` );
    qtyLabel.for = qtyTextbox.id;
    let itemName = document.getElementById( `${ item }-name` ).innerHTML;
    qtyLabel.innerHTML = `${ itemName }: `;
    qtyHolder.appendChild( qtyLabel );

    qtyHolder.appendChild( qtyTextbox );
    list.appendChild( qtyHolder );
}

function appendItem( item ) {
    console.log( `name: ${ item.name } and qty: ${ item.quantity }` );

    // Create a new content row div
    let contentRow = document.createElement('div');
    contentRow.classList.add('current-content-row');
    contentRow.id = item.name + "-row";

    // Create checkbox div
    let checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');

    // Create and set checkbox input field with a value
    let checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.value = item.id;
    checkboxInput.addEventListener( `click`, toggleAddButtons );
    checkbox.appendChild(checkboxInput);

    contentRow.appendChild(checkbox);

    // Create item name div
    let itemName = document.createElement('div');
    itemName.classList.add('item-name');
    itemName.id = `${ item.id }-name`;
    itemName.innerHTML = item.name;
    contentRow.appendChild(itemName);

    // Create quantity div
    let itemQty = document.createElement('div');
    itemQty.classList.add('quantity');
    itemQty.innerHTML = "Qty: " + item.quantity;
    itemQty.id = `${ item.id }-quantity`;
    contentRow.appendChild(itemQty);

    // Create edit button div
    let editButton = document.createElement('div');
    editButton.classList.add('edit-button');
    editButton.innerHTML = '<button>Edit</button>';
    addEditEventListener( editButton, item );
    contentRow.appendChild(editButton);
    
    // Create delete button div
    let deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<button>Delete</button>';
    addDeleteEventListener( deleteButton, item );
    contentRow.appendChild( deleteButton );

    // Append the content row to the document
    itemBox.appendChild(contentRow);
}

function addEditEventListener( button, item ) {
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

function addDeleteEventListener( button, item ) {
    button.addEventListener( `click`, (e) => {
        deleteItemMessage.innerHTML += `${ item.name }?`;
        currentId = item.id;

        let blurred = blur.classList.contains( `active` );
        let deletePopupDisplayed = deleteItemPopup.classList.contains( `active` );
        if ( !blurred && !deletePopupDisplayed ) {
            blurToggle();
            deleteItemToggle();
        } else {
            e.preventDefault();
        }
        e.stopPropagation();
    });
}