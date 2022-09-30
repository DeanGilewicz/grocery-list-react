import React, { Component } from "react";
import PropTypes from "prop-types";

class List extends Component {
	constructor() {
		super();
		this.renderList = this.renderList.bind(this);
		this.sortItemsOnList = this.sortItemsOnList.bind(this);

		this.state = {
			sortByName: false,
			sortByType: false,
		};
	}

	sortItemsOnList(sortBy, order) {
		const mapObj = {
			name: "sortByName",
			type: "sortByType",
		};
		const stateValue = mapObj[sortBy];
		// update state so can identity sort
		this.setState({ [stateValue]: true });
		// update global state
		this.props.sortItemsOnList(sortBy, order);
	}

	renderList(key) {
		const listItem = this.props.list[key];

		// return if no item found
		if (!listItem) {
			return;
		}

		const decreaseButton =
			listItem.quantity > 1 ? (
				<button
					className="list_item_qty_button"
					disabled={listItem.onOrder}
					onClick={() => {
						this.props.decreaseListItemQuantity(key);
					}}
				>
					-
				</button>
			) : (
				""
			);

		const increaseButton =
			parseInt(listItem.stock, 10) + parseInt(listItem.quantity, 10) <
			parseInt(listItem.threshold, 10) ? (
				<button
					className="list_item_qty_button"
					disabled={listItem.onOrder}
					onClick={() => {
						this.props.increaseListItemQuantity(key);
					}}
				>
					+
				</button>
			) : (
				""
			);

		const onOrderButton = listItem.onOrder ? (
			<button
				onClick={() => {
					this.props.markListItemNotOrdered(key);
				}}
			>
				Ordered
			</button>
		) : (
			<button
				onClick={() => {
					this.props.markListItemOrdered(key);
				}}
			>
				Not Ordered
			</button>
		);

		const isCompleteButton = (
			<button
				className="list_item_isComplete_button"
				disabled={!listItem.onOrder}
				onClick={() => {
					this.props.markListItemComplete(key);
				}}
			>
				Incomplete
			</button>
		);

		return (
			<li key={key} className={listItem.isComplete ? "complete" : ""}>
				<span>
					<button
						onClick={() => {
							this.props.removeFromList(key);
						}}
					>
						&times;
					</button>
				</span>
				<span>{decreaseButton}</span>
				<span>{listItem.quantity}</span>
				<span>{increaseButton}</span>
				<span>{listItem.name}</span>
				<span>{listItem.brand}</span>
				<span>{listItem.type}</span>
				<span>{onOrderButton}</span>
				<span>{isCompleteButton}</span>
			</li>
		);
	}

	render() {
		const listItemKeys = Object.keys(this.props.list);
		const sortByName = this.state.sortByName ? "sorted" : "";
		const sortByType = this.state.sortByType ? "sorted" : "";
		if (typeof listItemKeys !== "undefined" && listItemKeys.length > 0) {
			return (
				<div className="order">
					<h2>List</h2>
					<button
						onClick={() => {
							this.props.clearAllItemsFromList();
						}}
					>
						Reset List
					</button>
					<ul>
						<li className="list_headings">
							<span>Del</span>
							<span></span>
							<span>Qty</span>
							<span></span>
							<span
								className={`sortBy ${sortByName}`}
								onClick={() => {
									this.sortItemsOnList("name", "dec");
								}}
							>
								Name
							</span>
							<span>Brand</span>
							<span
								className={`sortBy ${sortByType}`}
								onClick={() => {
									this.sortItemsOnList("type");
								}}
							>
								Type
							</span>
							<span>Ordered</span>
							<span>Status</span>
						</li>
						{listItemKeys.map(this.renderList)}
					</ul>
				</div>
			);
		} else {
			return (
				<div className="order">
					<h2>List</h2>
					<button onClick={this.props.populateListFromThreshold}>
						Populate List
					</button>
					<p>--- There are currently no items on your list ---</p>
				</div>
			);
		}
	}
}

List.propTypes = {
	items: PropTypes.object, // optional - list may not contain items if delete all of them
	list: PropTypes.object.isRequired,
	sortItemsOnList: PropTypes.func.isRequired,
	decreaseListItemQuantity: PropTypes.func.isRequired,
	markListItemComplete: PropTypes.func.isRequired,
	removeFromList: PropTypes.func.isRequired,
	increaseListItemQuantity: PropTypes.func.isRequired,
	clearAllItemsFromList: PropTypes.func.isRequired,
	populateListFromThreshold: PropTypes.func.isRequired,
};

export default List;
