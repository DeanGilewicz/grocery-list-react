import React, { Component } from 'react';
import AddGroceryItemForm from './AddGroceryItemForm';
import Item from './Item';
import List from './List';


class Inventory extends Component {

	constructor() {
		super();
		this.rendorInventory = this.rendorInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.state = {
			isViewInventory: false,
			isAddItem: false,
			isEditItems: false
		}

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
		if( !this.state.isAddItem && !this.state.isEditItems && !this.state.isViewInventory) {
			return (
				<div className="inventory">
					<h2>Inventory</h2>
					<button onClick={ () => this.setState({ isAddItem: true }) }>Add An Item</button>
					<button onClick={ () => this.setState({ isEditItems: true }) }>Edit Items</button>
					<button onClick={ () => this.setState({ isViewInventory: true }) }>View Items</button>
				</div>
			)
		} else if( this.state.isAddItem && !this.state.isEditItems && !this.state.isViewInventory) {
			return (
				<div>
					<h2>Inventory</h2>
					<AddGroceryItemForm addItem={this.props.addItem} />
					<button onClick={ () => this.setState({ isAddItem: false }) }>Cancel</button>
					<button onClick={this.props.loadSampleItems}>Load Sample Items</button>
				</div>
			)
		} else if( !this.state.isAddItem && this.state.isEditItems && !this.state.isViewInventory) {
			return (
				<div>
					<h2>Inventory</h2>
					<button onClick={ () => this.setState({ isEditItems: false }) }>Cancel</button>
					{Object.keys(this.props.items).map(this.rendorInventory)}
				</div>
			)
		} else if( this.state.isViewInventory) {
			return (
				<div>
					<button onClick={ () => this.setState({ isViewInventory: false }) }>Hide Items</button>
					<ul className="items_available">
						{
							Object
								.keys(this.props.items)
								.map(key => 
									<Item key={key}
										index={key}
										details={this.props.items[key]}
										addToList={this.props.addToList}
									/>
								)
						}
					</ul>
				</div>
			)
		}
	}

}

export default Inventory;