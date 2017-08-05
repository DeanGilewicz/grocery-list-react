import React, { Component } from 'react';
import Header from './Header';
import Inventory from './Inventory';
import List from './List';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header tagline="Grocery List" />
        <Inventory />
        <List />
      </div>
    );
  }
}

export default App;
