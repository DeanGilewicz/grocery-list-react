import React, { Component } from 'react';
import AddGroceryItemForm from './AddGroceryItemForm';

class Inventory extends Component {

	constructor() {
		super();
		this.rendorInventory = this.rendorInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e, key) {
		const item = this.props.items[key];
		console.log('help', e.target.value);
		// take a copy of that fish and update it with the new data
		const updatedItem = {
			...item,
			[e.target.name]: e.target.value
		}
		this.props.updateItem(key, updatedItem);
	}

	rendorInventory(key) {
		const item = this.props.items[key];
		return (
			<div key={key}>
				<input type="text" name="name" value={item.name} placeholder="" onChange={ (e) => {this.handleChange(e, key)} } />
				<input type="text" name="brand" value={item.brand} placeholder="" onChange={ (e) => {this.handleChange(e, key)} } />
				<select name="type" id="" value={item.type} placeholder="" onChange={ (e) => {this.handleChange(e, key)} }>
					<option value="vegetables">vegetables</option>
					<option value="grains">grains</option>
					<option value="fruit">fruit</option>
					<option value="dairy">dairy</option>
					<option value="oils">oils</option>
					<option value="proteins">proteins</option>
				</select>
				<textarea name="description" value={item.description} placeholder="" onChange={ (e) => {this.handleChange(e, key)} }></textarea>
				<input type="text" name="image" value={item.image} placeholder="" onChange={ (e) => {this.handleChange(e, key)} } />
				<input type="text" name="stock" value={item.stock} placeholder="" onChange={ (e) => {this.handleChange(e, key)} } />
				<input type="text" name="threshold" value={item.threshold} placeholder="" onChange={ (e) => {this.handleChange(e, key)} } />
				<button onClick={ () => {this.props.deleteItem(key)} }>Delete Item</button>
			</div>
		)
	}

	render () {
		return (
			<div>
				<h2>Inventory</h2>
				{Object.keys(this.props.items).map(this.rendorInventory)}
				<AddGroceryItemForm addItem={this.props.addItem} />
				<button onClick={this.props.loadSampleItems}>Load Sample Items</button>
			</div>
		)
	}
}

export default Inventory;