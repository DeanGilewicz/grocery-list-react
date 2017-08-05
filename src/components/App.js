import React, { Component } from 'react';
import Header from './Header';
import Inventory from './Inventory';
import List from './List';

class App extends Component {

  constructor() {
	super();

	// bind methods to component
	this.addItem = this.addItem.bind(this);

	// initial state
	this.state = {
		items: {},
		list: {}
	}
  }

  addItem(item) {
  	// copy existing state
  	const items = {...this.state.items};
  	// update item
  	const timestamp = Date.now();
  	items[`item-${timestamp}`] = item;
  	// set state
  	this.setState({ items: items });
  }

  render() {
	return (
		<div className="App">
			<Header tagline="Grocery List" />
			<Inventory addItem={this.addItem} />
			<List />
		</div>
	);
  }
}

export default App;
