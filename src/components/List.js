import React, { Component } from 'react';

class List extends Component {

	constructor() {
		super();
		this.renderList = this.renderList.bind(this);
	}

	renderList(key) {
		const item = this.props.items[key];
		const count = this.props.list[key];
		const decreaseButton = (item.quantity > 1) ? <button onClick={ () => {this.props.decreaseItemOnList(key) } }>-</button> : '';

		return (
			<li key={key}>
				<span>{item.name}: </span>
				<strong>{count}</strong><br/>
				<span>{item.brand} - {item.type}</span>
				<button onClick={ () => {this.props.increaseItemOnList(key) } }>+</button>
				{decreaseButton}
			</li>
		)
	}

	render () {
		const listIds = Object.keys(this.props.list);
		return (
			<div className="order">
				<h2>My List</h2>
				<ul>
					{listIds.map(this.renderList)}
				</ul>
			</div>
		)
	}
}

export default List;