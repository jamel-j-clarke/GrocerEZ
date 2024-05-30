import HTTPClient from './HTTPClient.js';
  
export default {
    getCurrentList: () => {
        return HTTPClient.get('/api/currentLists').then(list => {
          console.log(list);
          return list;
        });
    },

    addItems: (itemsList) => {
        return HTTPClient.post('/api/currentLists/items', itemsList).then(list => {
          console.log(list);
          return list;
        });
    },

    editItem: (itemId, itemBody) => {
        return HTTPClient.put(`/api/currentLists/items/${itemId}`, itemBody).then(item => {
          console.log(item);
          return item;
        });
    },

    deleteItems: (itemsList) => {
        return HTTPClient.deleteList('/api/currentLists/items', itemsList).then(list => {
          return list;
        });
    }
  
};
  