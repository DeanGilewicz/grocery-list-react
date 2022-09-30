import React, { Component } from "react";
import {
	child,
	get,
	onValue,
	ref,
	remove,
	set,
	update,
} from "firebase/database";
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
		this.increaseListItemQuantity = this.increaseListItemQuantity.bind(this);
		this.decreaseListItemQuantity = this.decreaseListItemQuantity.bind(this);
		this.removeFromList = this.removeFromList.bind(this);
		this.markListItemOrdered = this.markListItemOrdered.bind(this);
		this.markListItemNotOrdered = this.markListItemNotOrdered.bind(this);
		this.markListItemComplete = this.markListItemComplete.bind(this);
		this.clearAllItemsFromList = this.clearAllItemsFromList.bind(this);
		this.populateListFromThreshold = this.populateListFromThreshold.bind(this);

		// app component
		this.sortItemsOnList = this.sortItemsOnList.bind(this);
		this.sortFn = this.sortFn.bind(this);

		// initial state
		this.state = {
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

		// current screen for grocery list (based on params - name)
		const itemsParentName = this.props.match.params.groceryListId;

		// if logged in user is not owner of this grocery list then kick out to login screen
		const dbRef = ref(base.base, itemsParentName);
		onValue(dbRef, (snapshot) => {
			const itemsParent = snapshot.val();

			if (itemsParent.owner !== userId) {
				return this.props.history.push("/");
			}

			// keep items in sync with Firebase
			this.setState({ items: itemsParent.items });

			// check if there is a list for this grocery name in localStorage
			const localStorageRef = JSON.parse(
				localStorage.getItem(`list-${this.props.match.params.groceryListId}`)
			);

			if (localStorageRef) {
				// set list from localStorage
				this.setState({ list: localStorageRef });
			}
		});
	}

	// keep localStorage in sync with app state
	componentDidUpdate(prevProps, prevState) {
		localStorage.setItem(
			`list-${this.props.match.params.groceryListId}`,
			JSON.stringify(this.state.list)
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
		const itemsParentName = this.props.match.params.groceryListId;
		const list = { ...this.state.list };

		update(ref(base.base, `${itemsParentName}/items/${key}`), {
			...updatedItem,
		})
			.then(() => {
				const items = { ...this.state.items };
				// check if item is on list (then is in localStorage)
				if (list[key]) {
					// we need to update localStorage list with updated item details
					list[key] = { ...list[key], ...items[key] };
					// update list state (localStorage)
					this.setState({ list });
				}
			})
			.catch((err) => {
				console.error("update-item update error", err);
				this.context.setError(
					"update-item",
					"Oh no. Unable to update item as something went wrong!"
				);
			});
	}

	// delete an item
	deleteItem(key) {
		const itemsParentName = this.props.match.params.groceryListId;
		// copy existing state
		const list = { ...this.state.list };
		// copy existing state
		// const items = { ...this.state.items };
		// delete items[key]; // typical way
		// items[key] = null; // firebase way
		// check if item exists on list - if it does then remove it and provide info to user

		// sync Firebase
		remove(ref(base.base, `${itemsParentName}/items/${key}`))
			.then(() => {
				// update list state (localStorage)
				if (list[key]) {
					delete list[key];
				}
				this.setState({ list });
			})
			.catch((err) => {
				console.error("delete-item remove error", err);
				this.context.setError(
					"remove-item",
					"Oh no. Unable to delete item as something went wrong!"
				);
			});
	}

	// initially add item to list with quantity value of 1
	addToList(key) {
		// copy existing state
		const list = { ...this.state.list };
		const items = { ...this.state.items };
		// copy base item to list
		list[key] = items[key];
		// set onOrder for this item on list
		list[key].onOrder = false;
		// set quantity property of this item
		list[key].quantity = 1;
		// set isComplete for this item on list
		list[key].isComplete = false;
		// update states for both list and items
		this.setState({ list, items });
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

	removeFromList(key) {
		// copy existing state
		const list = { ...this.state.list };
		// remove item from list
		delete list[key];
		// update list state
		this.setState({ list });
	}

	increaseListItemQuantity(key) {
		// copy existing state
		const list = { ...this.state.list };
		// update quantity property of this list item
		list[key].quantity = list[key].quantity + 1;
		// update list state
		this.setState({ list });
	}

	decreaseListItemQuantity(key) {
		// copy existing state
		const list = { ...this.state.list };
		// update quantity property of this list item
		list[key].quantity = list[key].quantity - 1;
		// update list state
		this.setState({ list });
	}

	markListItemOrdered(key) {
		// copy existing state
		const list = { ...this.state.list };
		// update onOrder
		list[key].onOrder = true;
		// update list state
		this.setState({ list });
	}

	markListItemNotOrdered(key) {
		// copy existing state
		const list = { ...this.state.list };
		// update onOrder
		list[key].onOrder = false;
		// update list state
		this.setState({ list });
	}

	markListItemComplete(key) {
		// copy existing state
		const list = { ...this.state.list };
		const items = { ...this.state.items };
		// update item quantity
		items[key].stock = parseInt(items[key].stock, 10) + list[key].quantity;
		// update isComplete
		list[key].isComplete = true;
		// update actual DB item
		this.updateItem(key, items[key]);
		// remove list item from list
		this.removeFromList(key);
	}

	clearAllItemsFromList() {
		// copy existing state
		let list = { ...this.state.list };
		// update list state
		list = {};
		// update list state
		this.setState({ list });
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
			const quantityDifference =
				parseInt(items[key].threshold, 10) - parseInt(items[key].stock, 10);
			// if difference is not greater than zero then do not add item to list
			if (quantityDifference <= 0) {
				return;
			}
			// add default props to list item
			list[key] = {
				...items[key],
				onOrder: false,
				quantity: quantityDifference,
				isComplete: false,
			};
		});

		// update list state
		this.setState({ list });
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
						list={this.state.list}
						items={this.state.items}
						addItem={this.addItem}
						updateItem={this.updateItem}
						deleteItem={this.deleteItem}
						addToList={this.addToList}
					/>
				</div>
				<div className="list">
					<List
						list={this.state.list}
						increaseListItemQuantity={this.increaseListItemQuantity}
						decreaseListItemQuantity={this.decreaseListItemQuantity}
						removeFromList={this.removeFromList}
						markListItemOrdered={this.markListItemOrdered}
						markListItemNotOrdered={this.markListItemNotOrdered}
						markListItemComplete={this.markListItemComplete}
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
