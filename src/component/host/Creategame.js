import React from 'react';
import './Creategame.css';

export default class Creategame extends React.Component {

  render() {
    return (
     <div className="container">
       <Login />
       <Create />
     </div>
    );
  }
}

function Login(props) {
  return (
    <div id="login">
      <h1 class="cyan">Gamemaster
        <small class="text-muted">Login to start a game</small>
      </h1>
      <p class="text-danger" id="error">There was an error during the authentication</p>
      <button id="login-button" class="sbtn sbtn-green mb-1">Log in with Spotify</button>
    </div>
  );
}

function Create(props) {
  return (
    <div id="create">
      <div id="playlists"></div>
      <div class="container">
        <div class="row">
          <div class="col players">
          </div>
          <div class="col col-lg-4">
            <button class="sbtn sbtn-green mb-1 float-right" id="shuffle">
              Shuffle
            </button>
            <span class="text-danger align-middle" id="error-shuffle">Failed to start shuffle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
