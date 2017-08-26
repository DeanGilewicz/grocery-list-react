import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AddGroceryItemForm extends Component {

	createItem(e) {
		e.preventDefault();
		const item = {
			name: this.name.value,
			brand: this.brand.value,
			type: this.type.value,
			description: this.description.value,
			image: this.image.value,
			stock: this.stock.value,
			quantity: 0,
			threshold: this.threshold.value,
			onOrder: false,
			isComplete: false
		}
		this.props.addItem(item);
		this.itemForm.reset();
	}

	render() {
		return (
			<form action="" className="inventory_modal_add" ref={ (input) => {this.itemForm = input} } onSubmit={ (e) => {this.createItem(e)} }>
				<div className="inventory_modal_add_content_container">
					<div className="inventory_modal_add_content">
						<label htmlFor="name">Name:</label>
						<input type="text" name="name" placeholder="Item Name" id="name" ref={ (input) => {this.name = input} } />
						<label htmlFor="brand">Brand:</label>
						<input type="text" name="brand" placeholder="Item Brand" id="brand" ref={ (input) => {this.brand = input} } />
						<label htmlFor="type">Type:</label>
						<select name="type" id="type" ref={ (input) => {this.type = input} }>
							<option value="vegetables">vegetables</option>
							<option value="grains">grains</option>
							<option value="fruit">fruit</option>
							<option value="dairy">dairy</option>
							<option value="oils">oils</option>
							<option value="proteins">proteins</option>
						</select>
						<label htmlFor="description">Description:</label>
						<textarea placeholder="Item Description" id="description" ref={ (input) => {this.description = input} }></textarea>
						<label htmlFor="image">Image:</label>
						<input type="text" name="image" placeholder="Item Image" id="image" ref={ (input) => {this.image = input} } />
						<label htmlFor="stock">Stock:</label>
						<input type="number" name="stock" placeholder="Item Stock" id="stock" ref={ (input) => {this.stock = input} } />
						<label htmlFor="threshold">Threshold:</label>
						<input type="text" name="threshold" placeholder="Item Threshold" id="threshold" ref={ (input) => {this.threshold = input} } />
						<div className="inventory_modal_add_content_actions">
							<button type="button" className="btn btn_cancel" onClick={this.props.cancelAddItem}>Cancel</button>
							<button type="submit" className="btn btn_submit">Save</button>
						</div>
					</div>
				</div>
			</form>
		)
	}
}

AddGroceryItemForm.propTypes = {
	addItem: PropTypes.func.isRequired,
	cancelAddItem: PropTypes.func.isRequired
};

export default AddGroceryItemForm;