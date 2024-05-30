const express = require('express');
const cookieParser = require('cookie-parser');
const itemRouter = express.Router();
const ListDAO = require("../db/ListDAO.js");

itemRouter.use(express.json());
itemRouter.use(cookieParser());

const {TokenMiddleware} = require('./middleware/TokenMiddleware.js');

const items = "Items";

itemRouter.get('/items', TokenMiddleware, (req,  res) => {
    ListDAO.getListByName(req.user.id, items).then(list => {
        ListDAO.getListItems(req.user.id, list.id).then(items => {
            console.log("Get items response: " + JSON.stringify(items));
            res.json(items);
        }).catch(err =>{
            console.log("Get items error: " + JSON.stringify(err));
            res.json({error: err});
        });
    }).catch(err =>{
        console.log("Get Items list id error in get request: " + JSON.stringify(err));
        res.json({error: err});
    });
});

itemRouter.post('/items', TokenMiddleware, (req,  res) => {
    ListDAO.getListByName(req.user.id, items).then(list => {
        ListDAO.addItems(req.user.id, list.id, req.body).then(item =>{
            console.log("Post items response: " + JSON.stringify(item));
            res.json(item);
        }).catch(err =>{
            console.log("Post items error: " + JSON.stringify(err));
            res.json({error: err});
        });
    }).catch(err =>{
        console.log("Get Items list id error in post request: " + JSON.stringify(err));
        res.json({error: err});
    });
});

itemRouter.put('/items/:item', TokenMiddleware, (req,  res) => {
    ListDAO.getListByName(req.user.id, items).then(list => {
        ListDAO.editItem(req.user.id, list.id, req.params.item, req.body).then(item =>{
            console.log("Put item response: " + JSON.stringify(item));
            res.json(item);
        }).catch(err =>{
            console.log("Put item error: " + JSON.stringify(err));
            res.json({error: err});
        });
    }).catch(err =>{
        console.log("Get Items list id error in put request: " + JSON.stringify(err));
        res.json({error: err});
    });
});

itemRouter.delete('/items', TokenMiddleware, (req,  res) => {
    ListDAO.getListByName(req.user.id, items).then(list => {
        ListDAO.deleteItems(req.user.id, list.id, req.body).then(items =>{
            console.log("Delete items response: " + JSON.stringify(item));
            res.json(items);
        }).catch(err =>{
            console.log("Delete items error: " + JSON.stringify(err));
            res.json({error: err});
        });
    }).catch(err =>{
        console.log("Get Items list id error in delete request: " + JSON.stringify(err));
        res.json({error: err});
    });
});

module.exports = itemRouter;