import React, { Component } from 'react';

class Item extends Component {
	render() {
		const { details } = this.props;
		const isMaxed = (details.remaining + details.onOrder) >= details.threshold;
		const buttonText = isMaxed ? 'Over Threshold' : 'Add to List';
		return (
			<li>
				<img src={details.image} alt={details.name} />
				<h3>{details.name} - {details.brand}</h3>
				<p>{details.type}</p>
				<p>{details.description}</p>
				<p>{details.remaining}</p>
				<p>{details.onOrder}</p>
				<p>{details.threshold}</p>
				<button disabled={isMaxed}>{buttonText}</button>
			</li>
		)
	}
}

export default Item;