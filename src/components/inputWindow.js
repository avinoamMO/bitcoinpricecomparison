import React, { Component } from "react";

export default class InputWindow extends Component {
  render() {
    return (
      <div className="inputWindow">
        Trading pair:
        <datalist id="fiat">
          <option>NIS</option>
          <option>USD</option>
        </datalist>
        <datalist id="crypto">
          <option>BTC</option>
          <option>ETH</option>
        </datalist>
        <input
          autoComplete="on"
          list="fiat"
          onKeyUp={this.props.pickFiatCurrency}
          placeholder="Fiat"
          size="4"
        />
        <input
          autoComplete="on"
          list="crypto"
          onKeyUp={this.props.pickCryptoCurrency}
          placeholder="Crypto"
          size="4"
        />
        <p />
        Filter by country:
        <datalist id="countries">
          <option>Israel</option>
          <option>United States</option>
        </datalist>
        <input
          autoComplete="on"
          list="exchanges"
          onKeyUp={this.props.pickFiatCurrency}
          placeholder="exchanges"
          size="10"
        /> (optional)
        <p/>
        Exchanges:
        <datalist id="exchanges">
          <option>Bit2C</option>
          <option>Bits of Gold</option>
        </datalist>
        <input
          autoComplete="on"
          list="exchanges"
          onKeyUp={this.props.pickFiatCurrency}
          placeholder="exchanges"
          size="10"
        /> 
        <p />
        Desired action:
        <select onClick={this.props.actionTypeChange}>
          <option value="null">Buy or Sell?</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <p />
        How much:
        <input
          onKeyUp={this.props.sumChange}
          type="number"
          placeholder="How much?"
          min="0.001"
          max="10000000"
        />
        <p />Condition 1
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />Condition 2
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />Condition 3
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />Condition 4
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />Condition5
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />
        <button onClick={this.props.researchRequestFromUser}>
          Move to the next stage!
        </button>
      </div>
    );
  }
}
