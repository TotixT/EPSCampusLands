const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const routerBase = require('./routes/routes.js');
app.use("/EPS",routerBase);

require('dotenv').config();
const port = process.env.PORT;
app.use(express.json());
app.listen(port, () => {
    console.log(`Server's running on port: ${port}`);
})


