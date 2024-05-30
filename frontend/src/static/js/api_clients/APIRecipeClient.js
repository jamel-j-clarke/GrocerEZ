import HTTPClient from './HTTPClient.js';
  
export default {
    getRecipes: (categoryName) => {
      return HTTPClient.get(`/api/recipes/${categoryName}`).then(recipes => {
        console.log(recipes);
        return recipes;
      });
    },

    getRecipe: (categoryName, recipeId) => {
        return HTTPClient.get(`/api/recipes/${categoryName}/${recipeId}`).then(recipe => {
          console.log(recipe);
          return recipe;
        });
    },

    createRecipe: (categoryName, recipeBody) => {
        return HTTPClient.post(`/api/recipes/${categoryName}`, recipeBody).then(recipe => {
          console.log(recipe);
          return recipe;
        });
    },

    editRecipe: (categoryName, recipeId, recipeBody) => {
        return HTTPClient.put(`/api/recipes/${categoryName}/${recipeId}`, recipeBody).then(recipe => {
          console.log(recipe);
          return recipe;
        });
    },

    deleteRecipe: (categoryName, recipeId) => {
        return HTTPClient.delete(`/api/recipes/${categoryName}/${recipeId}`).then(recipe => {
          console.log(recipe);
          return recipe;
        });
    },

    getRecipeItems: (categoryName, recipeId) => {
      return HTTPClient.get(`/api/recipes/${categoryName}/${recipeId}/items`).then(items => {
        console.log(items);
        return items;
      });
    },

    addItems: (recipeId, itemsList) => {
        return HTTPClient.post(`/api/recipes/category/${recipeId}/items`, itemsList).then(recipe => {
          console.log(recipe);
          return recipe;
        });
    },

    editItem: (recipeId, itemId, itemBody) => {
        return HTTPClient.put(`/api/recipes/category/${recipeId}/items/${itemId}`, itemBody).then(item => {
          console.log(item);
          return item;
        });
    },

    editItems: (recipeId, itemBody) => {
      return HTTPClient.put(`/api/recipes/category/${recipeId}/items`, itemBody).then(items => {
        console.log(items);
        return items;
      });
    },

    deleteItems: (recipeId, itemsList) => {
        return HTTPClient.deleteList(`/api/recipes/category/${recipeId}/items`, itemsList).then(recipe => {
          console.log(recipe);
          return recipe;
        });
    }
  
};
  