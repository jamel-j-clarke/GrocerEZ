const express = require('express');
const routes = require('./routes/Routes');

const app = express();
const PORT = process.env.PORT;

app.use(routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));