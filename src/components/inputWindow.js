import React, { Component } from 'react';

export default class InputWindow extends Component {
    render(){
        return(
            <div className = "inputWindow">
            Select desired action:
            <select onClick={this.props.actionTypeChange}>
                <option value="null">Buy or Sell?</option>
                <option value="buy">Buy Bitcoin</option>
                <option value="sell">Sell Bitcoin</option>
            </select>
            <p/>
            Select amount: 
            <input onKeyUp={this.props.sumChange} type="number" placeholder = "How much?" min="0.001" max="10000000"></input>
            <p/>
            I've read the disclaimer and agree to it
            <input onClick={this.props.acceptConditionsChange} type="checkbox"></input><p/>
            <button onClick={this.props.researchRequestFromUser}>Research the market for me!</button>
            </div>)
    }
}

