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
		
		const decreaseButton = (item.quantity > 1) ? <button disabled={item.isComplete} onClick={ () => {this.props.decreaseItemOnList(key) } }>-</button> : '';
		const statusButton = (item.isComplete) ? <button onClick={ () => {this.props.markItemIncomplete(key)} }>Incomplete</button> : <button onClick={ () => {this.props.markItemComplete(key)} }>Complete</button>;

		return (
			<li key={key}>
				<span>
					<button onClick={ () => {this.props.removeFromList(key)} }>&times;</button>
				</span>
				<span>
					{decreaseButton}
					{count}
					<button disabled={item.isComplete} onClick={ () => {this.props.increaseItemOnList(key)} }>+</button>
				</span>
				<span>{item.name}</span>
				<span>{item.brand}</span>
				<span>{item.type}</span>
				<span>
					{statusButton}
				</span>
			</li>
		)
	}

	render () {
		const listIds = Object.keys(this.props.list);
		if( typeof listIds !== 'undefined' && listIds.length > 0 ) {
			return (
				<div className="order">
					<button onClick={ () => {this.props.clearAllItemsFromList(listIds)} }>Clear List</button>
					<ul>
						<li>
							<span>Del</span>
							<span>Qty</span>
							<span onClick={ () => {this.props.sortItemsOnList('name', 'dec')} }>Name ></span>
							<span>Brand</span>
							<span onClick={ () => {this.props.sortItemsOnList('type')} }>Type ></span>
							<span>Status</span>
						</li>
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