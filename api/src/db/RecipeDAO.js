const db = require('./DBConnection');
const Recipe = require('./models/Recipe');
const Item = require('./models/Item');
const ItemDAO = require('./ItemDAO');

function getRecipes(userId, categoryName) {
    return db.query('SELECT * FROM recipe JOIN user_recipe ON ure_rec_id=rec_id WHERE ure_usr_id=? AND rec_cat=?', [userId, categoryName]).then(({results}) => {
        if(results[0]){
            return results.map(recipe => new Recipe(recipe));
        } else {
            console.log(`No recipes found for user ${userId}`);
            return [];
        }
    });
}

function getRecipeByName(userId, categoryName, recipeName) {
    return db.query('SELECT * FROM recipe JOIN user_recipe ON ure_rec_id=rec_id WHERE ure_usr_id=? AND rec_cat=? AND rec_name=?', [userId, categoryName, recipeName]).then(({results}) => {
        if(results[0]){
            return new Recipe(results[0]);
        } else {
            console.log(`No recipe found for user: ${userId} in category: ${categoryName} with name: ${recipeName}`);
            throw new Error(`No recipe found for user: ${userId} in category: ${categoryName} with name: ${recipeName}`);
        }
    });
}

function getRecipeById(userId, recipeId){
    return db.query('SELECT * FROM recipe JOIN user_recipe ON ure_rec_id=rec_id WHERE rec_id=? AND ure_usr_id=?', [recipeId, userId]).then(({results}) => {
        if(results[0]){
            return new Recipe(results[0]);
        } else {
            console.log(`No recipe found for user: ${userId} with id: ${recipeId}`);
            throw new Error(`No recipe found for user: ${userId} with id: ${recipeId}`);
        }
    });
}

function createRecipe(userId, categoryName, recipeParam){
    if(!recipeParam.name || !categoryName || !userId){
        throw new Error("Missing information");
    }
    let category = categoryName.toLowerCase();
    return db.query('INSERT INTO recipe (rec_name, rec_cat) VALUES (?, ?)', [recipeParam.name, category]).then(({results}) => {
        let recipeId = results.insertId;
        return db.query('INSERT INTO user_recipe (ure_rec_id, ure_usr_id) VALUES (?, ?)', [recipeId, userId]).then(({results}) => {
            return this.getRecipeById(userId, recipeId);

        });
    });
}

function editRecipe(userId, recId, recipeParam){
    if(!recipeParam.name){
        throw new Error("Missing recipe name");
    } else {
        return db.query('SELECT * FROM user_recipe WHERE ure_rec_id=? AND ure_usr_id=?', [recId, userId]).then(({results}) => {
            if(results[0]){
                return db.query('UPDATE recipe SET rec_name=? WHERE rec_id=?', [recipeParam.name, recId]).then(({results}) => {
                    return recipeParam.name;
                });
            } else {
                throw new Error("Recipe does not exist for user");
            }
        });
    }
}

function deleteRecipe(userId, recId) {
    return new Promise((resolve, reject) => {
        this.getRecipeItems(userId, recId).then(items => {
            // Delete from recipe_item and item
            let itemsToDelete = items.map(item => item.id);
            this.deleteItems(userId, recId, itemsToDelete).then(res => {
                // Delete from user to recipe table
                db.query('DELETE FROM user_recipe WHERE ure_rec_id=? AND ure_usr_id=?', [recId, userId]).then(({results})=> {
                    if(!results){
                        console.log(`Recipe not found in user_recipe user=${userId} and recipe=${recId}`);
                        reject(`Recipe not found in user_recipe user=${userId} and recipe=${recId}`);
                    } else {
                        console.log(`Recipe removed from user_recipe`);
                        // Delete from list table
                        resolve(db.query('DELETE FROM recipe WHERE rec_id=?', [recId]));
                    }
                });
                
            }).catch(err => {
                console.log("Error during item deletion.");
                reject("Error during item deletion.");
            });
        }).catch(err => {
            console.log(`No items found for list=${listId}`);
            db.query('DELETE FROM user_recipe WHERE ure_rec_id=? AND ure_usr_id=?', [recId, userId]).then(({results})=> {
                if(!results){
                    console.log("Recipe not found in user_recipe");
                    reject(`Recipe not found in user_recipe user=${userId} and recipe=${recId}`);
                } else {
                    console.log("Recipe removed from user_recipe");
                    resolve(db.query('DELETE FROM recipe WHERE rec_id=?', [recId]));
                }
            });
            
        });
    });
}

function getRecipeItems(userId, recId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM item JOIN recipe_item ON rei_it_id=it_id JOIN user_recipe ON ure_rec_id=rei_rec_id WHERE ure_usr_id=? AND ure_rec_id=?',
            [userId, recId]).then(({results}) => {
                if(results[0]){
                    resolve(results.map(item => new Item(item)));
                } else {
                    console.log(`No Recipe Items found for user: ${userId} and recipe: ${recId}`);
                    resolve([]);
                }
        });
    });
}

function addItems(userId, recId, itemListParam) {
    return new Promise((resolve, reject) =>{
        let newItems = [];
        for(let i = 0; i < itemListParam.length; i++){
            let item = itemListParam[i];
            ItemDAO.createItem(userId, item).then( newItem => {
                db.query('INSERT INTO recipe_item (rei_rec_id, rei_it_id) VALUES (?, ?)',
                    [recId, newItem.id]).then(({results}) => {
                    newItems.push(newItem);
                }).catch(err => {
                    console.log("Error adding creating new item" + err);
                    reject("Error creating new item");
                });
            });
        }
        resolve(newItems);
    });
}

function editItem(userId, recId, itemId, itemParam) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user_recipe WHERE ure_usr_id=? AND ure_rec_id=?', [userId, recId]).then(({results}) => {
            // Make sure the user owns the recipe
            if(results[0]){
                // Make sure the item id is in the recipe
                db.query('SELECT * FROM recipe_item WHERE rei_rec_id=? AND rei_it_id=?', [recId, itemId]).then(({results}) => {
                    if(results[0]){
                        console.log("QUAN: " + itemParam.quantity );
                        if( itemParam.quantity == 0 ) {
                            // If quantity is 0, remove from recipe
                            resolve(this.deleteItemFromRecipe(recId, itemId));
                        } else {
                            // Edit item
                            resolve(ItemDAO.editItem(userId, itemId, itemParam));
                        }
                    } else {
                        reject(`Item ${itemId} not found in recipe ${recId}`);
                    }
                });
            } else {
                reject(`User ${userId} does not have that recipe ${recId}`);
            }
        });
    });
}

function editItems(userId, recId, itemList) {
    return new Promise((resolve, reject) => {
        let editedItems = [];
        for(let i = 0; i < itemList.length; i++){
            if(!itemList[i].id){
                reject("Missing Information");
            } else {
                this.editItem(userId, recId, itemList[i].id, itemList[i]).then(item => {
                    if(itemList[i].quantity != 0){
                        editedItems.push(item);
                    }
                });            }
        }
        resolve(editedItems);
    });
}

function deleteItems(userId, recId, itemsToDeleteParam) {
    console.log("Items to delete: " + itemsToDeleteParam);
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user_recipe WHERE ure_usr_id=? AND ure_rec_id=?', [userId, recId]).then(({results}) => {
            if(results[0]){
                console.log("Results: " + JSON.stringify(results[0]));
                for(let i = 0; i < itemsToDeleteParam.length; i++){
                    console.log("Item id to delete: " + itemsToDeleteParam[i]);
                    // Delete from the table mapping recipe to items
                    this.deleteItemFromRecipe(recId, itemsToDeleteParam[i]);
                }
                resolve({message: "Successful deletion"});
            } else {
                console.log("Recipe does not exist");
                reject("Recipe does not exist");
            }
        });
    });
}

function deleteItemFromRecipe(recId, itemId) {
    return new Promise((resolve, reject) => {
        return db.query('DELETE FROM recipe_item WHERE rei_it_id=? AND rei_rec_id=?', [itemId, recId]).then(({results}) => {
            console.log(results);
            if(results){
                // Delete from items table if the item was removed from list
                resolve(ItemDAO.deleteItemById(itemId));
            } else {
                console.log(`Item not found for recipe: ${recId} and item: ${itemId}`);
                reject(`Item not found for recipe: ${recId} and item: ${itemId}`);
            }
        });
    });
}
    
module.exports = {
    getRecipeById: getRecipeById,
    getRecipeByName: getRecipeByName,
    getRecipeItems: getRecipeItems,
    getRecipes: getRecipes,
    createRecipe: createRecipe,
    addItems:addItems,
    editRecipe: editRecipe,
    editItem: editItem,
    editItems: editItems,
    deleteItemFromRecipe:deleteItemFromRecipe,
    deleteItems:deleteItems,
    deleteRecipe:deleteRecipe
};