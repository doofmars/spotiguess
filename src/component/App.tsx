import * as React from 'react';
import './App.css';
import Lobby from './Lobby'
import Host from './host/Host'
import LoginError from './host/LoginError'
import Voting from './player/Voting'
import getHashParams from './logic/hash'

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
        hash_parameters: _hash
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
      view = <Host viewChangeEvent={this.viewChangeEvent} hash_parameters={this.state.hash_parameters} />
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
