import React, { Component } from 'react';
import Header from './Header';
import Inventory from './Inventory';
import List from './List';

// mock data
import sampleItems from '../sample-items';

class App extends Component {

  constructor() {
	super();

	// bind methods to component
	this.loadSampleItems = this.loadSampleItems.bind(this);
	this.addItem = this.addItem.bind(this);

	// initial state
	this.state = {
		items: {},
		list: {}
	}

  }

  // mock data - items

  loadSampleItems() {
  	this.setState({ items: sampleItems });
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
			<Inventory loadSampleItems={this.loadSampleItems} addItem={this.addItem} />
			<List />
		</div>
	);
  }
}

export default App;
