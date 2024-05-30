import HTTPClient from './HTTPClient.js';

export default {
    getItems: () => {
      return HTTPClient.get('/api/items').then(items => {
        console.log(items);
        return items;
      });
    },

    createItem: (itemBody) => {
        return HTTPClient.post('/api/items', itemBody).then(item => {
          console.log(item);
          return item;
        });
    },

    editItem: (itemId, itemBody) => {
        return HTTPClient.put(`api/items/${itemId}`, itemBody).then(item => {
          console.log(item);
          return item;
        });
    },

    deleteItems: (itemsList) => {
        return HTTPClient.deleteList(`/api/items`, itemsList).then(items => {
          console.log(items);
          return items;
        });
    },

}