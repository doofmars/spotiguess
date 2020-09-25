import React from 'react';
import './Host.css';
import Creategame from './Creategame.js'

export default class Host extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div class="corner-ribbon top-right sticky magenta">
          Room Code<br />
          <b id="room-code"></b>
        </div>
        <Creategame></Creategame>
      </React.Fragment>
    );
  }
}

