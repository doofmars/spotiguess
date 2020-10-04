import React from 'react';
import './Lobby.css';
import PropTypes from 'prop-types';
import login from "./logic/login";
import LoginInfo from "./LoginInfo";

export default class Lobby extends React.Component {
  static propTypes = {
    votingViewChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {loginInfoHidden: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      loginInfoHidden: false
    }));
  }

  createGameClick() {
    login();
  }

  render() {
    return (
      <div className="content-start">
        <div className="Lobby">
          <h1 className="cyan mb-3 block">Spotiguess</h1>
          <div id="gamestart">
            <button className="sbtn sbtn-green mb-1 btn-block" id="login-button" type="button" onClick={this.createGameClick}>
              Create new game
            </button>
            <p className="text-white mb-4">
              Login using your spoitify account,
              to access your playlists
            </p>
            <button className="sbtn sbtn-white mb-1 btn-block" id="join-init" type="button" onClick={this.handleToggleClick}>
              Join Game
            </button>
            <p className="text-white">
              Join an active session
            </p>
            <LoginInfo hidden={this.state.loginInfoHidden} votingViewChange={this.props.votingViewChange} />
          </div>
        </div>
      </div>
    );
  }
}

