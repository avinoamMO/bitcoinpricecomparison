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

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      actionType: null,
      sum: null,
      acceptConditions: null,
      lastTimeUpdatedFromServer: null, // TODO: make this load a timestamp each time the server is updated
      lastTimeRequestedByUser: null
    };
  }

  handleActionTypeChange = e => {
    this.setState({ actionType: e.target.value });
  };
  handleSumChange = e => {
    this.setState({ sum: e.target.value });
  };
  handleAcceptConditionsChange = e => {
    this.setState({ acceptConditions: e.target.checked });
  };
  handleResearchRequestFromUser = () => {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.setState({ lastTimeRequestedByUser: time });
  };

  handleIncrementSumUp = () =>{

  }
  handleIncrementSumDown = () =>{

  }

  render() {
    return (
      <div className="App">
        <InputWindow
          actionTypeChange={this.handleActionTypeChange}
          sumChange={this.handleSumChange}
          acceptConditionsChange={this.handleAcceptConditionsChange}
          researchRequestFromUser={this.handleResearchRequestFromUser}
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
