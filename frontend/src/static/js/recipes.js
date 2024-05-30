import recipeAPI from './api_clients/APIRecipeClient.js';
import itemAPI from './api_clients/APIItemClient.js';
import listAPI from './api_clients/APIListClient.js';
import currentListAPI from './api_clients/APICurrentListClient.js';


var selection;

if(sessionStorage.getItem("recipesCategory") === "undefined"){
    sessionStorage.setItem("recipesCategory", "Breakfast");
    selection = "Breakfast";
} else {
    selection = sessionStorage.getItem("recipesCategory");
}

// Event Listeners for setting the title and the button functionality
const title = document.getElementById("recipesTitle");
title.innerHTML = selection + " Recipes";

const blur = document.getElementById( `blur` );
const newRecipeBtn = document.getElementById("newRecipeBtn");
const addToListBtn = document.getElementById("addToListBtn");
const newRecipePopup = document.getElementById( `new-recipe-popup` );
const addToListPopup = document.getElementById( `add-to-list-popup` );
const editRecipePopup = document.getElementById( `edit-recipe-popup` );
const deleteRecipePopup = document.getElementById( `delete-recipe-popup` );

const newRecipeCloseButton = document.getElementById( `new-recipe-close-button` );
const newRecipeSubmitButton = document.getElementById( `new-recipe-submit-button` ); 
const addToListCloseButton = document.getElementById( `add-to-list-close-button` );
const addToListSubmitButton = document.getElementById( `add-to-list-submit-button` );
const editRecipeCloseButton = document.getElementById( `edit-recipe-close-button` );
const editRecipeSubmitButton = document.getElementById( `edit-recipe-submit-button` );
const deleteRecipeCloseButton = document.getElementById( `delete-recipe-close-button` );
const deleteRecipeSubmitButton = document.getElementById( `delete-recipe-submit-button` );

const newRecipeNameField = document.getElementById( `new-recipe-name-textbox` );
const newRecipeTypeField = document.getElementById( `recipe-type-dropdown` );
const editRecipeNameField = document.getElementById( `edit-recipe-name-textbox` );
const deleteRecipeMessage = document.getElementById( `delete-recipe-message` );
const editRecipeItemList = document.getElementById( `edit-recipe-item-list` );
const addToListDropdown = document.getElementById(`add-to-list-dropdown`);

const recipeBox = document.getElementById( `recipe-box` );

let recipeToDelete;
let recipeToEdit;

// Populate with data
populateRecipeBox();
popuplatePopupListDropdown();

// blurring function
function blurToggle() {
    blur.classList.toggle( `active` );
}

// new recipe popup function
function newRecipeToggle() {
    newRecipePopup.classList.toggle( `active` );
}

// add to list popup function
function addToListToggle() {
    addToListPopup.classList.toggle( `active` );
}

// edit recipe popup function
function editRecipeToggle() {
    editRecipePopup.classList.toggle( `active` );
}

// delete recipe popup function
function deleteRecipeToggle() {
    deleteRecipePopup.classList.toggle( `active` );
}

newRecipeBtn.addEventListener("click", (e) => {
    // is the background blurred?
    let blurred = blur.classList.contains( `active` );
    // is the new recipe popup displayed?
    let newRecipeDisplayed = newRecipePopup.classList.contains( `active` );

    // if the screen ISN'T blurred and the new recipe popup ISN'T displayed,
    if ( !blurred && !newRecipeDisplayed ) {
        // blur the screen
        blurToggle();
        // and display the add item popup.
        newRecipeToggle();
    }

    // otherwise, don't do anything.
    else {
        e.preventDefault();
    }

    // don't let the event bubble to the parent containers!
    e.stopPropagation();
});


addToListBtn.addEventListener("click", (e) => {
    let blurred = blur.classList.contains( `active` );
    let addToListDisplayed = addToListPopup.classList.contains( `active` );

    // If no recipes checked, don't do anything
    let checked = getCheckedIds();

    if ( !blurred && !addToListDisplayed && checked.length > 0) {
        blurToggle();
        addToListToggle();
    } else {
        e.preventDefault();
    }

    e.stopPropagation();
});

newRecipeCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    newRecipeToggle();
    e.stopPropagation();
});

addToListCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    addToListToggle();
    e.stopPropagation();
});

editRecipeCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    editRecipeToggle();
    e.stopPropagation();
    let itemsInEdit = document.querySelectorAll( ".item-to-edit" );
    itemsInEdit.forEach( item => {
        item.remove();
    });
});

deleteRecipeCloseButton.addEventListener( `click`, (e) => {
    blurToggle();
    deleteRecipeToggle();
    e.stopPropagation();
});

newRecipeSubmitButton.addEventListener( `click`, (e) => {
    const recipe = new Object();
    recipe.name = newRecipeNameField.value;
    sessionStorage.setItem( `recipesCategory`, newRecipeTypeField.value );
    recipeAPI.createRecipe( newRecipeTypeField.value, recipe ).then ( () => {
        newRecipeNameField.value = ``;
        clearRecipeBox();
        populateRecipeBox();
        blurToggle();
        newRecipeToggle();
        document.location = "/recipes";
    });
});

addToListSubmitButton.addEventListener( `click`, (e) => {
    let currentSelected = false;
    if(addToListDropdown.value == "Current"){
        currentSelected = true;
    }
    
    let listId = addToListDropdown.value;
    let recipes = getCheckedIds();
    var itemsToAdd = [];

    getItems(recipes, itemsToAdd).then(res => {
        console.log("Items to add: " + JSON.stringify(itemsToAdd));
        // TO-DO: Check if item is already in current list and ask user if they would still like to add
        if(currentSelected){
            currentListAPI.addItems(itemsToAdd).then(res => {
                document.location = "/currentlist";
            }).catch(err => {
                console.log(err);
            });
        } else {
            listAPI.addItems(listId, itemsToAdd).then(res => {
                document.location = "/lists";
            }).catch(err => {
                console.log(err);
            });
        }
        
    });
});

// Had to wrap the iteration in a promise to wait for all items to be retrieved. 
// For selecting recipes and adding to a list
function getItems(ids, itemsToAdd){
    let category = sessionStorage.getItem("recipesCategory");
    return new Promise((resolve, reject) => {
        for(let i = 0; i < ids.length; i++){
            recipeAPI.getRecipeItems(category, ids[i]).then(res => {
                let index = i;
                let items = res;
                console.log("Response from getting recipe items: " + JSON.stringify(res));
                itemsToAdd.push.apply(itemsToAdd, items);
                
                // If last id in the list, resolve.
                if(index == ids.length - 1){
                    resolve();
                }
            });
        }
    });
}

editRecipeSubmitButton.addEventListener( `click`, (e) => {
    const recipe = new Object();
    recipe.id = recipeToEdit.id;
    recipe.name = editRecipeNameField.value;
    let items = document.querySelectorAll( ".item-to-edit" );
    recipeAPI.editRecipe( sessionStorage.getItem( 'recipesCategory' ), recipeToEdit.id, recipe ).then( () => {
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
        recipeAPI.editItems( recipeToEdit.id, itemsToEdit ).then( () => {
            recipeToEdit = {};
            clearRecipeBox();
            populateRecipeBox();
            blurToggle();
            editRecipeToggle();
        });
    });

    let itemsInEdit = document.querySelectorAll( ".item-to-edit" );
    itemsInEdit.forEach( item => {
        item.remove();
    });
});

deleteRecipeSubmitButton.addEventListener( `click`, (e) => {
    recipeAPI.deleteRecipe( sessionStorage.getItem( 'recipesCategory' ), recipeToDelete ).then(res => {
        recipeToDelete = ``;
        clearRecipeBox();
        populateRecipeBox();
        blurToggle();
        deleteRecipeToggle();
        deleteRecipeMessage.innerHTML = ``;
    }).catch(err => {
        console.log("Error when deleting list: " + err);
    });
});

// Get the list of checked recipes for adding to list
function getCheckedIds(){
    const checked = document.querySelectorAll( "input[type='checkbox']:checked" );
    const checkedItems = [];
    checked.forEach( check => {
        checkedItems.push( check.value );
    } );
    console.log( "Checked:\n" + checkedItems );
    return checkedItems;
}

// Can't return HTML elements so construct body to send to backend
function getRecipeInfoBody(row){
    let recipe = {
        name: ""
    }
    row.childNodes.forEach(child => {
        if(child.classList.contains("item-name")){
            recipe.name = child.innerHTML;
        }
    });
    return JSON.stringify(recipe);
}

function clearRecipeBox() {
    recipeBox.innerHTML = ``;
}

function populateRecipeBox() {
    recipeAPI.getRecipes(selection.toLowerCase()).then( recipes => {
        var itemBox = document.getElementById( "recipe-box" );
        recipes.forEach( recipe => {
            appendRecipe( recipe );
        });
    }).catch(err =>{
        console.log(err);
    });
}

function appendRecipe( recipe ) {
    // Create a new content row div
    var contentRow = document.createElement('div');
    contentRow.classList.add('content-row');
    contentRow.id = recipe.name + "CR";

    // Create checkbox div
    var checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');

    // Create and set checkbox input field with a value
    var checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.value = recipe.id;
    checkbox.appendChild(checkboxInput);

    contentRow.appendChild(checkbox);

    // Create item name div
    var itemName = document.createElement('div');
    itemName.classList.add('item-name');
    itemName.innerHTML = recipe.name;
    contentRow.appendChild(itemName);

    // Create details button div
    var detailsButton = document.createElement('div');
    detailsButton.classList.add('details-button');
    detailsButton.innerHTML = '<button id="' + recipe.name + 'VDB">View Details</button>';
    contentRow.appendChild(detailsButton);

    // Create edit button div
    var editButton = document.createElement('div');
    editButton.classList.add('edit-button');
    editButton.innerHTML = '<button>Edit</button>';
    contentRow.appendChild(editButton);

    addEditEventListener( editButton, recipe );

    // Create delete button div
    var deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<button>Delete</button>';
    contentRow.appendChild(deleteButton);

    deleteButton.addEventListener('click', (e) => {
        deleteRecipeMessage.innerHTML += `"${ recipe.name }"?`;
        recipeToDelete = recipe.id;
        let blurred = blur.classList.contains( `active` );
        let deleteRecipeDisplayed = deleteRecipePopup.classList.contains( `active` );

        if ( !blurred && !deleteRecipeDisplayed ) {
            blurToggle();
            deleteRecipeToggle();
        } else {
            e.preventDefault();
        }

        e.stopPropagation();
    });

    // Append the content row to the document
    recipeBox.appendChild(contentRow);

    //create content for details
    var details = document.createElement( 'div' );
    details.classList.add( 'content-row' );
    var detailsList = document.createElement( 'div' );
    detailsList.classList.add( 'item-name' );
    var list = document.createElement( 'ul' );

    recipeAPI.getRecipeItems( selection.toLowerCase(), recipe.id ).then( items => {
        if(items.length == 0){
            let msg = document.createElement('label');
            msg.innerHTML = "This recipe has no items."
            list.append(msg);
        } else {
            items.forEach( item => {
                let el = document.createElement( 'li' );
                el.classList.add( 'item-VD' );
                el.textContent = item.name + ' - ' + item.quantity;
                list.appendChild( el );
            } );
        } 
    });
  
    details.style.display = "none";
    details.style.borderTopWidth = "0px";
    details.id = 'details-' + recipe.name + 'VDB';
    detailsList.appendChild( list );
    detailsList.style.marginLeft = "2%";
    details.appendChild( detailsList );
    recipeBox.appendChild( details );
    contentRow.style.transition = "0s";

    //add event listener on view details button
    let viewDetails = document.getElementById( recipe.name + 'VDB' );
    viewDetails.addEventListener( 'click', function() {
        console.log('click');
        console.log(document.getElementById( 'details-' + this.id));
        if ( document.getElementById( 'details-' + this.id).style.display == "none" ) {
            document.getElementById( 'details-' + this.id).style.display = "block";
            document.getElementById( recipe.name + 'CR' ).style.borderBottomWidth = "0px";
            console.log('block');
        }
        else {
            document.getElementById( 'details-' + this.id).style.display = "none";
            document.getElementById( recipe.name + 'CR' ).style.borderBottomWidth = "1px";
            console.log('none');
        }
    });
}

function addEditEventListener( button, recipe ) {
    button.addEventListener( `click`, (e) => {
        recipeToEdit = {id: recipe.id, name: recipe.name};

        let blurred = blur.classList.contains( `active` );
        let editPopupDisplayed = editRecipePopup.classList.contains( `active` );

        if ( !blurred && !editPopupDisplayed ) {
            blurToggle();
            editRecipeToggle();
            populateItemList(editRecipeItemList);
        } else {
            e.preventDefault();
        }

        e.stopPropagation();
    });
}

function popuplatePopupItemList( itemList, items ) {
    for( const item of items ) {
        // create the li
        let listItem = document.createElement( `li` );

        // create and add the checkbox and its label
        listItem.innerHTML += item.name + ": ";

        // create and add the quantity amount
        let quantityInput = document.createElement( `input` );
        quantityInput.type = `text`;
        quantityInput.value = item.quantity;
        quantityInput.classList.add( "item-to-edit" );
        quantityInput.id = item.id + "-" + item.name;
        listItem.appendChild( quantityInput );

        itemList.appendChild( listItem );

        listItem.classList.add( "items-for-edit" );
    }
}

//Populate the edit list popup with the items
function populateItemList( container ) {
    editRecipeNameField.value = recipeToEdit.name;
    recipeAPI.getRecipeItems(sessionStorage.getItem("recipesCategory"), recipeToEdit.id).then(items => {
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

function popuplatePopupListDropdown( lists ) {
    listAPI.getLists().then(lists => {
        for( const list of lists ) {
            // create the li
            let option = document.createElement( `option` );
            option.value = list.id;
            option.innerHTML = list.name;
    
            addToListDropdown.appendChild( option );
        }
    });
}