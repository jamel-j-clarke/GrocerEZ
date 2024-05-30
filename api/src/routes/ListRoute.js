const express = require('express');
const cookieParser = require('cookie-parser');
const listRouter = express.Router();
const ListDAO = require("../db/ListDAO.js");

listRouter.use(express.json());
listRouter.use(cookieParser());

const {TokenMiddleware} = require('./middleware/TokenMiddleware.js');

listRouter.get('/lists', TokenMiddleware, (req,  res) => {
    ListDAO.getLists(req.user.id).then(lists =>{
        console.log("Get lists response: " + JSON.stringify(lists));
        res.json(lists);
    }).catch(err =>{
        console.log("Get lists error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.get('/lists/:list', TokenMiddleware, (req,  res) => {
    ListDAO.getListById(req.user.id, req.params.list).then(list =>{
        console.log("Get list response: " + JSON.stringify(list));
        res.json(list);
    }).catch(err =>{
        console.log("Get list error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.post('/lists', TokenMiddleware, (req,  res) => {
    console.log( `name: ${ req.body.name }` );
    if(req.body.name == "Current" || req.body.name == "Items"
        || req.body.name == "current" || req.body.name == "items" ){
        res.json({error: "Cannot create a list called 'Current' or 'Items'"});
    }
    ListDAO.createList(req.user.id, req.body.name).then(list =>{
        console.log("Post list response: " + JSON.stringify(list));
        res.json(list);
    }).catch(err =>{
        console.log("Post list error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.put('/lists/:list', TokenMiddleware, (req,  res) => {
    ListDAO.editList(req.user.id, req.params.list, req.body).then(list =>{
        console.log("Put list response: " + JSON.stringify(list));
        res.json(list);
    }).catch(err =>{
        console.log("Put list error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.delete('/lists/:list', TokenMiddleware, (req,  res) => {
    ListDAO.deleteList(req.user.id, req.params.list).then(list =>{
        console.log("Delete list response: " + JSON.stringify(list));
        res.json(list);
    }).catch(err =>{
        console.log("Delete list error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.post('/lists/:list/items', TokenMiddleware, (req,  res) => {
    ListDAO.addItems(req.user.id, req.params.list, req.body).then(list =>{
        console.log("Post list items response: " + JSON.stringify(list));
        res.json(list);
    }).catch(err =>{
        console.log("Post list items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.get('/lists/:list/items', TokenMiddleware, (req,  res) => {
    ListDAO.getListItems(req.user.id, req.params.list).then(list =>{
        console.log("Get list items response: " + JSON.stringify(list));
        res.json(list);
    }).catch(err =>{
        console.log("Get list items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.put('/lists/:list/items/:item', TokenMiddleware, (req,  res) => {
    ListDAO.editItem(req.user.id, req.params.list, req.params.item, req.body).then(item =>{
        console.log("Put list item response: " + JSON.stringify(item));
        res.json(item);
    }).catch(err =>{
        console.log("Put list items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.put('/lists/:list/items', TokenMiddleware, (req,  res) => {
    ListDAO.editItems(req.user.id, req.params.list, req.body).then(items =>{
        console.log("Put list items response: " + JSON.stringify(items));
        res.json(items);
    }).catch(err =>{
        console.log("Put list itemss error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

listRouter.delete('/lists/:list/items', TokenMiddleware, (req,  res) => {
    ListDAO.deleteItems(req.user.id, req.params.list, req.body).then(list =>{
        console.log("Delete list items response: " + JSON.stringify(list));
        res.json(list);
    }).catch(err =>{
        console.log("Delete list items error: " + JSON.stringify(err));
        res.json({error: err});
    });
});

module.exports = listRouter;