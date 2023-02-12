import * as React from 'react';
import './CreateGame.css';
import axios from 'axios';
import Image from 'react-bootstrap/Image'
import getPlaylist from '../api/getPlaylist'
import JoinedPlayer from './JoinedPlayer'
import socket from "../socket/socketConfig";
import Switch from "react-switch";
import {PlaylistItem, PlaylistOverview, PlaylistOverviewItem} from "./Playlist";
import {PlayerData} from "./PlayerData";
import {SpotiguessOptions} from "./Options";

type IProps = {
  // Callback for error handling
  viewChangeEvent: (newView: string, message: string) => void
  // Callback for game has started
  startGame: (playlist: Array<PlaylistItem>, options: SpotiguessOptions) => void
  // Used for spotify api access
  access_token: string
  // List of players
  players: Map<string, PlayerData>
  // Callback to add an incoming player
  addPlayer: (player: string) => void
  // The default options
  defaultOptions: SpotiguessOptions
}

type IState = {
  // Set to true if warning component should be visible
  warning: boolean
  // View config component
  showConfig: boolean
  // Overview response from spotify containing shared playlists
  playlistOverview: PlaylistOverview
  // ID of the selected playlist
  selectedPlaylistId: string
  // The options
  options: SpotiguessOptions
}

// TODO: Switch to React Functional Components
export default class CreateGame extends React.Component<IProps, IState> {

  state: IState

  constructor(props: IProps, context) {
    super(props, context)
    this.state = {
      warning: false,
      showConfig: false,
      selectedPlaylistId: "",
      playlistOverview: {items: []},
      options: this.props.defaultOptions
    }
  }

  componentDidMount() {
    if (this.props.access_token !== undefined) {
      axios.get('https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            'Authorization': 'Bearer ' + this.props.access_token
          }
        }).then(response => {
        this.setState({
          playlistOverview: response.data
        });
      }).catch(error => {
        console.log(error);
        this.props.viewChangeEvent('error', 'Could not get playlists from Spotify');
      });
    } else {
      this.props.viewChangeEvent('error', 'Missing access token please login again');
    }
    socket.on('request-join', this.joinRequest);
  }

  shuffleClick = () => {
    if (this.state.selectedPlaylistId === "") {
      this.setState({warning: true});
      this.setShowConfig(false)
    } else {
      getPlaylist(
        this.state.selectedPlaylistId,
        this.props.access_token,
        (playlist) => this.props.startGame(playlist, this.state.options),
        () => {
          this.props.viewChangeEvent('error', 'Could not select playlist')
        });
    }
  }

  setShowConfig = (value) => {
    this.setState({showConfig: value});
  }

  joinRequest = (msg) => {
    socket.emit('join-accepted', msg);
    if (this.props.players.get(msg.name)) {
      console.log('A Player Rejoined: ' + msg.name);
    } else {
      console.log('A Player Joined: ' + msg.name);
      this.props.addPlayer(msg.name)
    }
  }

  componentWillUnmount() {
    socket.off('request-join');
  }

  render() {
    const joinedPlayer = [];
    let title;
    let view;

    if (this.state.showConfig) {
      title = "Configure game"
      view = <Config
        options={this.state.options}
        setRounds={(rounds: number) => this.setState({
          options: {
            rounds: rounds,
            showScore: this.state.options.showScore,
            showVotes: this.state.options.showVotes,
            volume: this.state.options.volume,
            missingPreviewSkip: this.state.options.missingPreviewSkip,
          }
        })}
        setShowScore={(showScore: boolean) => this.setState({
          options: {
            rounds: this.state.options.rounds,
            showScore: showScore,
            showVotes: this.state.options.showVotes,
            volume: this.state.options.volume,
            missingPreviewSkip: this.state.options.missingPreviewSkip,
          }
        })}
        setShowVotes={(showVotes: boolean) => this.setState({
          options: {
            rounds: this.state.options.rounds,
            showScore: this.state.options.showScore,
            showVotes: showVotes,
            volume: this.state.options.volume,
            missingPreviewSkip: this.state.options.missingPreviewSkip,
          }
        })}/>
    } else {
      title = "Select a collaborative playlist";
      view = <PlaylistTable
        playlistOverview={this.state.playlistOverview}
        selectPlaylist={(playlistId: string) => this.setState({selectedPlaylistId: playlistId})}
        selectedPlaylistId={this.state.selectedPlaylistId}/>
    }

    if (this.props.players.size === 0) {
      joinedPlayer.push(<JoinedPlayer name={"No one has joined yet"} key={0} player={false}/>)
    } else {
      this.props.players.forEach((value, key) => {
        joinedPlayer.push(<JoinedPlayer name={key} key={key} player={false}/>)
      });
    }

    return (
      <div className="container">
        <div id="create">
          <div id="playlists">
            <h1 className="cyan mb-3">{title}</h1>
            {view}
          </div>
          <div className="container">
            <div className="row">
              <div className="col players">
                {joinedPlayer}
              </div>
              <div className="col col-lg-4">
                <button className="sbtn sbtn-green mb-1 float-right" id="shuffle" onClick={this.shuffleClick}>
                  Shuffle Play
                </button>
                <button className="sbtn sbtn-gray mb-1 float-right gear"
                        onClick={() => this.setShowConfig(!this.state.showConfig)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 24 24">
                    <path
                      d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
                  </svg>
                </button>
                <span className="text-danger float-right" style={this.state.warning ? null : {display: 'none'}}
                      id="error-shuffle">Failed to start shuffle, please select a playlist</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

type ConfigProps = {
  options: {
    // Number of rounds to play
    rounds: number
    // sound volume
    volume: number
    // instantly show if a player has voted
    showVotes: boolean
    // show score while playing
    showScore: boolean
    // skip songs without preview
    missingPreviewSkip: boolean
  }
  setRounds: (rounds: number) => void
  // setVolume: Function
  setShowVotes: (showVotes: boolean) => void
  setShowScore: (showScore: boolean) => void
  // setMissingPreviewSkip: Function
}

class Config extends React.Component<ConfigProps> {
  render() {
    return (
      <form className="config">
        <div className="form-group row">
          <label className="col-sm-6 col-form-label text-right">Number of rounds</label>
          <div className="col-sm-6">
            <input type="number" className="form-control"
                   value={this.props.options.rounds}
                   onChange={(e) => this.props.setRounds(Number(e.currentTarget.value))}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-6 col-form-label text-right">Show who has voted</label>
          <div className="col-sm-6">
            <Switch onChange={(checked) => this.props.setShowVotes(checked)} checked={this.props.options.showVotes}
                    uncheckedIcon={false} checkedIcon={false}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-6 col-form-label text-right">Show score while playing</label>
          <div className="col-sm-6">
            <Switch onChange={(checked) => this.props.setShowScore(checked)} checked={this.props.options.showScore}
                    uncheckedIcon={false} checkedIcon={false}/>
          </div>
        </div>
      </form>
    );
  }
}

type PlaylistProps = {
  playlistOverview: PlaylistOverview
  selectedPlaylistId: string
  selectPlaylist: (playlistId: string) => void
}

class PlaylistTable extends React.Component<PlaylistProps> {
  render() {
    return (
      <table className="table table-dark">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Image</th>
          <th scope="col">Name</th>
          <th scope="col">Owner</th>
          <th scope="col">Tracks</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody id="playlists">
        {this.props.playlistOverview.items.map((playlist, index) => {
          return (
            <PlaylistRow
              playlistOverview={playlist}
              selectedPlaylistId={this.props.selectedPlaylistId}
              selectPlaylist={this.props.selectPlaylist}
              index={index} key={index}/>
          );
        })}
        </tbody>
      </table>
    );
  }
}


type PlaylistRowProps = {
  index: number
  key: number
  selectedPlaylistId: string
  playlistOverview: PlaylistOverviewItem
  selectPlaylist: (playlistId: string) => void
}

class PlaylistRow extends React.Component<PlaylistRowProps> {
  render() {
    return (
      <tr id={this.props.index.toString()}
          className={this.props.selectedPlaylistId === this.props.playlistOverview.id ? 'selected' : null}>
        <th scope="row">{this.props.index + 1}</th>
        <td><Image width="150" height="150" thumbnail src={this.props.playlistOverview.images[0].url}/></td>
        <td>{this.props.playlistOverview.name}</td>
        <td>{this.props.playlistOverview.owner.display_name}</td>
        <td>{this.props.playlistOverview.tracks.total}</td>
        <td>
          <button className="sbtn sbtn-green" id={this.props.playlistOverview.id} value={this.props.index} type="button"
                  onClick={() => {
                    this.props.selectPlaylist(this.props.playlistOverview.id)
                  }}>
            Select
          </button>
        </td>
      </tr>
    )
  }
}
