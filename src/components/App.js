import React, { Component } from 'react';
import Header from './Header';
import Login from './Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header tagline="Grocery List" />
        <Login />
      </div>
    );
  }
}

export default App;
