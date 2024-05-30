import HTTPClient from './HTTPClient.js';
  
export default {
    // userParam can be "current" to get the currently authenticated user or any user's ID
    getUser: (userParam) => {
      return HTTPClient.get(`/api/users/${userParam}`).then(user => {
        console.log(user);
        return user;
      });
    },

    createUser: (userBody) => {
      return HTTPClient.post('/api/users', userBody).then(user => {
        console.log("User: " + JSON.stringify(user));
        return user;
      }).catch(err => {
        throw new Error(JSON.stringify(err));
      });
    },

    editUser: (userId, userBody) => {
      return HTTPClient.put(`/api/users/${userId}`, userBody).then(user => {
        console.log(user);
        return user;
      });
    },

    deleteUser: (userId) => {
      return HTTPClient.delete(`/api/users/${userId}`).then(user => {
        console.log(user);
        return user;
      });
    },

    login: (userBody) => {
      return HTTPClient.post('/api/users/login', userBody).then(user => {
        console.log(user);
        return user;
      }).catch(err => {
        throw new Error(err);
      });
    },

    logout: () => {
      return HTTPClient.post('/api/users/logout', {}).then(user => {
        console.log(user);
        return user;
      }).catch(err => {
        throw new Error(err);
      });
    }
  };
  