import React, { Component } from 'react';

class Item extends Component {
	render() {
		const { details, index } = this.props; // const details = this.props.details; const index = this.props.index;
		const button = (!details.onOrder) ? <button onClick={ () => {this.props.addToList(index)} }>Add To List</button> : '';
		return (
			<li>
				{/*<img src={details.image} alt={details.name} />*/}
				<h3>{details.name} - {details.brand}</h3>
				<p>Type: {details.type}</p>
				<p>Description: {details.description}</p>
				<p>Stock: {details.stock}</p>
				<p>Quantity: {details.quantity}</p>
				<p>Threshold: {details.threshold}</p>
				{button}
			</li>
		)
	}
}

export default Item;