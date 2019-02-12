import React, { Component } from 'react';
import Bit2C from './components/Bit2C'
import BitsOfGold from './components/BitsOfGold'
import BITIN from './components/BITIN'
import ScrollBar from './components/Scrollbar'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        I am Main.
        <Bit2C/>
        <BITIN/>
        <BitsOfGold/>
        <ScrollBar/>
      </div>
    );
  }
}
