import React from 'react';
import './App.css';
import openSocket from 'socket.io-client';
import Lobby from'./Lobby.js'
import Host from'./host/Host.js'

const socket = openSocket('http://localhost:3000');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.viewChangeEvent = this.viewChangeEvent.bind(this);
    this.state = {view: 'lobby'};
  }

  viewChangeEvent(newView) {
    this.setState({view: newView});
  }

  render() {
    let view;

    const gameState = this.state.view;

    if (gameState === 'host') {
      view = <Host viewChangeEvent={this.viewChangeEvent} />
    } else if (gameState === 'lobby') {
      view = <Lobby viewChangeEvent={this.viewChangeEvent} />
    }

    return (
      <div>
        <p className="text-white mb-4">
          {this.state.view}
        </p>
        {view}
      </div>
    );
  }
}
