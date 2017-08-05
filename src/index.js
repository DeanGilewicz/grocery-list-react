import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './css/normalize.css';
import './css/index.css';

import Login from './components/Login';
import App from './components/App';
import NotFound from './components/NotFound';
// import registerServiceWorker from './registerServiceWorker';

const Root = () => {
	return (
		<BrowserRouter>
			<div>
				<Switch>
					<Route 
						exact 
						path="/"
						component={Login}
					/>
					<Route 
						exact
						path="/grocerylist/:groceryListId"
						// render={ (match) => <nameOfComponent /> }
						component={App}
					/>
					<Route component={NotFound} />
				</Switch>
			</div>
		</BrowserRouter>
	)
}


ReactDOM.render(<Root />, document.getElementById('root'));
// registerServiceWorker();
