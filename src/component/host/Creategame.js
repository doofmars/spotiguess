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
      <h1 className="cyan">Gamemaster
        <small className="text-muted">Login to start a game</small>
      </h1>
      <p className="text-danger" id="error">There was an error during the authentication</p>
      <button id="login-button" className="sbtn sbtn-green mb-1">Log in with Spotify</button>
    </div>
  );
}

function Create(props) {
  return (
    <div id="create">
      <div id="playlists"></div>
      <div className="container">
        <div className="row">
          <div className="col players">
          </div>
          <div className="col col-lg-4">
            <button className="sbtn sbtn-green mb-1 float-right" id="shuffle">
              Shuffle
            </button>
            <span className="text-danger align-middle" id="error-shuffle">Failed to start shuffle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
