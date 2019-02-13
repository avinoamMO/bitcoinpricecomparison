import React, { Component } from 'react';

export default class InputWindow extends Component {
    render(){
        return(
            <div className = "inputWindow">
            Select desired action:
            <select>
                <option value="">Buy or Sell?</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
            </select>
            <p/>
            Select amount: <input type="number" placeholder = "How much?" min="0.001" max="10000000"></input>
            <p/>
            Accept the terms and conditions
            <input type="checkbox"></input><p/>
            <button>Research the market for me!</button>
            </div>)
    }
}

