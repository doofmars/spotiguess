import React from 'react';
import './App.css';
import openSocket from 'socket.io-client';
import Lobby from'./Lobby.js'
import Host from'./host/Host.js'
import LoginError from'./host/LoginError.js'
import getHashParams from'./logic/hash.js'

const socket = openSocket('http://localhost:3000');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: null,
      view: 'lobby'
    };
  }

  viewChangeEvent = (newView) => {
    this.setState({view: newView});
  }

  componentDidMount() {
    // Set token
    let _hash = getHashParams();

    if ('access_token' in _hash) {
      // Set token
      this.setState({
        hash: _hash
      });
      this.setState({
        view: "host"
      });
    }
    if ('error' in _hash) {
      this.setState({
        view: "error"
      });
    }
  }

  render() {
    let view;

    const gameState = this.state.view;

    if (gameState === 'host') {
      view = <Host viewChangeEvent={this.viewChangeEvent} hash={this.state.hash} />
    } else if (gameState === 'lobby') {
      view = <Lobby viewChangeEvent={this.viewChangeEvent} />
    } else if (gameState === 'error') {
      view = <LoginError viewChangeEvent={this.viewChangeEvent} />
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}
