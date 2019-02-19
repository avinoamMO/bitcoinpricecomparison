// Include packages:
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 3007;
const Bit2C = require("./bit2c");
var rp = require("request-promise");

//Server setup;
const app = express();
const router = express.Router();

const api = require(`./routes/api.js`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  next();
});
app.use("/", api);

app.listen(PORT, function() {
  console.log(`server up @ :` + PORT);
});


fetchDataAndUpdateDb = () => {
  rp("https://bit2c.co.il/Exchanges/BtcNis/orderbook.json")
    .then(function(res) {
      let Bit2CbookBTC = JSON.parse(res);
    })
    .catch(function(err) {
      console.log(`error fetching data from Bit2C: \n + ${err}`);
    });

  rp("https://www.bitsofgold.co.il/api/btc")
    .then(function(res) {
      let BitsOfGoldBTC = JSON.parse(res);
    })
    .catch(function(err) {
      console.log(`error fetching data from BOG: \n + ${err}`);
    });
};

fetchDataAndUpdateDb();
setInterval(fetchDataAndUpdateDb, 600000);
