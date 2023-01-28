import * as React from 'react';
import './Host.css';
import CreateGame from './CreateGame'
import Game from './Game'
import Score from './Score'
import generateRoomCode from '../logic/roomCode'
import {HostContextProvider, HostContext} from './HostContextProvider'
import socket from "../socket/socketConfig";
import {PlayerData} from "./PlayerData";

type IProps = {
  viewChangeEvent: Function;
  hash_parameters: {
    roomcode: string
    access_token: string
  };
}

type IState = {
  gamePhase: string;
  results: Map<string, PlayerData>;
  canContinue: boolean;
  roomcode: string;
}
export default class Host extends React.Component<IProps, IState> {
  context!: React.ContextType<typeof HostContext>
  state: IState

  constructor(props) {
    super(props);
    this.state = {
      gamePhase: "started",
      results: new Map(),
      canContinue: true,
      roomcode: generateRoomCode()
    }
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
          access_token={this.props.hash_parameters.access_token} >
        <div className="corner-ribbon top-right sticky magenta">
          Room Code<br />
          <b id="room-code">{this.state.roomcode}</b>
        </div>
        {gameView}
      </HostContextProvider>
    );
  }
}
