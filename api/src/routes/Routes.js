const express = require('express');
const listRouter = require('./ListRoute');
const currentListRouter = require('./CurrentListRoute');
const recipeRouter = require('./RecipeRoute');
const userRouter = require('./UserRoute');
const itemRouter = require('./ItemRoute');
const routes = express.Router();

routes.use(listRouter);
routes.use(currentListRouter);
routes.use(recipeRouter);
routes.use(userRouter);
routes.use(itemRouter);

module.exports = routes;