import React, { Component } from 'react';

class List extends Component {

	constructor() {
		super();
		this.renderList = this.renderList.bind(this);
		this.sortItemsOnList = this.sortItemsOnList.bind(this);

		this.state = {
			sortByName: false,
			sortByType: false
		};
	}

	sortItemsOnList(sortBy, order) {
		const mapObj = {
			name: 'sortByName',
			type: 'sortByType'
		};
		const stateValue = mapObj[sortBy];
		// update state so can identity sort
		this.setState({ [stateValue]: true });
		// update global state
		this.props.sortItemsOnList(sortBy, order);
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
				<span>{decreaseButton}</span>
				<span>{count}</span>
				<span><button disabled={item.isComplete} onClick={ () => {this.props.increaseItemOnList(key)} }>+</button></span>
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
		const sortByName = (this.state.sortByName) ? 'sorted' : '';
		const sortByType = (this.state.sortByType) ? 'sorted' : '';
		if( typeof listIds !== 'undefined' && listIds.length > 0 ) {
			return (
				<div className="order">
					<h2>List</h2>
					<button onClick={ () => {this.props.clearAllItemsFromList(listIds)} }>Reset List</button>
					<ul>
						<li className="list_headings">
							<span>Del</span>
							<span></span>
							<span>Qty</span>
							<span></span>
							<span className={`sortBy ${sortByName}`} onClick={ () => {this.sortItemsOnList('name', 'dec')} }>Name</span>
							<span>Brand</span>
							<span className={`sortBy ${sortByType}`} onClick={ () => {this.sortItemsOnList('type')} }>Type</span>
							<span>Status</span>
						</li>
						{listIds.map(this.renderList)}
					</ul>
				</div>
			)
		} else {
			return (
				<div className="order">
					<h2>List</h2>
					<button onClick={this.props.populateListFromThreshold}>Populate List</button>
					<p>--- There are currently no items on your list ---</p>
				</div>
			)
		}
	}

}

export default List;