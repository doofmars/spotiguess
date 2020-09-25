import React from 'react';
import './Lobby.css';
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'

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
            <button class="sbtn sbtn-white mb-1 btn-block" id="join-init" type="button" onClick={this.handleToggleClick}>
              Join Game
            </button>
            <p class="text-white">
              Join an active session
            </p>
            <LoginInfo hidden={this.state.loginInfoHidden} />
          </div>
        </div>
      </div>
    );
  }
}

function LoginInfo(props) {
  return (
    <SlideDown className={'my-dropdown-slidedown'} closed={props.hidden}>
      <div id="join-info">
        <input id="name" type="text" class="form-control mb-1" placeholder="Name" />
        <input id="room-code" type="text" class="form-control mb-1" maxlength="5" placeholder="Roomkey" />
        <button class="sbtn sbtn-green mb-1 float-right" id="join-accept" type="button">
          Join
        </button>
        <p id="bad-message" class="text-danger"></p>
      </div>
    </SlideDown>
  )
}
