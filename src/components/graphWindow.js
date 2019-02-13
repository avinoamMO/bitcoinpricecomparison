import React, { Component } from 'react';
import ComparisonBarChart from './ComparisonBarChart'
import LineChart from './ComparisonLineChart'

export default class GraphWindow extends Component {
    render(){
        return(
        <span className = "graphWindow">
        
        <ComparisonBarChart/>
        <LineChart/>
            
        </span>)
    }
}

