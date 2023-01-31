import * as React from 'react';
import './Host.css';
import CreateGame from './CreateGame'
import Game from './Game'
import Score from './Score'
import generateRoomCode from '../logic/roomCode'
import socket from "../socket/socketConfig";
import {PlayerData} from "./PlayerData";
import {PlaylistItem} from "./Playlist";
import {SpotiguessOptions} from "./Options";

type IProps = {
  viewChangeEvent: Function;
  hash_parameters: {
    // Code to join the room
    roomcode: string
    //the spotify access token to make api requests
    access_token: string
  };
}

type IState = {
  gamePhase: string
  // Determines if there is a next possible song so the game can continue
  canContinue: boolean
  // Access key to join the room
  roomcode: string
  options: SpotiguessOptions
  // The currently active playlist with track info
  playlistItems: Array<PlaylistItem>
  //key name, values: {score:num, currentVote:str}
  players: Map<string, PlayerData>
}
export default class Host extends React.Component<IProps, IState> {
  state: IState

  constructor(props) {
    super(props);
    this.state = {
      gamePhase: "started",
      canContinue: true,
      roomcode: generateRoomCode(),
      playlistItems: [],
      players: new Map(),
      // Set default options
      options: {
        rounds: 30,
        volume: 0.2,
        showVotes: false,
        showScore: false,
        missingPreviewSkip: true
      }
    }
  }

  addPlayer = (player) => {
    let players = this.state.players
    players.set(player, {score: 0, currentVote:""})
    this.setState({
      players: players
    })
  }

  startGame = (playlist: Array<PlaylistItem>, options: SpotiguessOptions) => {
    this.setState({
      gamePhase: "running",
      playlistItems: playlist,
      options: options
    });
  }

  finishGame = (results, canContinue) => {
    this.setState({
      gamePhase: "finished",
      canContinue: canContinue,
      players: results
    });
  }

  continue = () => {
    let options = this.state.options
    options.rounds = options.rounds + 30
    this.setState({
      gamePhase: "running",
      options: options
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
      gameView = <Game
        roomcode={this.state.roomcode}
        viewChangeEvent={this.props.viewChangeEvent}
        finishGame={this.finishGame}
        players={this.state.players}
        options={this.state.options}
        playlistItems={this.state.playlistItems}/>
    } else if (gamePhase === "finished") {
      gameView = <Score
        viewChangeEvent={this.props.viewChangeEvent}
        results={this.state.players}
        continue={this.continue}
        canContinue={this.state.canContinue}/>
    } else {
      gameView = <CreateGame
        viewChangeEvent={this.props.viewChangeEvent}
        startGame={this.startGame}
        access_token={this.props.hash_parameters.access_token}
        players={this.state.players}
        defaultOptions={this.state.options}
        addPlayer={this.addPlayer}/>
    }

    return (
      <div>
        <div className="corner-ribbon top-right sticky magenta">
          Room Code<br />
          <b id="room-code">{this.state.roomcode}</b>
        </div>
          {gameView}
      </div>
    )
  }
}
