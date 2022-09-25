import React, { Component } from "react";
import PropTypes from "prop-types";
import AddGroceryItemForm from "./AddGroceryItemForm";
import Item from "./Item";

class Inventory extends Component {
	constructor() {
		super();

		this.addItem = this.addItem.bind(this);
		this.cancelAddItem = this.cancelAddItem.bind(this);

		this.state = {
			isViewInventory: false,
			isAddItem: false,
		};
	}

	addItem(item) {
		// delete item
		this.props.addItem(item);
		// update component state
		this.setState({ isAddItem: false });
	}

	cancelAddItem() {
		this.setState({ isAddItem: false });
	}

	render() {
		if (!this.state.isAddItem && !this.state.isViewInventory) {
			return (
				<div className="inventory">
					<h2>Inventory</h2>
					<button onClick={() => this.setState({ isAddItem: true })}>
						Create Item
					</button>
					<button onClick={() => this.setState({ isViewInventory: true })}>
						View Items
					</button>
				</div>
			);
		} else if (this.state.isAddItem && !this.state.isViewInventory) {
			return (
				<div>
					<h2>Inventory</h2>
					<AddGroceryItemForm
						addItem={this.addItem}
						cancelAddItem={this.cancelAddItem}
					/>
					{/*<button onClick={this.props.loadSampleItems}>Load Sample Items</button>*/}
				</div>
			);
		} else if (!this.state.isAddItem && this.state.isViewInventory) {
			return (
				<div className="items_modal_view">
					<button onClick={() => this.setState({ isViewInventory: false })}>
						Back To List
					</button>
					<ul className="items_available">
						{Object.keys(this.props.items).map((key) => (
							<Item
								key={key}
								index={key}
								details={this.props.items[key]}
								addToList={this.props.addToList}
								items={this.props.items}
								updateItem={this.props.updateItem}
								deleteItem={this.props.deleteItem}
							/>
						))}
					</ul>
				</div>
			);
		}
	}
}

Inventory.propTypes = {
	items: PropTypes.object.isRequired,
	addItem: PropTypes.func.isRequired,
	addToList: PropTypes.func.isRequired,
	updateItem: PropTypes.func.isRequired,
	deleteItem: PropTypes.func.isRequired,
};

export default Inventory;
