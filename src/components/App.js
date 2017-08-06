import React, { Component } from 'react';
import Header from './Header';
import Inventory from './Inventory';
import List from './List';
import Item from './Item';

// mock data
import sampleItems from '../sample-items';

// firebase
import base from '../base';

class App extends Component {

	constructor() {
		super();

		// mock data
		this.loadSampleItems = this.loadSampleItems.bind(this);

		// inventory component
		this.addItem = this.addItem.bind(this);

		// item component
		this.addToList = this.addToList.bind(this);

		// list component
		this.increaseItemOnList = this.increaseItemOnList.bind(this);
		this.decreaseItemOnList = this.decreaseItemOnList.bind(this);
		this.removeFromList = this.removeFromList.bind(this);

		// initial state
		this.state = {
			items: {},
			list: {}
		}

	}

	componentWillMount() {
		this.refItems = base.syncState(`${this.props.match.params.groceryListId}/items`, {
			context: this,
			state: 'items' 
		});
	}

	componentWillUnmount() {
		base.removeBinding(this.refItems);
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

	// initially add item to list with quantity value of 1
	addToList(key) {
		// copy existing state
		const list = {...this.state.list};
		// copy existing state
		const items = {...this.state.items}
		// update onOrder property of this item since now on list
		items[key].onOrder = true;
		// update quantity property of this item
		items[key].quantity = items[key].quantity = 1;
		// add new number of item ordered to list
		list[key] = items[key].quantity;
		// update states for both list and items
		this.setState({ list: list, items: items });
	}

	// once item on list then delete from list and reset quantity to 0
	removeFromList(key) {
		// copy existing state
		const list = {...this.state.list};
		// copy existing state
		const items = {...this.state.items}
		// update onOrder property of this item since now removed from list
		items[key].onOrder = false;
		// update quantity property of this item
		items[key].quantity = items[key].quantity = 0;
		// remove item from list
		delete list[key]; // typical way
		// list[key] = null; // firebase way
		// update states for both list and items
		this.setState({ list: list, items: items });
	}

	// once item on list then control quantity
	increaseItemOnList(key) {
		// copy existing state
		const list = {...this.state.list};
		// copy existing state
		const items = {...this.state.items}
		// update quantity property of this item
		items[key].quantity = items[key].quantity + 1;
		// update number of item ordered from list
		list[key] = items[key].quantity;
		// update states for both list and items
		this.setState({ list: list, items: items });
	}

	// once item on list then control quantity
	decreaseItemOnList(key) {
		// copy existing state
		const list = {...this.state.list};
		// copy existing state
		const items = {...this.state.items}
		// update quantity property of this item
		items[key].quantity = items[key].quantity - 1;
		// decrease number of item ordered from list
		list[key] = items[key].quantity;
		// update states for both list and items
		this.setState({ list: list, items: items });
	}

  
	render() {
		return (
			<div className="App">
				<Header tagline="Grocery List" />
				<Inventory loadSampleItems={this.loadSampleItems} addItem={this.addItem} />
				<List list={this.state.list} items={this.state.items} increaseItemOnList={this.increaseItemOnList} decreaseItemOnList={this.decreaseItemOnList} removeFromList={this.removeFromList} />
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
