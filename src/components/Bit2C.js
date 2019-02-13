import React, { Component } from 'react';
import axios from "axios";

export default class Bit2C extends Component {
constructor(){
  super()
  this.state = {bit2corderbookasks:null, bit2corderbookbids :null, bit2cticker : null}
}

//ticker url: https://bit2c.co.il/Exchanges/BtcNis/Ticker.json
  componentDidMount(){
    axios.get(`http://localhost:3007/getbit2corderbook`).then(res => {
      this.setState({bit2corderbookasks:res.data.asks,bit2corderbookbids:res.data.bids })
      console.log("@bit2cjs: got order-book data from Bit2C")
      console.log(res.data)
    }).catch(function(error){
      console.log("Failed to get order-book data from Bit2C, Error: \n")
      console.log(error);
    })
    axios.get(`http://localhost:3007/getbit2cticker`).then(res => {
      this.setState({bit2cticker:res.data})
      console.log("@bit2cjs: got ticker data from Bit2C")
    }).catch(function(error){
      console.log("Failed to get ticker data from Bit2C, Error: \n")
      console.log(error);
    })

  }
  render() {

    return (
      <div className="Bit2C">
      
        I am Bit2C.
      </div>
    );
  }
}
