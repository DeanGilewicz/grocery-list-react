import React, { Component } from 'react';

class Item extends Component {
	render() {
		const { details } = this.props;
		return (
			<li>
				<img src={details.image} alt={details.name} />
				<h3>{details.name} - {details.brand}</h3>
				<p>{details.type}</p>
				<p>{details.description}</p>
				<p>{details.remaining}</p>
				<p>{details.onOrder}</p>
				<p>{details.threshold}</p>
				<button>Add to List</button>
			</li>
		)
	}
}

export default Item;