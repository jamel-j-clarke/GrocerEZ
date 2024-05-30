let headersJson = {"Accept":"application/json", "Content-Type":"application/json"};

export default {
    
    get: (url) => {
      return fetch(url).then(res => {
        if(!res.ok){
          throw new Error('Error in get request');
        }
        return res.json();
      });
    },

    post: (url, postBody) => {
      return fetch(url, {method: "POST", headers: headersJson, body:JSON.stringify(postBody)}).then(res => {
        if(!res.ok){
          console.log("Error status: " + JSON.stringify(res.status));
          console.log("Response body: " + JSON.stringify(res.body));
          throw new Error(JSON.stringify(res.statusText));
        }
        console.log("Response: " + JSON.stringify(res));
        return res.json();
      });
    },

    put: (url, putBody) => {
      return fetch(url, {method: "PUT", headers: headersJson, body:JSON.stringify(putBody)}).then(res => {
        if(!res.ok){
          throw new Error('Error in put request');
        }
        return res.json();
      });
    },

    delete: (url) =>{
      return fetch(url, {method: "DELETE", headers: headersJson}).then(res => {
        if(!res.ok){
          throw new Error('Error in delete request');
        }
        return res.json();
      });
    },

    deleteList: (url, listBody) => {
        return fetch(url, {method: "DELETE", headers: headersJson, body:JSON.stringify(listBody)}).then(res => {
          if(!res.ok){
            throw new Error('Error in delete request');
          }
          return res.json();
        });
    }
  }