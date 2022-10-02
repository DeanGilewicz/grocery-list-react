<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h2 align="center">Grocery List 🛒🥕🥑🍌</h2>
  <p align="center">
    A React JS Application!
  </p>
</div>

<br />
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#deployment">Deployment</a></li>
  </ol>
</details>

<br />

## About The Project

This application provides users a way to create items and add them to grocery lists. It also allows users to keep track of item inventory to determine what items need ordering.

There were several reasons for working on this project, including the chance to:

- implement UI with React JS
- use class components
- handle errors with context
- integrate with Firebase Realtime Database
- work with Firebase DB rules
- implement github auth via Firebase
- use localStorage
- use sessionStorage

Users must login via GitHub in order to access the application. Once successfully authenticated, user details are stored in `sessionStorage` to avoid the need to re-auth in the same session. Upon successful login, users create their grocery lists, which are stored in the DB.

A Firebase Realtime DB method is used to subscribe to changes and `componentDidUpdate` is used to run when state updates to keep `localStorage` in sync.

Once a grocery list is created and navigated to, items can be created, which are stored in the DB. Item details must be provided, including `stock` and `threshold`. `stock` represents the number of this item that the user currently has in possession. `threshold` represents the maximum number of this item that the user would like to have.

Once items are created they can be added to the `list` (grocery list). Items can only be added should its `stock` be less than its `threshold`. Users can edit items after they have been created to update details and adjust `stock` and `threshold`. `localStorage` is used to keep track of the `list`, it is not stored in the DB.

Items can either be added to the `list` individually or in bulk. When an individual item is added to the `list` it sets quantity of the item to 1. When bulk items are added via "populate from list", each item's quantity set to `threshold` minus `stock`. In addition to `quantity`, `onOrder` and `isComplete` are also added as additional properties on the item.

"Populate from list" will only add items where threshold minus stock is a positive number. Items are not able to be added to the `list` if they are already on it.

Once an item is on the `list`, the quantity of the item can be increased as long as the amount doesn't exceed `threshold` minus `stock`. An item's quantity can also be decreased but can't be less than 1.

When `onOrdered` is toggled to true, quantity can no longer be adjusted. This represents the item has been ordered. `isComplete` then becomes clickable.

When `isComplete` is selected the item's `stock` is updated in the DB based on the `quantity` that was determined by the user and the item's `stock`. This item is removed from the `list` and cannot be added again unless its `stock` is below its `threshold`.

Should a grocery list no longer be needed, then it can be deleted. This removes the grocery list (and its associated items) from the DB and also removes it from `localStorage`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### **Built With**

Below is a list of the major pieces of the tech stack that were used for this application.

- [![Firebase][firebase]][firebase-url]
- [![React][react]][react-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Getting Started

The following information will provide you with the details necessary to get the application up and running locally.

### **Prerequisites**

On your operating system of choice, ensure that [NodeJS](https://nodejs.org/en/) version `18.8.0` is installed. It is recommended that a Node Version Manager be used, such as [NVM](https://github.com/nvm-sh/nvm). When installing `NodeJS` this way, the correctly associated `npm` version should automatically be installed.

```sh
nvm install node@18.8.0
```

### **Installation**

Once `NodeJS` and `npm` are installed you can follow these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/DeanGilewicz/grocery-list-react.git
   ```
2. Install NPM packages
   ```sh
   npm i
   ```
3. Run the application
   ```sh
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Usage

This application provides a variety of commands in `package.json`:

- build
  - builds app for production to the build folder. Bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes
- deploy
  - pushes the contents of `build` folder to a new commit on the `gh-pages` branch of the project, creating that branch if it doesn't already exist
  - see [react-gh-pages](https://github.com/gitname/react-gh-pages)
- eject
  - one-way operation, once you eject you can't go back!
  - will remove the single build dependency and copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) into the project to provide full control over them
  - other commands will now point to the copied scripts
- predeploy
  - builds a distributable version of the app and stores it in a folder named `build`
  - see [react-gh-pages](https://github.com/gitname/react-gh-pages)
- start
  - runs the app in development mode. Opens [http://localhost:3000](http://localhost:3000) to view app in your browser
- test
  - launches test runner in interactive watch mode

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Deployment

This app is set up to be built and deployed to GitHub pages. However, it can also be built into a `build` folder via `npm run build` which can be deployed to other services.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[firebase]: https://img.shields.io/badge/Firebase-ffffff?style=for-the-badge&logo=firebase&logoColor=FFCA28
[firebase-url]: https://firebase.google.com/
[react]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
