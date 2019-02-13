import React, { Component } from 'react';
import Bit2C from './components/Bit2C'
import BitsOfGold from './components/BitsOfGold'
import BITIN from './components/BITIN'
import ScrollBar from './components/Scrollbar'
import GraphWindow from './components/graphWindow'
import InputWindow from './components/inputWindow'
import MiddleWindow from './components/middleWindow'
import Footer from './components/footer'
import './App.css';

export default class App extends Component {
  handleUserRequest(){
    alert("I'm on it")
  }
  render() {
    return (
      <div className="App">
      <InputWindow/>
      <MiddleWindow/>
      <GraphWindow/>
      <Footer/>
        
        
        
      </div>
      
    );
  }
}
