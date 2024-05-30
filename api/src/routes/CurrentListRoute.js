const express = require('express');
const cookieParser = require('cookie-parser');
const currentListRouter = express.Router();
const ListDAO = require("../db/ListDAO.js");

currentListRouter.use(express.json());
currentListRouter.use(cookieParser());

const {TokenMiddleware} = require('./middleware/TokenMiddleware.js');

const current = "Current";

currentListRouter.get('/currentLists', TokenMiddleware, (req,  res) => {
    ListDAO.getListByName(req.user.id, current).then(list => {
        ListDAO.getListItems(req.user.id, list.id).then(items => {
            console.log("Get current list response: " + JSON.stringify(items));
            res.json(items);
        }).catch(err =>{
            console.log("Get current list error: " + JSON.stringify(err));
            res.json({error: err});
        });
    }).catch(err =>{
        console.log("Get current list id error in get request: " + JSON.stringify(err));
        res.json({error: err});
    });
});

currentListRouter.post('/currentLists/items', TokenMiddleware, (req,  res) => {
    ListDAO.getListByName(req.user.id, current).then(list => {
        ListDAO.addItems(req.user.id, list.id, req.body).then(items => {
            console.log("Post current list items response: " + JSON.stringify(items));
            res.json(items);
        }).catch(err =>{
            console.log("Post current list items error: " + JSON.stringify(err));
            res.json({error: err});
        });
    }).catch(err =>{
        console.log("Get current list id error in post request: " + JSON.stringify(err));
        res.json({error: err});
    });
});

currentListRouter.put('/currentLists/items/:item', TokenMiddleware, (req,  res) => {
    ListDAO.getListByName(req.user.id, current).then(list => {
        ListDAO.editItem(req.user.id, list.id, req.params.item, req.body).then(item =>{
            console.log("Put current list item response: " + JSON.stringify(list));
            res.json(item);
        }).catch(err =>{
            console.log("Put current list item error: " + JSON.stringify(err));
            res.json({error: err});
        });
    }).catch(err =>{
        console.log("Get current list id error in put request: " + JSON.stringify(err));
        res.json({error: err});
    });
});

currentListRouter.delete('/currentLists/items', TokenMiddleware, (req,  res) => {
    ListDAO.getListByName(req.user.id, current).then(list => {
        ListDAO.deleteItems(req.user.id, list.id, req.body).then(msg =>{
            console.log("Delete current list items response: " + msg);
            res.json(msg);
        }).catch(err =>{
            console.log("Delete current list items error: " + JSON.stringify(err));
            res.json({error: err});
        });
    }).catch(err =>{
        console.log("Get current list id error in delete request: " + JSON.stringify(err));
        res.json({error: err});
    });
    
});

module.exports = currentListRouter;