import React, { Component } from "react";
import { LineChart, CartesianGrid , XAxis, YAxis, Line, Legend, Bar, ResponsiveContainer } from 'recharts';

export default class ComparisonLineChart extends Component {
  render() {
    const data = [
        {name: '1k ₪', uv: 4500, pv: 2300, amt: 2400},
        {name: '10k ₪', uv: 3000, pv: 1398, amt: 2210},
        {name: '100k ₪', uv: 2000, pv: 9800, amt: 2290},
        {name: '250k ₪', uv: 2780, pv: 3908, amt: 2000},
        {name: '500k ₪', uv: 1890, pv: 4800, amt: 2181},
        {name: '1M ₪', uv: 2390, pv: 3800, amt: 2500},
        {name: '2.5M ₪', uv: 3490, pv: 4300, amt: 2100},
  ];
    return (
      <span className="LineChart">
        <ResponsiveContainer width={700} height={350}>
          <LineChart width={700} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="uv" stroke="gold" />
            <Line type="monotone" dataKey="pv" stroke="blue" />
          </LineChart>
        </ResponsiveContainer>
      </span>
    );
  }
}
