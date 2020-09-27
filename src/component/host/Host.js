import React from 'react';
import './Host.css';
import Creategame from './Creategame.js'
import generateRoomCode from './../logic/roomCode.js'
import {HostContextProvider} from './HostContextProvider.js'

export default class Host extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      room: generateRoomCode()
    };
  }

  render() {
    return (
      <HostContextProvider
          room={this.state.room}
          access_token={this.props.hash.access_token} >
        <div className="corner-ribbon top-right sticky magenta">
          Room Code<br />
          <b id="room-code">{this.state.room}</b>
        </div>
        <Creategame viewChangeEvent={this.props.viewChangeEvent}/>
      </HostContextProvider>
    );
  }
}
