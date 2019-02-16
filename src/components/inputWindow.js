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
        Exchanges:
        <datalist id="exchanges">
          <option>Bit2C</option>
          <option>Bits Of Gold</option>
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
        Amount:
        <input
          onKeyUp={this.props.sumChange}
          type="number"
          placeholder="How much?"
          min="0.001"
          max="10000000"
        />
        <p />I understand trading in crypto is risky
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />I understand this site could have mistakes
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />I understand I need to conduct my own research
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />I am the only person responsible for my financial choices
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />I understand the creators of this site are not accountable for
        anything that I do
        <input onClick={this.props.acceptConditionsChange} type="checkbox" />
        <p />
        <button onClick={this.props.researchRequestFromUser}>
          Research the market for me!
        </button>
      </div>
    );
  }
}
