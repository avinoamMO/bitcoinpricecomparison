// Include packages:
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const PORT = 3007

//Server setup;
const app = express();
const router = express.Router();

const api = require(`./routes/api.js`)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  
    next()
  })


  app.use("/", api)
  
app.listen(PORT, function () {
    console.log(`server up @ :`+ PORT)
});
 