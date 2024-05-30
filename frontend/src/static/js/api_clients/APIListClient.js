import HTTPClient from './HTTPClient.js';
  
export default {
    getLists: () => {
      return HTTPClient.get('/api/lists').then(lists => {
        console.log(lists);
        return lists;
      });
    },

    getList: (listId) => {
        return HTTPClient.get(`/api/lists/${listId}`).then(list => {
          console.log(list);
          return list;
        });
    },

    createList: (listBody) => {
      console.log( `list body: ${ listBody.name }` );
        return HTTPClient.post('/api/lists', listBody).then(list => {
          console.log(list);
          return list;
        });
    },

    editList: (listId, listBody) => {
        return HTTPClient.put(`/api/lists/${listId}`, listBody).then(list => {
          console.log(list);
          return list;
        });
    },

    deleteList: (listId) => {
        return HTTPClient.delete(`/api/lists/${listId}`).then(list => {
          console.log(list);
          return list;
        });
    },

    getListItems: (listId) => {
        return HTTPClient.get(`/api/lists/${listId}/items`).then(items => {
          console.log(items);
          return items;
        });
    },

    addItems: (listId, itemsList) => {
        return HTTPClient.post(`/api/lists/${listId}/items`, itemsList).then(list => {
          console.log(list);
          return list;
        });
    },

    editItem: (listId, itemId, itemBody) => {
        return HTTPClient.put(`/api/lists/${listId}/items/${itemId}`, itemBody).then(item => {
          console.log(item);
          return item;
        });
    },

    editItems: (listId, itemBody) => {
      return HTTPClient.put(`/api/lists/${listId}/items`, itemBody).then(items => {
        console.log(items);
        return items;
      });
    },

    deleteItems: (listId, itemsList) => {
        return HTTPClient.deleteList(`/api/lists/${listId}/items`, itemsList).then(list => {
          console.log(list);
          return list;
        });
    }
  
};
  