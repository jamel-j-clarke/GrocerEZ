const express = require('express');
const cookieParser = require('cookie-parser');
const userRouter = express.Router();
const UserDAO = require("../db/UserDAO.js");
const ListDAO = require("../db/ListDAO.js");

userRouter.use(express.json());
userRouter.use(cookieParser());

const {TokenMiddleware, generateToken, removeToken} = require('./middleware/TokenMiddleware.js');

userRouter.get('/users/:user', TokenMiddleware, (req,  res) => {
    console.log("Request in UserRoute: " + JSON.stringify(req.body));
    let userId = req.params.user;
    if(userId == "current" || userId == "Current"){
        res.json(req.user);
    } else {
        UserDAO.getUser(userId).then(user =>{
            console.log("User in Route: " + JSON.stringify(user));
            res.json(user);
        }).catch(err =>{
            console.log("Error: " + JSON.stringify(err));
            res.status(400).json({error: 'User not found'});
        });
    }
});

userRouter.post('/users', (req,  res) => {
    console.log("Request in UserRoute: " + JSON.stringify(req.body));
    UserDAO.createUser(req.body).then(user =>{
        console.log("New User: " + JSON.stringify(user));
        generateToken(req, res, user);        // Every user has an items and current list
        ListDAO.createList(user.id, "Current");
        ListDAO.createList(user.id, "Items");
        res.json(user);
    }).catch(err =>{
        console.log("Error: " + JSON.stringify(err));
        res.status(400).json({error: 'Creation unsuccessful'});
    });
});

userRouter.put('/users/:user', TokenMiddleware, (req,  res) => {
    console.log("Request in UserRoute: " + JSON.stringify(req.body));
    UserDAO.editUser(req.params.user, req.body).then(user =>{
        console.log("User in Route: " + JSON.stringify(user));
        res.json(user);
    }).catch(err =>{
        console.log("Error: " + JSON.stringify(err));
        res.status(400).json({error: 'Edit unsuccessful'});
    });
});

userRouter.delete('/users/:user', TokenMiddleware, (req,  res) => {
    console.log("Request in UserRoute: " + JSON.stringify(req.body));
    UserDAO.deleteUser(req.params.user).then(user =>{
        console.log("User in Route: " + JSON.stringify(user));
        res.json(user);
    }).catch(err =>{
        console.log("Error: " + JSON.stringify(err));
        res.status(400).json({error: 'Deletion unsuccessful'});
    });
});

userRouter.post('/users/login', (req,  res) => {
    console.log("Request in UserRoute: " + JSON.stringify(req.body));
    UserDAO.login(req.body).then(user =>{
        console.log("User in Route: " + JSON.stringify(user));
        generateToken(req, res, user);
        res.json(user);
    }).catch(err =>{
        console.log("Error: " + JSON.stringify(err));
        res.status(400).json({error: err});
    });
});

userRouter.post('/users/logout', (req,  res) => {
    removeToken(req, res);
    res.json({success: true});
});

module.exports = userRouter;