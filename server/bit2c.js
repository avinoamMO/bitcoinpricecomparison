const express = require("express")
const request = require('request');
const router = express.Router()


const getOrderBook = async function(){
        const options = {  
            url: `https://bit2c.co.il/Exchanges/BtcNis/orderbook.json`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };
        
        request(options.url, async function(err, res, body) {  
            let json = await JSON.parse(body);
            return (json);
        });   
    }

const getTicker = function(){

        const options = {  
            url: `https://bit2c.co.il/Exchanges/BtcNis/Ticker.json`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };
        
        request(options, function(err, res, body) {  
            let json = JSON.parse(body);
            return(json)    
        });   
    }       

    module.exports = getOrderBook, getTicker;