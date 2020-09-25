import React from 'react';
import './Lobby.css';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3000');

export default class Lobby extends React.Component {

  render() {
    return (
      <div class="content-start">
        <div className="Lobby">
          <h1 class="cyan mb-3 block">Spotiguess</h1>
          <div id="gamestart">
            <button class="sbtn sbtn-green mb-1 btn-block" id="login-button" type="button">
              Create new game
            </button>
            <p class="text-white mb-4">
              Login using your spoitify account,
              to access your playlists
            </p>
            <button class="sbtn sbtn-white mb-1 btn-block" id="join-init" type="button">
              Join Game
            </button>
            <p class="text-white">
              Join an active session
            </p>
            <div id="join-info">
              <input id="name" type="text" class="form-control mb-1" placeholder="Name" />
              <input id="room-code" type="text" class="form-control mb-1" maxlength="5" placeholder="Roomkey" />
              <button class="sbtn sbtn-green mb-1 float-right" id="join-accept" type="button">
                Join
              </button>
              <p id="bad-message" class="text-danger"></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

