import React, { Component } from 'react';

class Login extends Component {
	render() {
		return (
			<div className="login">
				<form action="" method="POST">
					<label>Name</label>
					<input type="text" name="name" />
					<label>Password</label>
					<input type="password" name="password" />
					<button type="submit">Go</button>
				</form>
			</div>
		)
	}
}

export default Login;