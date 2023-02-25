import * as React from 'react';
import './App.css';
import Lobby from './lobby/Lobby'
import Host from './host/Host'
import LoginError from './LoginError'
import Voting from './player/Voting'
import getHashParams from './logic/hash'
import joinGame from "./socket/joinGame";

type IProps = {
}

type IState = {
  name?: string;
  roomcode?: string;
  hash_parameters?: any
  view: string; message: string
}

export default class App extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      view: 'lobby',
      message: ''
    }
  }

  viewChangeEvent = (newView: string, message: string) => {
    if (message) {
      console.log(message);
      this.setState({view: newView, message: message});
    } else {
      this.setState({view: newView, message: ''});
    }
  }

  votingViewChange = (name, roomcode) => {
    if (this.state.view !== 'host') {
      localStorage.setItem('spotiguess-name', name)
      localStorage.setItem('spotiguess-roomcode', roomcode)
      this.setState({view: "vote", name: name, roomcode: roomcode})
    }
  }

  componentDidMount() {
    // Set token
    let _hash = getHashParams();
    let name = localStorage.getItem('spotiguess-name')
    let roomcode = localStorage.getItem('spotiguess-roomcode')
    if ('access_token' in _hash) {
      localStorage.clear()
      // Set token
      this.setState({
        hash_parameters: _hash,
        view: "host"
      });
    }
    if ('error' in _hash) {
      this.setState({
        view: "error"
      });
    } else if (name !== null && roomcode !== null) {
      this.setState({name: name, roomcode: roomcode})
      joinGame(name, roomcode, this.votingViewChange)
    }
  }

  render() {
    let view;

    const gameState = this.state.view;

    if (gameState === 'host') {
      view = <Host viewChangeEvent={this.viewChangeEvent} hash_parameters={this.state.hash_parameters} />
    } else if (gameState === 'lobby') {
      view = <Lobby votingViewChange={this.votingViewChange} />
    } else if (gameState === 'error') {
      view = <LoginError viewChangeEvent={this.viewChangeEvent} message={this.state.message} />
    } else if (gameState === 'vote') {
      view = <Voting name={this.state.name} roomcode={this.state.roomcode} />
    }

    return view;
  }
}
