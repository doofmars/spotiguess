import React from 'react';
import './Host.css';
import Creategame from './Creategame.js'
import {HostContextProvider} from './HostContextProvider.js'

export default class Host extends React.Component {

  constructor(props) {
    super(props);
    this.state = {room: generateRoomCode()};
  }

  render() {
    return (
      <HostContextProvider>
        <div className="corner-ribbon top-right sticky magenta">
          Room Code<br />
          <b id="room-code">{this.state.room}</b>
        </div>
        <Creategame room={this.state.room} />
      </HostContextProvider>
    );
  }
}

/**
 * Generates a room code string containing only uppercase letters
 * @return {string} The generated string
 */
function generateRoomCode() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
