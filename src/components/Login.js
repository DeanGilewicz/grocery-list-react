import React, { Component } from "react";
import { signInWithPopup } from "firebase/auth";
import { child, get, onValue, ref, set } from "firebase/database";
import PropTypes from "prop-types";
import base from "../base";
import { ErrorContext } from "../ErrorContext";

class Login extends Component {
	static contextType = ErrorContext;

	constructor() {
		super();

		this.authenticate = this.authenticate.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.createGroceryList = this.createGroceryList.bind(this);
		this.setUpLoggedInUser = this.setUpLoggedInUser.bind(this);
		this.logOut = this.logOut.bind(this);

		this.state = {
			groceryListUrls: null,
			uid: null,
		};
	}

	componentDidMount() {
		base.auth.onAuthStateChanged((user, error) => {
			if (user) {
				this.setUpLoggedInUser(user.uid);
			}
		});
	}

	goToList(groceryListKey) {
		const groceryListUrl = this.state.groceryListUrls[groceryListKey];
		// go to the associated grocery list
		this.props.history.push(`/grocerylist/${groceryListUrl}`);
	}

	authenticate() {
		signInWithPopup(base.auth, base.provider)
			.then((result) => {
				this.setUpLoggedInUser(result.user.uid);
			})
			.catch((error) => {
				console.error(error);
				return;
			});
	}

	setUpLoggedInUser(userId) {
		const dbRef = ref(base.base, "/");
		onValue(dbRef, (snapshot) => {
			const lists = snapshot.val();

			// retrieve any "lists" that this user owns
			const ownedLists = Object.keys(lists).filter((key) => {
				return lists[key].owner === userId;
			});

			// set state -> user id and user's grocery lists
			this.setState({
				uid: userId,
				groceryListUrls: ownedLists,
			});

			// set key on session storage to use in App route since not associated by parent component
			return sessionStorage.setItem("userId", userId);
		});
	}

	logOut() {
		base.auth.signOut().then(() => {
			// return value is null
			this.setState({
				uid: null,
				groceryListUrls: null,
			});

			// clear key on session storage
			return sessionStorage.removeItem("userId");
		});
	}

	createGroceryList(e) {
		// prevent form submit
		e.preventDefault();

		const context = this.context;

		// remove all create-list errors
		context.resetErrorsByType("create-list");

		const newGroceryListName = this.groceryListNameInput;

		// query DB to determine if name is in use
		const dbRef = ref(base.base);
		get(child(dbRef, `${newGroceryListName.value.toLowerCase()}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					context.setError(
						"create-list",
						"Unable to create as name is already in use!"
					);
					return;
				}
				// ok to create since name isn't in use
				// lowercase so consistent when check for existence
				set(ref(base.base, `${newGroceryListName.value.toLowerCase()}`), {
					owner: this.state.uid,
				})
					.catch((err) => {
						console.error("create-list set error", err);
						context.setError(
							"create-list",
							"Oh no. Unable to create as something went wrong!"
						);
					})
					.finally(() => {
						// reset form field
						newGroceryListName.value = "";
					});
			})
			.catch((error) => {
				console.error("create-list get error", error);
				context.setError(
					"create-list",
					"Oh no. Unable to create list as something went wrong!"
				);
			});
	}

	renderLogin() {
		return (
			<div className="login">
				<nav>
					<h2>Sign In</h2>
					<p>Log in here to manage your grocery lists:</p>
					<button className="github" onClick={this.authenticate}>
						Login with GitHub
					</button>
				</nav>
			</div>
		);
	}

	render() {
		const logOut = <button onClick={this.logOut}>Log Out</button>;

		// check if user not logged in at all
		if (!this.state.uid) {
			return <div>{this.renderLogin()}</div>;
		}

		// check if any lists created by logged in user
		if (this.state.uid && !this.state.groceryListUrls) {
			return (
				<div className="login">
					{logOut}

					<p>You haven't created a grocery list yet. Create one now!</p>

					<form
						action=""
						method="POST"
						className="login_form"
						onSubmit={(e) => {
							this.createGroceryList(e);
						}}
					>
						<label htmlFor="name">Name</label>
						<input
							type="text"
							name="groceryListName"
							id="name"
							ref={(input) => {
								this.groceryListNameInput = input;
							}}
						/>
						<button type="submit">Go</button>
					</form>
				</div>
			);
		}

		return (
			<div className="login">
				{logOut}

				<p>Go to one of your already created grocery lists:</p>

				{Object.keys(this.state.groceryListUrls).map((key) => {
					return (
						<button
							key={key}
							className="button"
							onClick={() => {
								this.goToList(key);
							}}
						>
							{this.state.groceryListUrls[key]}
						</button>
					);
				})}

				<p>Create a new grocery list:</p>

				<form
					action=""
					method="POST"
					className="login_form"
					onSubmit={(e) => {
						this.createGroceryList(e);
					}}
				>
					<label htmlFor="name">Name</label>
					<input
						type="text"
						name="groceryListName"
						id="name"
						ref={(input) => {
							this.groceryListNameInput = input;
						}}
					/>
					<button type="submit">Go</button>
				</form>

				{this.context.getErrorsByType("create-list").length > 0 && (
					<ul>
						{this.context
							.getErrorsByType("create-list")
							.map(({ msg, type }) => (
								<li key={`${type}-${msg}`}>{msg}</li>
							))}
					</ul>
				)}
			</div>
		);
	}
}

Login.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Login;
