import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Item extends Component {

	constructor() {
		super();

		this.rendorInventory = this.rendorInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.state = {
			isViewDetails: false,
			isEditItem: false
		}
	}

	handleChange(e, key) {
		const item = this.props.items[key];
		// take a copy of that item and update it with the new data
		const updatedItem = {
			...item,
			[e.target.name]: e.target.value
		}
		this.props.updateItem(key, updatedItem);
	}

	rendorInventory(key) {
		const item = this.props.items[key];
		return (
			<div className="item_modal_edit">
				<div className="item_modal_edit_content_container" key={key}>
					<div className="item_modal_edit_content">
						<label htmlFor="name">Name:</label>
						<input type="text" name="name" value={item.name} placeholder="name" id="name" onChange={ (e) => {this.handleChange(e, key)} } />
						<label htmlFor="brand">Brand:</label>
						<input type="text" name="brand" value={item.brand} placeholder="brand" id="brand" onChange={ (e) => {this.handleChange(e, key)} } />
						<label htmlFor="type">Type:</label>
						<select name="type" value={item.type} placeholder="type" id="type" onChange={ (e) => {this.handleChange(e, key)} }>
							<option value="vegetables">vegetables</option>
							<option value="grains">grains</option>
							<option value="fruit">fruit</option>
							<option value="dairy">dairy</option>
							<option value="oils">oils</option>
							<option value="proteins">proteins</option>
						</select>
						<label htmlFor="description">Description:</label>
						<textarea name="description" value={item.description} placeholder="description" id="description" onChange={ (e) => {this.handleChange(e, key)} }></textarea>
						<label htmlFor="image">Image:</label>
						<input type="text" name="image" value={item.image} placeholder="image" id="image" onChange={ (e) => {this.handleChange(e, key)} } />
						<label htmlFor="stock">Stock:</label>
						<input type="text" name="stock" value={item.stock} placeholder="stock" id="stock" onChange={ (e) => {this.handleChange(e, key)} } />
						<label htmlFor="threshold">Threshold:</label>
						<input type="text" name="threshold" value={item.threshold} placeholder="threshold" id="threshold" onChange={ (e) => {this.handleChange(e, key)} } />
						<div className="item_modal_edit_content_actions">
							<button className="btn btn_delete" onClick={ () => {this.props.deleteItem(key)} }>Delete</button>
							<button className="btn btn_complete" onClick={ () => {this.setState({ isEditItem: false })} }>Done</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		const { details, index } = this.props; // const details = this.props.details; const index = this.props.index;
		const button = (!details.onOrder) ? <button onClick={ () => {this.props.addToList(index)} }>Add To List</button> : '';
		
		const itemImageStyle = { backgroundImage: 'url(' + details.image + ')'};

		if( !this.state.isViewDetails && !this.state.isEditItem ) {
			return (
				<li className="item__available_item">
					<div className="item__image" style={itemImageStyle}></div>
					<h3>{details.name}</h3>
					<p>{details.brand}</p>
					<button onClick={ () => this.setState({ isViewDetails: true }) }>Details</button>
					{button}
					<button onClick={ () => this.setState({ isEditItem: true }) }>Edit</button>
				</li>
			)
		} else if( this.state.isViewDetails && !this.state.isEditItem ) {
			return (
				<li className="item__available_item">
					<p className="item__category">{details.type}</p>
					<p>{details.description}</p>
					<p>Stock: {details.stock}</p>
					<p>Threshold: {details.threshold}</p>
					<button onClick={ () => this.setState({ isViewDetails: false }) }>Back</button>
				</li>
			)
		} else if( !this.state.isViewDetails && this.state.isEditItem ) {
			return (
				<div>
					{this.rendorInventory(this.props.index)}
				</div>
			)
		}

	}
}

Item.proptypes = {
	items: PropTypes.object.isRequired,
	updateItem: PropTypes.func.isRequired,
	deleteItem: PropTypes.func.isRequired,
	details: PropTypes.object.isRequired,
	index: PropTypes.string.isRequired,
	addToList: PropTypes.func.isRequired
};

export default Item;