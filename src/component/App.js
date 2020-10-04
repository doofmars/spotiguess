import React from 'react';
import './App.css';
import Lobby from'./Lobby.js'
import Host from'./host/Host.js'
import LoginError from'./host/LoginError.js'
import Voting from'./player/Voting.js'
import getHashParams from'./logic/hash.js'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: null,
      view: 'lobby',
      message: '',
    };
  }

  viewChangeEvent = (newView, message) => {
    if (message) {
      console.log(message);
      this.setState({view: newView, message: message});
    } else {
      this.setState({view: newView, message: ''});
    }
  }

  votingViewChange = (name, roomcode) => {
    this.setState({view: "vote", name: name, roomcode: roomcode});
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
      view = <Lobby votingViewChange={this.votingViewChange} />
    } else if (gameState === 'error') {
      view = <LoginError viewChangeEvent={this.viewChangeEvent} message={this.state.message} />
    } else if (gameState === 'vote') {
      view = <Voting name={this.state.name} roomcode={this.state.roomcode} />
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}
