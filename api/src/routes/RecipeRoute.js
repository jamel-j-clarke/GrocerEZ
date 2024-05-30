const express = require('express');
const cookieParser = require('cookie-parser');
const recipeRouter = express.Router();
const RecipeDAO = require("../db/RecipeDAO.js");

recipeRouter.use(express.json());
recipeRouter.use(cookieParser());

const {TokenMiddleware} = require('./middleware/TokenMiddleware.js');

recipeRouter.get('/recipes/:category', TokenMiddleware, (req,  res) => {
    RecipeDAO.getRecipes(req.user.id, req.params.category).then(recipes =>{
        console.log("Get recipes response: " + JSON.stringify(recipes));
        res.json(recipes);
    }).catch(err =>{
        console.log("Get recipes error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.get('/recipes/:category/:recipe', TokenMiddleware, (req,  res) => {
    RecipeDAO.getRecipeById(req.user.id, req.params.recipe).then(recipe =>{
        console.log("Get recipe response: " + JSON.stringify(recipe));
        res.json(recipe);
    }).catch(err =>{
        console.log("Get recipe error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.post('/recipes/:category', TokenMiddleware, (req,  res) => {
    RecipeDAO.createRecipe(req.user.id, req.params.category, req.body).then(recipe =>{
        console.log("Post recipe response: " + JSON.stringify(recipe));
        res.json(recipe);
    }).catch(err =>{
        console.log("Post recipes error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.put('/recipes/:category/:recipe', TokenMiddleware, (req,  res) => {
    RecipeDAO.editRecipe(req.user.id, req.params.recipe, req.body).then(recipe =>{
        console.log("Put recipe response: " + JSON.stringify(recipe));
        res.json(recipe);
    }).catch(err =>{
        console.log("Put recipe error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.delete('/recipes/:category/:recipe', TokenMiddleware, (req,  res) => {
    RecipeDAO.deleteRecipe(req.user.id, req.params.recipe).then(recipe =>{
        console.log("Delete recipe response: " + JSON.stringify(recipe));
        res.json(recipe);
    }).catch(err =>{
        console.log("Delete recipe error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.get('/recipes/:category/:recipe/items', TokenMiddleware, (req,  res) => {
    RecipeDAO.getRecipeItems(req.user.id, req.params.recipe).then(list =>{
        console.log("Get recipe items response: " + JSON.stringify(list));
        res.json(list);
    }).catch(err =>{
        console.log("Get recipe items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.post('/recipes/category/:recipe/items', TokenMiddleware, (req,  res) => {
    RecipeDAO.addItems(req.user.id, req.params.recipe, req.body).then(recipe =>{
        console.log("Post recipe items response: " + JSON.stringify(recipe));
        res.json(recipe);
    }).catch(err =>{
        console.log("Post recipe items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.put('/recipes/category/:recipe/items/:item', TokenMiddleware, (req,  res) => {
    RecipeDAO.editItem(req.user.id, req.params.recipe, req.params.item, req.body).then(item =>{
        console.log("Put recipe item response: " + JSON.stringify(item));
        res.json(item);
    }).catch(err =>{        
        console.log("Put recipe items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.put('/recipes/category/:recipe/items', TokenMiddleware, (req,  res) => {
    RecipeDAO.editItems(req.user.id, req.params.recipe, req.body).then(items =>{
        console.log("Put recipe item response: " + JSON.stringify(items));
        res.json(items);
    }).catch(err =>{        
        console.log("Put recipe items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

recipeRouter.delete('/recipes/category/:recipe/items', TokenMiddleware, (req,  res) => {
    RecipeDAO.deleteItems(req.user.id, req.params.recipe, req.body).then(msg =>{        
        console.log("Delete recipe items response: " + JSON.stringify(msg));
        res.json(msg);
    }).catch(err =>{        
        console.log("Delete recipe items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});


module.exports = recipeRouter;