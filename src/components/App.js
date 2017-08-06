import React, { Component } from 'react';
import Header from './Header';
import Inventory from './Inventory';
import List from './List';
import Item from './Item';

// mock data
import sampleItems from '../sample-items';

class App extends Component {

  constructor() {
	super();

	// bind methods to component
	this.loadSampleItems = this.loadSampleItems.bind(this);
	
	this.addItem = this.addItem.bind(this);
	this.addToList = this.addToList.bind(this);

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

  addToList(key) {
  	// copy existing state
  	const list = {...this.state.list};
  	// copy existing state
  	const items = {...this.state.items}
  	// update onOrder property of this item
  	items[key].onOrder = items[key].onOrder + 1 || 1;
  	// update or add new number of item ordered to list
  	list[key] = items[key].onOrder;
  	// list[key] = list[key] + 1 || 1;
  	// update states for both list and items
  	this.setState({ list: list, items: items });
  }

  render() {
	return (
		<div className="App">
			<Header tagline="Grocery List" />
			<Inventory loadSampleItems={this.loadSampleItems} addItem={this.addItem} />
			<List list={this.state.list} items={this.state.items} />
			<ul>
				{
					Object
						.keys(this.state.items)
						.map(key => <Item key={key} index={key} details={this.state.items[key]} addToList={this.addToList} />)
				}
			</ul>
		</div>
	);
  }
}

export default App;
