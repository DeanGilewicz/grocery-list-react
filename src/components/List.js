import React, { Component } from 'react';

class List extends Component {

	constructor() {
		super();
		this.renderList = this.renderList.bind(this);
	}

	renderList(key) {
		const item = this.props.items[key];
		const count = this.props.list[key];
		
		// return if no item found
		if( !item ) { return; }
		
		const decreaseButton = (item.quantity > 1) ? <button onClick={ () => {this.props.decreaseItemOnList(key) } }>-</button> : '';

		return (
			<li key={key}>
				<span>{count}</span>
				<span>{item.name}</span>
				<span>{item.brand}</span>
				<span>{item.type}</span>
				<span>
					<button onClick={ () => {this.props.increaseItemOnList(key)} }>+</button>
					{decreaseButton}
					<button onClick={ () => {this.props.removeFromList(key)} }>&times;</button>
				</span>
			</li>
		)
	}

	render () {
		const listIds = Object.keys(this.props.list);
		if( typeof listIds !== 'undefined' && listIds.length > 0 ) {
			return (
				<div className="order">
					<ul>
						{listIds.map(this.renderList)}
					</ul>
				</div>
			)
		} else {
			return (
				<div className="order">
					<p>--- There are currently no items on your list ---</p>
				</div>
			)
		}
	}

}

export default List;