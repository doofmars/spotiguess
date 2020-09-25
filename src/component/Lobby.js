import React from 'react';
import './Lobby.css';
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import PropTypes from 'prop-types';

export default class Lobby extends React.Component {

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

  render() {
    return (
      <div className="content-start">
        <div className="Lobby">
          <h1 className="cyan mb-3 block">Spotiguess</h1>
          <div id="gamestart">
            <button className="sbtn sbtn-green mb-1 btn-block" id="login-button" type="button" onClick={this.props.viewChangeEvent.bind(this, 'host')}>
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
            <LoginInfo hidden={this.state.loginInfoHidden} />
          </div>
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  viewChangeEvent: PropTypes.func.isRequired
};

function LoginInfo(props) {
  return (
    <SlideDown className={'my-dropdown-slidedown'} closed={props.hidden}>
      <div id="join-info">
        <input id="name" type="text" className="form-control mb-1" placeholder="Name" />
        <input id="room-code" type="text" className="form-control mb-1" maxLength="5" placeholder="Roomkey" />
        <button className="sbtn sbtn-green mb-1 float-right" id="join-accept" type="button">
          Join
        </button>
        <p id="bad-message" className="text-danger"></p>
      </div>
    </SlideDown>
  )
}
