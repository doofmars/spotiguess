import React from 'react';
import './Host.css';
import Creategame from './Creategame.js'
import Game from './Game.js'
import Score from './Score.js'
import generateRoomCode from './../logic/roomCode.js'
import {HostContextProvider, HostContext} from './HostContextProvider.js'

export default class Host extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gamePhase: "started",
      roomcode: generateRoomCode()
    };
  }

  startGame = () => {
    this.setState({gamePhase: "running"});
  }

  finishGame = () => {
    this.setState({gamePhase: "finished"});
  }

  render() {
    let gameView;

    const gamePhase = this.state.gamePhase;

    if (gamePhase === "running") {
      gameView = <Game viewChangeEvent={this.props.viewChangeEvent} finishGame={this.finishGame}/>
    } else if (gamePhase === "finished") {
      gameView = <Score viewChangeEvent={this.props.viewChangeEvent} />
    } else {
      gameView = <Creategame viewChangeEvent={this.props.viewChangeEvent} startGame={this.startGame} />
    }

    return (
      <HostContextProvider
          roomcode={this.state.room}
          access_token={this.props.hash.access_token} >
        <div className="corner-ribbon top-right sticky magenta">
          Room Code<br />
          <b id="room-code">{this.state.roomcode}</b>
        </div>
        {gameView}
      </HostContextProvider>
    );
  }
}
