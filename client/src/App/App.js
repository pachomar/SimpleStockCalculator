import React, { Component } from 'react';
import './App.css';
import ParentComponent from '../Components/ParentComponent/ParentComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h4>Super Simple Stocks</h4>
        <div className='rowC'>
          <ParentComponent></ParentComponent>
        </div>
      </div>
    );
  }
}

export default App;
