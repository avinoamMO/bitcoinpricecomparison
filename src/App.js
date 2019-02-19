import React, { Component } from "react";
import Bit2C from "./components/Bit2C";
import BitsOfGold from "./components/BitsOfGold";
import BITIN from "./components/BITIN";
import ScrollBar from "./components/Scrollbar";
import GraphWindow from "./components/graphWindow";
import InputWindow from "./components/inputWindow";
import MiddleWindow from "./components/middleWindow";
import Footer from "./components/footer";
import "./App.css";
import axios from "axios";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fiatCurrency: null,
      cryptoCurrency: null,
      exchanges: null,
      countries : null,
      actionType: null,
      sum: null,
      acceptConditions: null,
      lastTimeUpdatedFromServer: null, // TODO: make this load a timestamp each time the server is updated
      lastTimeRequestedByUser: null,
      stageInSite: null
    };
  }

  handleActionTypeChange = e => {
    this.setState({ actionType: e.target.value });
  };
  handleSumChange = e => {
    this.setState({ sum: e.target.value });
  };
  handleAcceptConditionsChange = e => {
    console.log(e.target.id)
    this.setState({ acceptConditions: e.target.checked });
  };
  handleResearchRequestFromUser = () => {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.setState({ lastTimeRequestedByUser: time });
    let data = this.state;
    axios({
      method: "post",
      url: "http://localhost:3007/researchRequest",
      data: { data }
    }).then(function(response){
      console.log(response.data)
    }).catch(function(error){
      console.log(`error: ${error}`)
    });
  };

  handleIncrementSumUp = () => {
    var newSum = parseInt(this.state.sum) + 100;
    this.setState({ sum: newSum });
  };
  handleIncrementSumDown = () => {
    var newSum = parseInt(this.state.sum) - 100;
    this.setState({ sum: newSum });
  };
  pickFiatCurrency = e => {
    this.setState({ fiatCurrency: e.target.value });
  };

  pickCryptoCurrency = e => {
    this.setState({ cryptoCurrency: e.target.value });
  };
  
  handlePickCountries = e => {
    this.setState({ countries: e.target.value });
  };

  handlePickExchanges = e => {
    this.setState({ exchanges: e.target.value });
  };


  moveBack = () => {};
  moveForward = () => {};
  render() {
    return (
      <div className="App">
        <InputWindow
          actionTypeChange={this.handleActionTypeChange}
          sumChange={this.handleSumChange}
          acceptConditionsChange={this.handleAcceptConditionsChange}
          researchRequestFromUser={this.handleResearchRequestFromUser}
          pickFiatCurrency={this.pickFiatCurrency}
          pickCryptoCurrency={this.pickCryptoCurrency}
          pickCountries= {this.handlePickCountries}
          pickExchanges = {this.handlePickExchanges}
        />
        <MiddleWindow />
        <GraphWindow
          incrementSumUp={this.handleIncrementSumUp}
          incrementSumDown={this.handleIncrementSumDown}
        />
        <Footer />
      </div>
    );
  }
}
