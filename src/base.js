import Rebase from 're-base';
import firebase from 'firebase';

const app = firebase.initializeApp({
	apiKey: "AIzaSyBl7wIIEpiWkXicnpURFE2dfqc3bY7M7_8",
	authDomain: "grocery-list-deano.firebaseapp.com",
	databaseURL: "https://grocery-list-deano.firebaseio.com"
});

const base = Rebase.createClass(app.database());

export default {
	app: app,
	base: base
}