import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ErrorContext } from "./ErrorContext";

import "./css/normalize.css";
import "./css/index.css";

import Login from "./components/Login";
import App from "./components/App";
import NotFound from "./components/NotFound";

// github pages only
const repo = `/${window.location.pathname.split("/")[1]}`;

class Root extends Component {
	constructor() {
		super();

		// errors
		this.getErrorsByType = this.getErrorsByType.bind(this);
		this.setError = this.setError.bind(this);
		this.resetErrorsByType = this.resetErrorsByType.bind(this);
		this.clearErrors = this.clearErrors.bind(this);

		this.state = {
			errors: [],
		};
	}

	getErrorsByType(type) {
		return this.state.errors.filter((err) => err.type === type);
	}

	setError(type, msg) {
		// ideally we wouldn't need to do this but for
		// some edge cases errors isn't being reset
		const resetTypeErrors = this.state.errors.filter(
			(err) => err.type !== type
		);
		this.setState({
			errors: [...resetTypeErrors, { type, msg }],
		});
	}

	resetErrorsByType(type) {
		this.setState({
			errors: this.state.errors.filter((err) => err.type !== type),
		});
	}

	clearErrors() {
		this.setState({ errors: [] });
	}

	render() {
		return (
			<React.StrictMode>
				<BrowserRouter basename={repo}>
					<ErrorContext.Provider
						value={{
							errors: this.state.errors,
							getErrorsByType: this.getErrorsByType,
							setError: this.setError,
							resetErrorsByType: this.resetErrorsByType,
							clearErrors: this.clearErrors,
						}}
					>
						<div>
							<Switch>
								<Route exact path="/" component={Login} />
								<Route
									exact
									path="/grocerylist/:groceryListId"
									component={App}
								/>
								<Route component={NotFound} />
							</Switch>
						</div>
					</ErrorContext.Provider>
				</BrowserRouter>
			</React.StrictMode>
		);
	}
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Root />);
