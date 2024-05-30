const express = require('express');
const routes = require('./frontend/FrontendRoutes');

const app = express();
const PORT = process.env.PORT;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: true}));
app.use(routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));