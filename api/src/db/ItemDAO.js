const db = require('./DBConnection');
const Item = require('./models/Item');

function getItemById(itemId) {
    return db.query('SELECT * FROM item WHERE it_id=?', [itemId]).then(({results}) => {
        if(results[0]){
            console.log( "Item retrieved:" + JSON.stringify( new Item( results[0] ) ) );
            return new Item(results[0]);
        } else {
            console.log(`No item found for id: ${itemId}`);
        }
    });
}

function createItem(userId, item) {
    return new Promise((resolve, reject) => {
        if(!item.name || !item.quantity || !userId){
            console.log("Missing information");
            reject("Missing information");
        }
        console.log( `New item to create: ${JSON.stringify( item )} for user: ${userId}`);
        db.query('INSERT INTO item (it_name, it_qt) VALUES (?, ?)',
            [item.name, item.quantity]).then(({results}) => {
                let newItemId = results.insertId;
                console.log("New item id: " + newItemId);
                db.query('INSERT INTO user_item (uit_usr_id, uit_it_id) VALUES (?, ?)',
                    [userId, newItemId]).then(({results}) => {
                        resolve(this.getItemById( newItemId ));
            });
        });
    });
}

function editItem(userId, itemId, itemParam) {
    return new Promise((resolve, reject) => {
        if(!itemParam.name || !itemParam.quantity) {
            reject("Missing item information");
        } else {
            db.query('SELECT * FROM user_item WHERE uit_usr_id=? AND uit_it_id=?', [userId, itemId]).then(({results}) => {
                if(results[0]){
                    // If the item is the user's, update
                    db.query('UPDATE item SET it_name=?, it_qt=? WHERE it_id=?', [itemParam.name, itemParam.quantity, itemId]).then(({results}) => {
                        console.log("Put result: " + results[0]);
                        resolve(this.getItemById(itemId));
                    });            
                } else {
                    reject("Item not found in user_item");
                }
            });
        }
    })
}

function deleteItems(itemsToDelete) {
    let items = [];
    for(let i = 0; i < itemsToDelete.length; i++){
        // Delete from Items table
        items.push(this.deleteItemById(itemsToDelete[i]));
    }
    return items;
}

function deleteItemById(itemId) {
    return db.query('DELETE FROM user_item WHERE uit_it_id=?', [itemId]).then(({results}) => {
        if(results){
            return db.query('DELETE FROM item WHERE it_id=?', [itemId]).then(({results}) => {
                return results;
            });
        } else {
            console.log("Item not found in user_item");
            throw new Error("Item not found in user_item");
        }
    });
}


module.exports = {
    getItemById: getItemById,
    createItem:createItem,
    editItem:editItem,
    deleteItemById:deleteItemById,
    deleteItems:deleteItems
};

