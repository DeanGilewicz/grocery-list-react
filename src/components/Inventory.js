import React, { Component } from 'react';
import AddGroceryItemForm from './AddGroceryItemForm';

class Inventory extends Component {
	render () {
		return (
			<div>
				<h2>Inventory</h2>
				<AddGroceryItemForm addItem={this.props.addItem} />
				<button onClick={this.props.loadSampleItems}>Load Sample Items</button>
			</div>
		)
	}
}

export default Inventory;