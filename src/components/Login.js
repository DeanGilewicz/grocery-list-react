import React, { Component } from 'react';

class Login extends Component {

	goToList(e) {
		e.preventDefault();
		let groceryListName = this.groceryListNameInput.value;
		// go to the associated grocery list
		this.props.history.push(`/grocerylist/${groceryListName}`);
	}

	render() {
		return (
			<div className="login">
				{/*<form action="" method="POST" onSubmit={this.goToList.bind(this)}>*/}
				<form action="" method="POST" onSubmit={ (e) => {this.goToList(e)} }>
					<label>Grocery List Name</label>
					<input type="text" name="groceryListName" ref={ (input) => {this.groceryListNameInput = input} } />
					<button type="submit">Go</button>
				</form>

				{/*
					<form action="" method="POST" onSubmit={}>
						<label>Name</label>
						<input type="text" name="name" ref={} />
						<label>Password</label>
						<input type="password" name="password" ref={} />
						<button type="submit">Go</button>
					</form>
				*/}
			</div>
		)
	}
}

export default Login;