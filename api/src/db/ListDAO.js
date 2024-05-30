const db = require('./DBConnection');
const List = require('./models/List');
const Item = require('./models/Item');
const ItemDAO = require('./ItemDAO');


function getLists(userId) {
    return db.query('SELECT * FROM list JOIN user_list ON ul_lis_id=lis_id WHERE ul_usr_id=? AND NOT lis_name = "Items" AND NOT lis_name = "Current"', [userId]).then(({results}) => {
        if(results[0]){
            return results.map(list => new List(list));
        } else {
            console.log(`No lists found for user: ${userId}`);
            return [];
        }
    });
}

function getListByName(userId, listName) {
    return db.query('SELECT * FROM list JOIN user_list ON ul_lis_id=lis_id WHERE ul_usr_id=? AND lis_name=?', [userId, listName]).then(({results}) => {
        if(results[0]){
            return new List(results[0]);
        } else {
            console.log(`No list found for user: ${userId} with name: ${listName}`);
            throw new Error(`No list found for user: ${userId} with name: ${listName}`);
        }
    });
}

function getListById(userId, listId) {
    return db.query('SELECT * FROM list JOIN user_list ON ul_lis_id=lis_id WHERE lis_id=? AND ul_usr_id=?', [listId, userId]).then(({results}) => {
        if(results[0]){
            return new List(results[0]);
        } else {
            console.log(`No list found for user: ${userId} with id: ${listId}`);
            throw new Error(`No list found for user: ${userId} with id: ${listId}`);
        }
    });
}

function createList(userId, listParam) {
    if(!listParam || !userId){
        throw new Error(`Missing information: name=${ listParam } & user: ${ userId }`);
    }
    return db.query('INSERT INTO list (lis_name) VALUES (?)', [listParam]).then(({results}) => {
        let listId = results.insertId;
        return db.query('INSERT INTO user_list (ul_lis_id, ul_usr_id) VALUES (?, ?)', [listId, userId]).then(({results}) => {
            return this.getListById(userId, listId);
        });
    });
}

function editList(userId, listId, listParam) {
    if(!listParam.name){
        throw new Error("Missing list name");
    } else {
        return db.query('SELECT * FROM user_list WHERE ul_lis_id=? AND ul_usr_id=?', [listId, userId]).then(({results}) => {
            if(results[0]){
                return db.query('UPDATE list SET lis_name=? WHERE lis_id=?', [listParam.name, listId]).then(({results}) => {
                    return new List(results[0]);
                });
            } else {
                throw new Error("List does not exist for user");
            }
        });
    }
}

function deleteList(userId, listId) {
    return new Promise((resolve, reject) => {
        this.getListItems(userId, listId).then(items => {
            // Delete from list_item and item
            let itemsToDelete = items.map(item => item.id);
            this.deleteItems(userId, listId, itemsToDelete).then(res => {
                // Delete from user to list table
                db.query('DELETE FROM user_list WHERE ul_lis_id=? AND ul_usr_id=?', [listId, userId]).then(({results}) => {
                    if(!results){
                        console.log(`List not found in user_list user=${userId} and list=${listId}`);
                        reject(`List not found in user_list user=${userId} and list=${listId}`);
                    } else {
                        console.log(`List removed from user_list`);
                        // Delete from list table
                        resolve(db.query('DELETE FROM list WHERE lis_id=?', [listId]));
                    }
                });

                
            }).catch(err => {
                console.log("Error during item deletion.");
                reject("Error during item deletion.");
            });
        }).catch(err => {
            console.log(`No items found for list=${listId}`);
            db.query('DELETE FROM user_list WHERE ul_lis_id=? AND ul_usr_id=?', [listId, userId]).then(({results}) => {
                if(!results){
                    console.log(`List not found in user_list user=${userId} and list=${listId}`);
                    reject(`List not found in user_list user=${userId} and list=${listId}`);
                } else {
                    console.log(`List removed from user_list`);
                    resolve(db.query('DELETE FROM list WHERE lis_id=?', [listId]));
                }
            });
        });
    });
        
}

function addItems(userId, listId, itemListParam) {
    console.log("Adding " + JSON.stringify(itemListParam));
    return new Promise((resolve, reject) =>{
        let newItems = [];
        for(let i = 0; i < itemListParam.length; i++){
            let item = itemListParam[i];
            console.log("Item: " + item);
            ItemDAO.createItem(userId, item).then( newItem => {
                console.log( "New Item: " + JSON.stringify( newItem ));
                db.query('INSERT INTO list_item (lit_lis_id, lit_it_id) VALUES (?, ?)',
                [listId, newItem.id]).then(({results}) => {
                    newItems.push(newItem);
                });
            }).catch(err => {
                console.log("Error adding creating new item" + err);
                reject("Error creating new item");
            });
        }
        resolve(newItems);
    });
}

function getListItems(userId, listId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM item JOIN list_item ON lit_it_id=it_id JOIN user_list ON ul_lis_id=lit_lis_id WHERE ul_usr_id=? AND ul_lis_id=?',
        [userId, listId]).then(({results}) => {
            if(results[0]){
                resolve(results.map(item => new Item(item)));
            } else {
                console.log(`No List Items found for user: ${userId} and list: ${listId}`);
                resolve([]);
            }
        });
    });
    
}

function editItem(userId, listId, itemId, itemParam) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user_list WHERE ul_usr_id=? AND ul_lis_id=?', [userId, listId]).then(({results}) => {
            // Make sure the user owns the list
            if(results[0]){
                // Make sure the item id is in the list
                db.query('SELECT * FROM list_item WHERE lit_lis_id=? AND lit_it_id=?', [listId, itemId]).then(({results}) => {
                    console.log( results[ 0 ] );
                    if(results[0]){
                        if(itemParam.quantity == 0){
                            // If quantity is 0, remove from list
                            resolve(this.deleteItemFromList(listId, itemId));
                        } else {
                            // Edit item
                            resolve(ItemDAO.editItem(userId, itemId, itemParam));
                        }
                    } else {
                        reject(`Item ${itemId} not found in list ${listId}`);
                    }
                });
            } else {
                reject(`User ${userId} does not have that list ${listId}`);
            }
        });
    });
}

function editItems(userId, listId, itemList) {
    return new Promise((resolve, reject) => {
        let editedItems = [];
        for(let i = 0; i < itemList.length; i++){
            if(!itemList[i].id){
                reject("Missing Information");
            } else {
                this.editItem(userId, listId, itemList[i].id, itemList[i]).then(item => {
                    if(itemList[i].quantity != 0){
                        editedItems.push(item);
                    }
                });
            }
        }
        resolve(editedItems);
    });
}

function deleteItems(userId, listId, itemsToDeleteParam) {
    console.log("Items to delete: " + itemsToDeleteParam);
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user_list WHERE ul_usr_id=? AND ul_lis_id=?', [userId, listId]).then(({results}) => {
            if(results[0]){
                console.log("Results: " + JSON.stringify(results[0]));
                for(let i = 0; i < itemsToDeleteParam.length; i++){
                    console.log("Item id to delete: " + itemsToDeleteParam[i]);
                    // Delete from the table mapping recipe to items
                    this.deleteItemFromList(listId, itemsToDeleteParam[i]);
                }
                resolve({message: "Successful deletion"});
            } else {
                console.log("List does not exist");
                reject("List does not exist");
            }
        });
    });
}

function deleteItemFromList(listId, itemId) {
    return new Promise((resolve, reject) => {
        return db.query('DELETE FROM list_item WHERE lit_it_id=? AND lit_lis_id=?', [itemId, listId]).then(({results}) => {
            console.log(results);
            if(results){
                // Delete from items table if the item was removed from list
                resolve(ItemDAO.deleteItemById(itemId));
            } else {
                console.log(`Item not found for list: ${listId} and item: ${itemId}`);
                reject(`Item not found for list: ${listId} and item: ${itemId}`);
            }
        });
    });
}

module.exports = {
    getListById: getListById,
    getListByName:getListByName,
    getListItems:getListItems,
    getLists:getLists,
    createList:createList,
    addItems:addItems,
    editItem:editItem,
    editItems:editItems,
    editList:editList,
    deleteItemFromList:deleteItemFromList,
    deleteItems:deleteItems,
    deleteList:deleteList
};