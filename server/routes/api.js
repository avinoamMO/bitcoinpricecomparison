const express = require("express")
const request = require('request');
const router = express.Router()


    router.get("/sanity", function (req, response) 
    {
        response.send("OK")
    });

    router.get("/getbit2corderbook", function (req, response) 
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
