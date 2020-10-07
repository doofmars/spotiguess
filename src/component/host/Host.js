import React from 'react';
import './Host.css';
import CreateGame from './CreateGame.js'
import Game from './Game.js'
import Score from './Score.js'
import generateRoomCode from './../logic/roomCode.js'
import {HostContextProvider, HostContext} from './HostContextProvider.js'
import socket from "../socket/socketConfig";

export default class Host extends React.Component {
  static contextType = HostContext;

  constructor(props) {
    super(props);
    this.state = {
      gamePhase: "started",
      results: {},
      canContinue: true,
      roomcode: generateRoomCode()
    };
  }

  startGame = () => {
    this.setState({gamePhase: "running"});
  }

  finishGame = (results, canContinue) => {
    this.setState({
      gamePhase: "finished",
      canContinue: canContinue,
      results: results
    });
  }

  continue = () => {
    this.setState({
      gamePhase: "running"
    });
  }

  componentDidMount() {
    socket.emit('room-code', this.state.roomcode);
    socket.on('reconnect', this.onReconnect);
  }

  onReconnect = () => {
    socket.emit('room-code-reconnect', this.state.roomcode);
  }

  render() {
    let gameView;

    const gamePhase = this.state.gamePhase;

    if (gamePhase === "running") {
      gameView = <Game viewChangeEvent={this.props.viewChangeEvent} finishGame={this.finishGame}/>
    } else if (gamePhase === "finished") {
      gameView = <Score viewChangeEvent={this.props.viewChangeEvent} results={this.state.results} continue={this.continue} canContinue={this.state.canContinue}  />
    } else {
      gameView = <CreateGame viewChangeEvent={this.props.viewChangeEvent} startGame={this.startGame} />
    }

    return (
      <HostContextProvider
          roomcode={this.state.roomcode}
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
