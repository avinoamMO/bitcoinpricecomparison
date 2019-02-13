import React, { Component } from 'react';
import { BarChart, CartesianGrid , XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';

const data = [
    {
      "AnswerRef": "one",
      "Text": "Bits of Gold",
      "Score": 0,
      "RespondentPercentage": 5,
      "Rank": 2
    },
   
    {
      "AnswerRef": "four",
      "Text": "Bit2C",
      "Score": 0,
      "RespondentPercentage": 6,
      "Rank": 1
    },
    {
      "AnswerRef": "four",
      "Text": "Bitin",
      "Score": 0,
      "RespondentPercentage": 4,
      "Rank": 4
    }
];

export default class comparisonBarChart extends Component {
  render() {
    return (
      <span className="BarChart">
        <ResponsiveContainer width={350} height={350}>
        <BarChart 
            width={200} 
            height={350} 
            data={data}
            margin={{top: 5, right: 0, left: 0, bottom: 25}}>
       <XAxis 
           dataKey="Text"
           fontFamily="sans-serif"
           tickSize
           dy='25'
       />
       <YAxis hide/>
       <CartesianGrid 
           vertical={false}
           stroke="gold"
       />
       <Bar 
           dataKey="RespondentPercentage" 
           barSize ={170}
           fontFamily="sans-serif"
           label="label"
           fill="#2980b9"
           stroke="#f1c40f"
           >
            
        </Bar>
      </BarChart>
         </ResponsiveContainer>

      </span>
    );
  }
}
