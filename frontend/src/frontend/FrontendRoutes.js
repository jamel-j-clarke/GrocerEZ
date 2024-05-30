const express = require('express');
const frontendRouter = express.Router();

const html_dir = __dirname + '/templates/';

frontendRouter.get('/', (req, res) => {
    res.sendFile(`${html_dir}landing.html`);
});

frontendRouter.get('/currentlist', (req, res) => {
    res.sendFile(`${html_dir}currentList.html`);
});

frontendRouter.get('/items', (req, res) => {
    res.sendFile(`${html_dir}items.html`);
});

frontendRouter.get('/lists', (req, res) => {
    res.sendFile(`${html_dir}lists.html`);
});

frontendRouter.get('/recipes', (req, res) => {
    res.sendFile(`${html_dir}recipes.html`);
});

frontendRouter.get('/error', (req, res) => {
    res.sendFile(`${html_dir}error.html`);
});

frontendRouter.get('/offline', (req,  res) => {
    res.sendFile(`${html_dir}offline.html`);
});

frontendRouter.all( '*', (req, res) => {
    res.sendFile( `${html_dir}error.html` );
});

module.exports = frontendRouter;