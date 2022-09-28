import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { GithubAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBl7wIIEpiWkXicnpURFE2dfqc3bY7M7_8",
	authDomain: "grocery-list-deano.firebaseapp.com",
	databaseURL: "https://grocery-list-deano.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const base = getDatabase(app);
const provider = new GithubAuthProvider();

const exports = { app, auth, base, provider };

export default exports;
