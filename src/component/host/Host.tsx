import * as React from 'react';
import './Host.css';
import CreateGame from './create/CreateGame'
import Game from './play/Game'
import Score from './finish/Score'
import generateRoomCode from '../logic/roomCode'
import socket from "../socket/socketConfig";
import {PlayerData} from "./models/PlayerData";
import {PlaylistItem} from "./models/Playlist";
import {SpotiguessOptions} from "./models/Options";
import getVotingOptions from "../api/votingOptions";

const DEFAULT_NUMBER_OF_ROUNDS: number = 30;

type IProps = {
  viewChangeEvent: (newView: string, message: string) => void
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
  // Round to start the game from
  startingRound: number
  // PlaylistItemId to start from, 0 for new games and increased if the game is continued
  startingPlaylistItemId: number
  votingOptions: Map<string, string>
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
      votingOptions: new Map(),
      players: new Map(),
      startingRound: 0,
      startingPlaylistItemId: 0,
      // Set default options
      options: {
        rounds: DEFAULT_NUMBER_OF_ROUNDS,
        volume: 0.2,
        showVotes: false,
        showScore: false,
        missingPreviewSkip: true
      }
    }
  }

  addPlayer = (player: string) => {
    let players = this.state.players
    players.set(player, {score: 0, currentVote:""})
    this.setState({
      players: players
    })
  }

  startGame = (playlist: Array<PlaylistItem>, options: SpotiguessOptions) => {
    getVotingOptions(
      playlist,
      this.props.hash_parameters.access_token,
      (votingOptions) => {
        this.setState({
          gamePhase: "running",
          votingOptions: votingOptions,
          playlistItems: playlist,
          options: options
        });
      },
      () => {
        this.props.viewChangeEvent('error', 'Failed to get player names')
      }
    )
  }

  finishGame = (results: Map<string, PlayerData>, canContinue: boolean, currentRound: number, playlistItemId: number) => {
    this.setState({
      gamePhase: "finished",
      canContinue: canContinue,
      players: results,
      startingRound: currentRound,
      startingPlaylistItemId: playlistItemId
    });
  }

  continue = () => {
    let options = this.state.options
    options.rounds = options.rounds + DEFAULT_NUMBER_OF_ROUNDS
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
        votingOptions={this.state.votingOptions}
        playlistItems={this.state.playlistItems}
        startingPlaylistItemId={this.state.startingPlaylistItemId}
        startingRound={this.state.startingRound}/>
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
