import * as React from 'react';
import login from "./api/login";

type IProps = {
  viewChangeEvent: (newView: string, message: string) => void;
  message: string;
}

export default class LoginError extends React.Component<IProps> {

  retryClick() {
    login();
  }

  render() {
    return (
      <div id="login">
        <h1 className="cyan">Game host
          <small className="text-muted"> Login to start a game</small>
        </h1>
        <p className="text-danger" id="error">There was an error during game setup</p>
        <p className="text-danger" id="error">{this.props.message}</p>
        <button id="login-button" className="sbtn sbtn-green mb-1" onClick={this.retryClick}>Log in with Spotify</button>
        <p>
        <button id="back-button" className="sbtn sbtn-white mb-1" onClick={this.props.viewChangeEvent.bind(this, 'lobby')}>Back to lobby</button>
        </p>
      </div>
    );
  }
}
