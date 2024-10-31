const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const database = require("./config/database")
const cors = require("cors")
const cookieParser = require('cookie-parser');

const routesApiVer1 = require('./api/v1/routes/index.route');

const app = express();
const port = process.env.PORT;

database.connect();

app.use(cors());

app.use(cookieParser());

// parser application/json 
app.use(bodyParser.json());

// Routes
routesApiVer1(app);
// End routes

app.listen(port,()=>{
  console.log(`App listening on port : ${port}`);
})