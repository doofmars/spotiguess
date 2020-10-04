import React from 'react';
import PropTypes from 'prop-types';
import Song from './Song.js';
import { HostContext } from './HostContextProvider.js'
import JoinedPlayer from './JoinedPlayer.js'
import {getNextTrack, hasNextTrack} from './../logic/nextSong.js'
import getVotingOptions from './../logic/votingOptions.js'
import socket from "../socket/socketConfig";

const COUNTDOWN = 20;

export default class Game extends React.Component {
  static contextType = HostContext;
  static propTypes = {
    viewChangeEvent: PropTypes.func.isRequired,
    finishGame: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props);
    if (context.state.playlistItems.length === 0) {
      this.props.viewChangeEvent('error', 'The selected playlist has no tracks');
    }
    if (hasNextTrack(context.state.playlistItems, 0, context.state.missingPreviewSkip)) {
      this.props.viewChangeEvent('error', 'The selected playlist has no suitable tracks to your configuration');
    }
    this.context = context;
    // Set pre initialize state since itemId is needed in nextTrack()
    this.state = {itemsId: 0}
    // Get init state by calling nextTrack()
    let initState = this.nextTrack();
    // Add options to state
    initState.options = getVotingOptions(context.state.playlistItems)
    this.state = initState;
    // Propagate round start to clients
    socket.emit('options', {roomcode: context.state.roomcode, options: this.state.options})
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(this.nextTrack());
    }, 30_000);
    socket.on('request-join', this.joinRequest);
    socket.on('vote', this.vote)
  }

  nextTrack = () => {
    this.context.nextRound();
    if (this.context.state.round >= this.context.state.roundEnd) {
      this.props.finishGame();
    }
    let itemsId = getNextTrack(
      this.context.state.playlistItems,
      this.state.itemsId,
      this.context.state.missingPreviewSkip);
    let date = new Date();
    date.setSeconds(date.getSeconds() + COUNTDOWN);
    let now = date.getTime();
    socket.emit('next-song', {
      roomcode:this.context.state.roomcode,
      title:this.context.state.playlistItems[itemsId].track.name,
      artist:this.context.state.playlistItems[itemsId].track.artists[0].name,
      voteTime:now
    });
    return {
      itemsId: itemsId + 1,
      songData: this.context.state.playlistItems[itemsId],
      showResult: false,
      countdown: COUNTDOWN,
      audio: new Audio(this.context.state.playlistItems[itemsId].track.preview_url),
      voteTime:now
    };
  }


  joinRequest = (msg) => {
    socket.emit('join-accepted', msg);
    if (this.context.state.players.get(msg.name)) {
      console.log('A Player Rejoined: ' + msg.name);
    } else {
      console.log('A Player Joined: ' + msg.name);
      this.context.addPlayer(msg.name)
    }
    socket.emit('next-song', {
      roomcode:this.context.state.roomcode,
      title:this.state.songData.track.name,
      artist:this.state.songData.track.artists[0].name,
      voteTime:this.state.voteTime
    });
    socket.emit('options', {
      roomcode: this.context.state.roomcode,
      options: this.state.options
    });
  }

  vote = (msg) => {
    console.log('Got player ' + msg.name + " voted for:" + msg.option);
    this.context.setVote(msg.name, msg.option)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    socket.off('request-join');
    socket.off('vote');
  }


  render() {
    const joinedPlayer = [];
    this.context.state.players.forEach((value, key) => {
      joinedPlayer.push(<JoinedPlayer name={key} key={key} score={value.score}/>)
    });

    return (
      <div className="game container">
        <Song songData={this.state.songData} />
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
