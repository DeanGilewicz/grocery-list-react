# Grocery List

TODO:

- sync up `update()`
  - item in app.js
- refactor app - use context for firebase CUD methods?

---

- use React class
- handle errors with context

- "list" is local only - is not persisted
- "items" are persisted in Firebase
- items are created (inventory) and stock and threshold set
- populate list creates the list based on item's stock and threshold difference
- user can manually add any item to the list (if not added already will not show in overlay)
- localStorage used to keep track of the "list"
- sessionStorage used so no need to continually auth in in the same session (stores user id)

onOrder = true ... currently on list and ordered at store
onOrder = false ... not on list (should add an ordered all button / checkout to note we ordered a single item from list)

isComplete = true ... currently on list, ordered at store AND received
\*\* we update stock when it's complete based on the quantity ordered from list

In the project directory, you can run:

```sh
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.

```sh
npm test
```

Launches the test runner in the interactive watch mode.

```sh
npm run build
```

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

```sh
npm run eject
```

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature.
