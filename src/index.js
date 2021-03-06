import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './css/normalize.css';
import './css/index.css';

import Login from './components/Login';
import App from './components/App';
import NotFound from './components/NotFound';
// import registerServiceWorker from './registerServiceWorker';

// github pages only
const repo = `/${window.location.pathname.split('/')[1]}`;

const Root = () => {
	return (
		<BrowserRouter basename={repo}>
			<div>
				<Switch>
					<Route 
						exact 
						path="/"
						component={Login}
						// render={ (match) => <Login routeInfo={match} /> }
					/>
					<Route 
						exact
						path="/grocerylist/:groceryListId"
						component={App}
						// render={ (match) => <App match={match} /> }
					/>
					<Route component={NotFound} />
				</Switch>
			</div>
		</BrowserRouter>
	)
}


ReactDOM.render(<Root />, document.getElementById('root'));
// registerServiceWorker();
