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
console.log("auth", auth);
const base = getDatabase(app);
console.log("base", base);
const provider = new GithubAuthProvider();
console.log("provider", provider);

export default {
	app,
	auth,
	base,
	provider,
};
