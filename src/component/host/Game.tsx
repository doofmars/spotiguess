import * as React from 'react';
import Song from './Song';
import JoinedPlayer from './JoinedPlayer'
import {getNextTrack, hasNextTrack} from '../logic/nextSong'
import getVotingOptions from '../logic/votingOptions'
import socket from "../socket/socketConfig";
import {PlaylistItem} from "./Playlist";
import {PlayerData} from "./PlayerData";
import {SpotiguessOptions} from "./Options";

const COUNTDOWN = 20;
const PREVIEW_DURATION = 30

type IProps = {
  // Code to join the room
  roomcode: string
  // key name, values: {score:num, currentVote:str}
  players: Map<string, PlayerData>
  // The currently active playlist with track info
  playlistItems: Array<PlaylistItem>
  options: SpotiguessOptions
  // Callback for error handling
  viewChangeEvent: (newView: string, message: string) => void
  // Callback to mark game is finished
  finishGame: (results: Map<string, PlayerData>, canContinue: boolean) => void
}

type IState = {
  //key name, values: {score:num, currentVote:str}
  players: Map<string, PlayerData>
  //Current round
  round: number
  countdown: number
  showResult: boolean;
  audio: any
  votingOptions: Array<string>
  voteTime: number
}

export default class Game extends React.Component<IProps, IState> {
  state: IState
  private timer: NodeJS.Timeout;

  constructor(props) {
    super(props);
    if (this.props.playlistItems.length === 0) {
      this.props.viewChangeEvent('error', 'The selected playlist has no tracks');
    }
    if (hasNextTrack(this.props.playlistItems, 0, this.props.options.missingPreviewSkip)) {
      this.props.viewChangeEvent('error', 'The selected playlist has no suitable tracks to your configuration');
    }
    // Set pre initialize state since itemId is needed in nextTrack()
    let itemsId = getNextTrack(
      this.props.playlistItems, 0, this.props.options.missingPreviewSkip);

    let date = new Date();
    date.setSeconds(date.getSeconds() + COUNTDOWN);

    this.state = {
      round: 0,
      players: this.props.players,
      votingOptions: getVotingOptions(this.props.playlistItems),
      audio: new Audio(this.props.playlistItems[itemsId].track.preview_url),
      showResult: false,
      countdown: COUNTDOWN,
      voteTime:date.getTime()
    }
  }

  componentDidMount() {
    // Propagate round start to clients
    socket.emit('options', {roomcode: this.props.roomcode, options: this.state.votingOptions})

    this.timer = setInterval(() => {
      this.countVotes(this.props.playlistItems[this.state.round].added_by.id)
      let newState = this.nextTrack();
      if (newState !== undefined) {
        this.setState(newState);
      }
    }, PREVIEW_DURATION * 1000);
    socket.on('request-join', this.joinRequest);
    socket.on('vote', this.vote)
  }

  nextTrack = () => {
    console.log("nextRound");
    let round = this.state.round + 1
    if (this.state.round > this.props.options.rounds) {
      // Last round was played, finish game
      this.setState({round: round})
      this.props.finishGame(this.state.players, true);
      return;
    }
    let itemsId = getNextTrack(
      this.props.playlistItems,
      this.state.round,
      this.props.options.missingPreviewSkip);
    if (itemsId < 0) {
      // No more songs in playlist, finish game
      this.setState({round: round})
      this.props.finishGame(this.state.players,false);
      return;
    }
    let date = new Date();
    date.setSeconds(date.getSeconds() + COUNTDOWN);
    let now = date.getTime();
    socket.emit('next-song', {
      roomcode:this.props.roomcode,
      title:this.props.playlistItems[itemsId].track.name,
      artist:this.props.playlistItems[itemsId].track.artists[0].name,
      voteTime:now
    });
    return {
      round: round,
      showResult: false,
      countdown: COUNTDOWN,
      audio: new Audio(this.props.playlistItems[itemsId].track.preview_url),
      voteTime:now
    };
  }

  addPlayer = (player) => {
    let players = this.state.players
    players.set(player, {score: 0, currentVote:""})
    this.setState({
      players: players
    })
  }

  countVotes = (rightAnswer) => {
    this.state.players.forEach((playerData, playerName) => {
      if (rightAnswer === playerData.currentVote) {
        this.addScore(playerName);
      } else {
        this.setVote(playerName, "");
      }
    });
  }

  setVote = (player, vote) => {
    if (this.state.players.get(player)) {
      let score = this.state.players.get(player).score
      let players = this.state.players
      players.set(player, {score: score, currentVote:vote})
      this.setState({
        players: players
      })
    }
  }

  addScore = (player) => {
    if (this.state.players.get(player)) {
      let score = this.state.players.get(player).score
      let players = this.state.players
      players.set(player, {score: score + 1, currentVote:""})
      this.setState({
        players: players
      })
    }
  }

  joinRequest = (msg) => {
    socket.emit('join-accepted', msg);
    if (this.state.players.get(msg.name)) {
      console.log('A Player Rejoined: ' + msg.name);
    } else {
      console.log('A Player Joined: ' + msg.name);
      this.addPlayer(msg.name)
    }
    socket.emit('next-song', {
      roomcode:this.props.roomcode,
      title:this.props.playlistItems[this.state.round].track.name,
      artist:this.props.playlistItems[this.state.round].track.artists[0].name,
      voteTime:this.state.voteTime
    });
    socket.emit('options', {
      roomcode: this.props.roomcode,
      options: this.state.votingOptions
    });
  }

  vote = (msg) => {
    if (new Date().getTime() < this.state.voteTime) {
      console.log('Got player ' + msg.name + " voted for:" + msg.option);
      this.setVote(msg.name, msg.option)
    } else {
      console.log('Player voted to late: ' + msg.name + " voted for:" + msg.option)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    socket.off('request-join');
    socket.off('vote');
  }

  render() {
    const joinedPlayer = [];
    this.state.players.forEach((value, key) => {
      let hasVoted = (value.currentVote !== "" && value.currentVote !== undefined);
      let isCorrect = hasVoted && this.props.playlistItems[this.state.round].added_by.id === value.currentVote;
      joinedPlayer.push(<JoinedPlayer
        player={true} name={key} key={key} score={value.score}
        isCorrect={isCorrect} hasVoted={hasVoted} showResult={this.state.showResult}
        showVotes={this.props.options.showVotes} showScore={this.props.options.showVotes}
      />)
    });

    return (
      <div className="game container">
        <Song
          songData={this.props.playlistItems[this.state.round]}
          showResult={this.state.showResult}
          updateShowResults={(show: boolean) => this.setState({showResult: show})}
          songVolume={this.props.options.volume}/>
        <div className="container">
          <div className="row">
            <div className="col play players">
            </div>
            <div className="col-sm">
              {joinedPlayer}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
