import React, { Component } from "react";
import ComparisonBarChart from "./ComparisonBarChart";
import LineChart from "./ComparisonLineChart";

export default class GraphWindow extends Component {
  render() {
    return (
      <div className="graphWindow">
        <center>
          <ComparisonBarChart />
          <button>+</button>
          <button>-</button>
        </center>
      </div>
    );
  }
}
