import React, { Component } from "react";
import { child, get, onValue, ref, set, update } from "firebase/database";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./Header";
import Inventory from "./Inventory";
import List from "./List";

// mock data
// import sampleItems from '../sample-items';

// firebase
import base from "../base";
import { ErrorContext } from "../ErrorContext";

class App extends Component {
	static contextType = ErrorContext;

	constructor() {
		super();

		// mock data
		// this.loadSampleItems = this.loadSampleItems.bind(this);

		// inventory component
		this.addItem = this.addItem.bind(this);
		this.updateItem = this.updateItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);

		// item component
		this.addToList = this.addToList.bind(this);

		// list component
		this.increaseItemOnList = this.increaseItemOnList.bind(this);
		this.decreaseItemOnList = this.decreaseItemOnList.bind(this);
		this.removeFromList = this.removeFromList.bind(this);
		this.markItemComplete = this.markItemComplete.bind(this);
		this.markItemIncomplete = this.markItemIncomplete.bind(this);
		this.clearAllItemsFromList = this.clearAllItemsFromList.bind(this);
		this.populateListFromThreshold = this.populateListFromThreshold.bind(this);

		// app component
		this.sortItemsOnList = this.sortItemsOnList.bind(this);
		this.sortFn = this.sortFn.bind(this);

		// initial state
		this.state = {
			errors: [],
			items: {},
			list: {},
		};
	}

	componentDidMount() {
		const userId = sessionStorage.getItem("userId");

		// no user id then kick out to login screen
		if (!userId) {
			return this.props.history.push("/");
		}

		const itemsParentName = this.props.match.params.groceryListId;

		// logged in user is not owner of this grocery list then kick out to login screen
		const dbRef = ref(base.base, itemsParentName);
		onValue(dbRef, (snapshot) => {
			const itemsParent = snapshot.val();

			if (itemsParent.owner !== userId) {
				return this.props.history.push("/");
			}

			this.setState({
				items: itemsParent.items,
			});
			// check if there is any list in localStorage
			const localStorageRef = JSON.parse(
				localStorage.getItem(`list-${this.props.match.params.groceryListId}`)
			);

			if (localStorageRef) {
				// update our App component's list state
				this.setState({
					list: localStorageRef,
				});
			}
		});
	}

	componentDidUpdate(nextProps, nextState) {
		localStorage.setItem(
			`list-${this.props.match.params.groceryListId}`,
			JSON.stringify(nextState.list)
		);
	}

	// mock data - items
	// loadSampleItems() {
	// 	this.setState({ items: sampleItems });
	// }

	// add new item using name as unique identifier
	addItem(item) {
		const context = this.context;

		if (!validateItem(item)) {
			return context.setError("add-item", "Required fields missing!");
		}

		const itemsParentName = this.props.match.params.groceryListId;

		// query DB to determine if item name is in use
		const dbRef = ref(base.base);
		get(
			child(
				dbRef,
				`${itemsParentName.toLowerCase()}/${item.name.toLowerCase()}`
			)
		)
			.then((snapshot) => {
				if (snapshot.exists()) {
					context.setError(
						"create-item",
						"Unable to create item as name is already in use!"
					);
					return;
				}
				// ok to create since item name isn't in use
				const itemKey = item.name.trim().replaceAll(" ", "-").toLowerCase();
				set(ref(base.base, `${itemsParentName}/items/${itemKey}`), {
					...item,
				}).catch((err) => {
					console.error("create-item set error", err);
					context.setError(
						"create-item",
						"Oh no. Unable to create item as something went wrong!"
					);
				});
			})
			.catch((error) => {
				console.error("create-item get error", error);
				context.setError(
					"create-item",
					"Oh no. Unable to create item as something went wrong!"
				);
			});
	}

	// update an existing item
	updateItem(key, updatedItem) {
		const items = { ...this.state.items };
		items[key] = updatedItem;
		this.setState({ items: items });
		// TODO: this works but refactor
		// update(ref(base.base, `demo/items/${key}`), {
		// 	...updatedItem,
		// 	threshold: 10,
		// }).catch((err) => {
		// 	console.error("create-item set error", err);
		// 	// context.setError(
		// 	// 	"create-item",
		// 	// 	"Oh no. Unable to create item as something went wrong!"
		// 	// );
		// });
	}

	// delete an item
	deleteItem(key) {
		// copy existing state
		const list = { ...this.state.list };
		// copy existing state
		const items = { ...this.state.items };
		// delete items[key]; // typical way
		items[key] = null; // firebase way
		// check if item exists on list - if it does then remove it and provide info to user
		if (list[key]) {
			delete list[key];
			// TODO: inform user item was removed from list since deleted
		}
		// update state for items
		this.setState({ items: items, list: list });
	}

	// initially add item to list with quantity value of 1
	addToList(key) {
		// copy existing state
		const list = { ...this.state.list };
		// copy existing state
		const items = { ...this.state.items };
		// update onOrder property of this item since now on list
		items[key].onOrder = false;
		// update quantity property of this item
		items[key].quantity = items[key].quantity = 1;
		// add new number of item ordered to list
		list[key] = items[key].quantity;
		// update states for both list and items
		this.setState({ list: list, items: items });
	}

	// sort function - prop = property to sort by - order = asc or des
	sortFn(prop, order = "asc") {
		// copy existing state
		const items = { ...this.state.items };
		return function (a, b) {
			if (order !== "asc") {
				return items[a][prop] < items[b][prop];
			}
			return items[a][prop] > items[b][prop];
		};
	}

	// filter items on list
	sortItemsOnList(sortBy, order) {
		// copy existing state
		const items = { ...this.state.items };
		// copy existing state
		const list = { ...this.state.list };
		// sorted array ref
		const sortedList = Object.keys(list).sort(this.sortFn(sortBy, order));
		// set an object
		let sortedObj = {};
		// loop through the listids on list and set up obj data to be returned
		sortedList.forEach((itemKey) => {
			// get quantity for items on list
			sortedObj[itemKey] = items[itemKey].quantity;
		});
		// update list state to use sorted items order
		this.setState({ list: sortedObj });
	}

	// once item on list then delete from list and reset quantity to 0
	removeFromList(key) {
		// copy existing state
		const list = { ...this.state.list };
		// copy existing state
		const items = { ...this.state.items };
		// update onOrder property of this item since now removed from list
		items[key].onOrder = false;
		// update quantity property of this item
		items[key].quantity = 0;
		// update isComplete prop in case item has been completed
		items[key].isComplete = false;
		// remove item from list
		delete list[key];
		// update states for both list and items
		this.setState({ list: list, items: items });
	}

	// once item on list then control quantity
	increaseItemOnList(key) {
		// copy existing state
		const list = { ...this.state.list };
		// copy existing state
		const items = { ...this.state.items };
		// update quantity property of this item
		items[key].quantity = items[key].quantity + 1;
		// update number of item ordered from list
		list[key] = items[key].quantity;
		// update states for both list and items
		this.setState({ list: list, items: items });
	}

	// once item on list then control quantity
	decreaseItemOnList(key) {
		// copy existing state
		const list = { ...this.state.list };
		// copy existing state
		const items = { ...this.state.items };
		// update quantity property of this item
		items[key].quantity = items[key].quantity - 1;
		// decrease number of item ordered from list
		list[key] = items[key].quantity;
		// update states for both list and items
		this.setState({ list: list, items: items });
	}

	markItemComplete(key) {
		// copy existing state
		const items = { ...this.state.items };
		// add quantity to current stock
		items[key].stock = parseInt(items[key].stock, 10) + items[key].quantity;
		// update isComplete Property
		items[key].isComplete = true;
		// update state for items
		this.setState({ items: items });
	}

	markItemIncomplete(key) {
		// copy existing state
		const items = { ...this.state.items };
		// remove quantity from current stock
		items[key].stock = parseInt(items[key].stock, 10) - items[key].quantity;
		// update isComplete Property
		items[key].isComplete = false;
		// update state for items
		this.setState({ items: items });
	}

	clearAllItemsFromList(itemIds) {
		// copy existing state
		let list = { ...this.state.list };
		// copy existing state
		const items = { ...this.state.items };
		// update list state
		list = {};
		// reset item properties - loop through items based on itemIds provided
		itemIds.forEach((itemId) => {
			items[itemId].onOrder = false;
			items[itemId].isComplete = false;
			items[itemId].quantity = 0;
		});
		// update state for items
		this.setState({ list: list, items: items });
	}

	populateListFromThreshold() {
		// copy existing state
		const list = { ...this.state.list };
		// copy existing state
		const items = { ...this.state.items };

		// only allow if list is empty
		if (Object.keys(list).length > 0 && list.constructor === Object) {
			return;
		}

		// get quantity difference of threshold minus stock for each item
		Object.keys(items).forEach((key) => {
			const quantityDifference = items[key].threshold - items[key].stock;
			// if difference is not greater than zero then do not add item to list
			if (quantityDifference <= 0) {
				return;
			}
			items[key].onOrder = false;
			// update quantity property of this item
			items[key].quantity = quantityDifference;
			// add new number of item ordered to list
			list[key] = items[key].quantity;
		});

		// update states for both list and items
		this.setState({ list: list, items: items });
	}

	render() {
		return (
			<div className="app">
				<Link to="/" className="button">
					Home
				</Link>
				<Header tagline={`${this.props.match.params.groceryListId}`} />
				<div className="menu">
					<Inventory
						// loadSampleItems={this.loadSampleItems}
						items={this.state.items}
						addItem={this.addItem}
						updateItem={this.updateItem}
						deleteItem={this.deleteItem}
						addToList={this.addToList}
					/>
				</div>
				<div className="list">
					<List
						items={this.state.items}
						list={this.state.list}
						increaseItemOnList={this.increaseItemOnList}
						decreaseItemOnList={this.decreaseItemOnList}
						removeFromList={this.removeFromList}
						markItemComplete={this.markItemComplete}
						markItemIncomplete={this.markItemIncomplete}
						clearAllItemsFromList={this.clearAllItemsFromList}
						sortItemsOnList={this.sortItemsOnList}
						populateListFromThreshold={this.populateListFromThreshold}
					/>
				</div>
			</div>
		);
	}
}

function validateItem(item) {
	let isValidated = true;
	if (!item.brand) isValidated = false;
	if (!item.name) isValidated = false;
	if (!item.stock) isValidated = false;
	if (!item.threshold) isValidated = false;
	if (!item.type) isValidated = false;
	return isValidated;
}

App.propTypes = {
	match: PropTypes.object.isRequired,
};

export default App;
