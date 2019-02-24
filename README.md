Cryptocurrency trade ROI projection.

This web application will connect to multiple liquidity providers in the cryptocurrency market (brokers and exchanges) and calculate the *possible* real-time ROI on potential trades.

For example, if you want to sell 5 BTC in the BTC/USD trading pair, the app will compare the expected ROI from Bitstamp, Coinbase and Kraken and give you a real-time indication of what it is exactly.

Project status:

* Basic GUI in react.js is prepared and sends queries to the server (this will change so that the client will talk *directly* with the 3rd party service providers).

* Algorithm that receives ActionType(buy/sell), ActionVolume(1000 USD) and an OrderBook object and returns the projected ROI is implemented (need to test end cases, validate input and create unit tests).

Project still in priliminary stages.
