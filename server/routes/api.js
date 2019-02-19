const express = require("express")
const request = require('request');
const router = express.Router()
let a = require('../bit2c');

    router.get("/sanity", function (req, response) 
    {
        response.send("OK")
    });

    let thegoodbook = {
        asks: [
          [10000, 0.1, 1550166113],
          [10000, 0.1, 1550165250],
          [10000, 0.1, 1550165309],
          [10000, 0.1, 1550168263],
          [10000, 0.1, 1550168260],
          [10000, 0.1, 1550166113],
          [10000, 0.1, 1550165250],
          [10000, 0.1, 1550165309],
          [10000, 0.1, 1550168263],
          [10000, 0.1, 1550168260]
        ],
        bids: [
          [10000, 0.1, 1550166113],
          [10000, 0.1, 1550165250],
          [10000, 0.1, 1550165309],
          [10000, 0.1, 1550168263],
          [10000, 0.1, 1550168260],
          [10000, 0.1, 1550166113],
          [10000, 0.1, 1550165250],
          [10000, 0.1, 1550165309],
          [10000, 0.1, 1550168263],
          [10000, 0.1, 1550168260]
        ]
      };
    
    // router.get("/researchRequest/:primaryMarket/:secondaryMarket/:exchanges/:buyorsell/:sum/", function (req, response) 
    router.get("/researchRequest/", function (req, response) 
    {
        
        
            // orderBook = Bit2CbookBTC // Pull Bit2C book from DB
            let calculation = a(thegoodbook,7000)

            // req.params.primaryMarket
            // req.params.secondaryMarket
            // req.params.exchanges
            // req.params.buyorsell
            // req.params.sum
            // Use these for processing the data

            console.log(req.params)
            response.send(calculation)
        
        
    })


    router.get("/getOrderBook/:exchangeName", function (req, response) 
    {

        const options = {  
            url: `https://bit2c.co.il/Exchanges/BtcNis/orderbook.json`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };
        
        request(options, function(err, res, body) {  
            let json = JSON.parse(body);
            response.send(json)    
        });   
    });
    
        router.get("/getbit2cticker", function (req, response) 
        {
    
            const options = {  
                url: `https://bit2c.co.il/Exchanges/BtcNis/orderbook.json`,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8'
                }
            };
            
            request(options, function(err, res, body) {  
                let json = JSON.parse(body);
                response.send(json)    
            });   
        
    });

module.exports = router
