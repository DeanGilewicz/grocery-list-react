import React, { Component } from 'react';

class AddGroceryItemForm extends Component {

	createItem(e) {
		e.preventDefault();
		const item = {
			name: this.name.value,
			brand: this.brand.value,
			type: this.type.value,
			description: this.description.value,
			image: this.image.value,
			remaining: this.remaining.value,
			onOrder: this.onOrder.value,
			threshold: this.threshold.value
		}
		this.props.addItem(item);
		this.itemForm.reset();
	}

	render() {
		return (
			<form action="" className="item-edit" ref={ (input) => {this.itemForm = input} } onSubmit={ (e) => {this.createItem(e)} }>
				<input type="text" name="name" placeholder="Item Name" ref={ (input) => {this.name = input} } />
				<input type="text" name="brand" placeholder="Item Brand" ref={ (input) => {this.brand = input} } />
				<select name="type" id="" ref={ (input) => {this.type = input} }>
					<option value="vegetables">vegetables</option>
					<option value="grains">grains</option>
					<option value="fruit">fruit</option>
					<option value="dairy">dairy</option>
					<option value="oils">oils</option>
					<option value="proteins">proteins</option>
				</select>
				<textarea placeholder="Item Description" ref={ (input) => {this.description = input} }></textarea>
				<input type="text" name="image" placeholder="Item Image" ref={ (input) => {this.image = input} } />
				<input type="text" name="remaining" placeholder="Item Remaining" ref={ (input) => {this.remaining = input} } />
				<input type="text" name="onOrder" placeholder="Item OnOrder" ref={ (input) => {this.onOrder = input} } />
				<input type="text" name="threshold" placeholder="Item Threshold" ref={ (input) => {this.threshold = input} } />
				<button type="submit">+ Add Item</button>
			</form>
		)
	}
}

export default AddGroceryItemForm;