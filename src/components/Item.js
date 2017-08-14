import React, { Component } from 'react';

class Item extends Component {

	constructor() {
		super();

		this.state = {
			viewDetails: false
		}
	}

	render() {
		const { details, index } = this.props; // const details = this.props.details; const index = this.props.index;
		const button = (!details.onOrder) ? <button onClick={ () => {this.props.addToList(index)} }>Add To List</button> : '';
		
		const itemImageStyle = { backgroundImage: 'url(' + details.image + ')'};

		if( !this.state.viewDetails ) {
			return (
				<li className="item__available_item">
					<div className="item__image" style={itemImageStyle}></div>
					<h3>{details.name}</h3>
					<p>{details.brand}</p>
					<button onClick={ () => this.setState({ viewDetails: true }) }>Details</button>
					{button}
				</li>
			)
		} else {
			return (
				<li className="item__available_item">
					<p className="item__category">{details.type}</p>
					<p>{details.description}</p>
					<p>Stock: {details.stock}</p>
					<p>Threshold: {details.threshold}</p>
					<button onClick={ () => this.setState({ viewDetails: false }) }>Back</button>
				</li>
			)
		}
	}
}

export default Item;