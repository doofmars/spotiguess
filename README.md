Spotiguess
==========

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Features:

- Connect to Spotify API to get your collaborative play-lists
- Select a play-list
- Start a gaming session with a join key (e.g. NWAQTX)
    + this device will be the game master
    + Can start game, kick players and act as an admin
    + (Defines number of rounds played)
- Up to 4 players can join the session using the key
    + Mobile devices, tablets or smart-phones
    + Desktop devices also possible
- Random song is selected from play-list
    + Information presented: album cover, artist, title and sample music
- The player can select any collaborator of the play-list as answer.
- Points are awarded for correct answers.
- A new random song is selected from play-list
- If number of rounds is reached a player point summary is displayed

# Technical details

- Node js back-end with express
- Socket.io for game-master <-> player communication
- Bootstrap for responsive design

# Extension features

- Meta questions:
    + Who added the most songs
    + Who has the longest streak (in songs)
    + Who has the longest streak (in time)
    + Who has added the most unavailable songs (from the perspective of the game master)
- Admin interface on the game master

# Setup:

The frontend is developed with react the backend uses socket io for client to client communication.
Run server.ts for nodejs server + express for frontend delivery
`node server`
The server will listen on port 3000
If frontend has been build `yarn build` the server uses the express framework to deliver the app build for production.

## React development

In the project directory, you can run:

### `yarn develop`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn start`

Runs the app as node server in production mode.<br />
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**


