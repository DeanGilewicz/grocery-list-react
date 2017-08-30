import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import base from '../base';

class Login extends Component {

	constructor() {
		super();

		this.authenticate = this.authenticate.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.createGroceryList = this.createGroceryList.bind(this);
		this.setUpLoggedInUser = this.setUpLoggedInUser.bind(this);
		this.logOut = this.logOut.bind(this);

		this.state = {
			uid: null,
			groceryListUrls: null
		}

	}

	componentDidMount() {
		base.app.auth().onAuthStateChanged((user, error) => {
		  if(user) { this.setUpLoggedInUser(user.uid); }
		});
	}

	goToList(groceryListKey) {
		const groceryListUrl = this.state.groceryListUrls[groceryListKey];
		// go to the associated grocery list
		this.props.history.push(`/grocerylist/${groceryListUrl}`);
	}

	authenticate() {

		const provider = new firebase.auth.GithubAuthProvider();

		base.app.auth().signInWithPopup(provider).then(result => {

			let userId = result.user.uid;

			this.setUpLoggedInUser(userId);

		}).catch(error => {
			console.error(error);
			return;
		});
	
	}

	setUpLoggedInUser(userId) {
		return base.base.fetch('/', {
			context: this,
			asArray: true
		}).then(groceryLists => {

			let userGroceryLists = groceryLists.map(groceryList => {
				// if logged in user id matches grocery list owner id then return the grocery list url
				if( groceryList.owner === userId ) {
					return groceryList.key;
				}
			});

			// set state -> user id and users grocery lists
			this.setState({
				uid: userId,
				groceryListUrls: userGroceryLists
			});

			// set key on session storage to use in App route since not assoicated by parent component
			return sessionStorage.setItem('userId', userId);

		}).catch(error => {
			//handle error
			console.error(error);
			return;
		});
	}

	logOut() {
		base.app.auth().signOut().then(() => {
			// return value is null
			this.setState({
				uid: null,
				groceryListUrls: null
			});

			// clear key on session storage
			return sessionStorage.removeItem('userId');
		});
	}

	createGroceryList(e) {
		e.preventDefault();

		let newGroceryListName = this.groceryListNameInput.value;
	
		// query firebase db to get all grocery lists
		base.base.fetch('/', {
			context: this,
			asArray: true
		}).then(groceryLists => {
			let nameExists = groceryLists.find(groceryList => {
				//  return grocery list in db that has the name that user entered
				return groceryList.key === newGroceryListName;
			});

			// handle if name already exists
			if( nameExists ) { return; }

			// add grocery list record in db and add owner to that record 
			base.base.post(`/${newGroceryListName}`, {
				data: {owner: this.state.uid}
			}).then(() => {
				// copy existing state grocery list url obj
				const groceryListUrls = [...this.state.groceryListUrls];
				// add new grocery list url to state
				groceryListUrls.push(newGroceryListName);
				// update state to include this record
				this.setState({ groceryListUrls: groceryListUrls });

			}).catch(error => {
				// handle error
				console.error(error);
				return;
			});

		}).catch(error => {
			// handle error
			console.error(error);
			return;
		});

	}
	
	renderLogin() {
		return (
			<div className="login">
				<nav>
					<h2>Sign In</h2>
					<p>Log in to manage your grocery lists</p>
					<button className="github" onClick={this.authenticate}>Login with GitHub</button>
				</nav>
			</div>
		)
	}

	render() {
		const logOut = <button onClick={this.logOut}>Log Out</button>;

		// check if user not logged in at all
		if( !this.state.uid ) {
			return <div>{this.renderLogin()}</div>
		}

		// check if any grocery lists created by logged in user
		if( this.state.uid && !this.state.groceryListUrls ) {
			return (
				<div className="login">
					<p>You haven't created a grocery list yet. Create one now!</p>

					<form action="" method="POST" onSubmit={ (e) => {this.createGroceryList(e)} }>
						<label>Grocery List Name</label>
						<input type="text" name="groceryListName" ref={ (input) => {this.groceryListNameInput = input} } />
						<button type="submit">Go</button>
					</form>

					{logOut}
				</div>
			)
		}

		return (

			<div className="login">

				{/*<form action="" method="POST" onSubmit={this.goToList.bind(this)}>*/}
				
				<p>Go to one of your already created grocery lists</p>

				{
					Object
						.keys(this.state.groceryListUrls)
						.map((key) => {
							return (
								<p key={key} onClick={ () => {this.goToList(key)} }>{this.state.groceryListUrls[key]}</p>
							)
						})
				}

				<p>Create a new grocery list:</p>

				<form action="" method="POST" onSubmit={ (e) => {this.createGroceryList(e)} }>
					<label>Grocery List Name</label>
					<input type="text" name="groceryListName" ref={ (input) => {this.groceryListNameInput = input} } />
					<button type="submit">Go</button>
				</form>

				{logOut}

			</div>
		)
	}
}

Login.proptypes = {
	history: PropTypes.object.isRequired
};

export default Login;