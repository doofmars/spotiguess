import React from 'react';
import './CreateGame.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image'
import getPlaylist from '../api/getPlaylist.js'
import JoinedPlayer from './JoinedPlayer.js'
import { HostContext } from './HostContextProvider.js'

export default class Creategame extends React.Component {
  static contextType = HostContext;

  constructor(props) {
    super(props);
    this.state = {
      warning: false,
      playlists: {items:[]}
    };
  }

  componentDidMount() {
    if (this.context.state.access_token !== undefined) {
      axios.get('https://api.spotify.com/v1/me/playlists',
        { headers: { 'Authorization': 'Bearer ' + this.context.state.access_token
      }}).then(response => {
        this.setState({
          playlists: response.data
        });
      }).catch(error => {
        console.log(error);
        this.props.viewChangeEvent('error', 'Could not get playlists from Spotify');
      });
    } else {
      this.props.viewChangeEvent('error', 'Missing access token please login again');
    }
  }

  shuffleClick = () => {
    if (this.context.state.selectedPlaylistId === "") {
      this.setState({warning: true});
    } else {
      getPlaylist(
        this.context.state.selectedPlaylistId,
        this.context.state.access_token,
        (playlist) => {
          this.context.setPlaylist(playlist)
          this.props.startGame();
        },
        () => {
          this.props.viewChangeEvent('error', 'Could not select playlist');
        });
    }
  }

  render() {
    const joinedPlayer = [];

    if (this.context.state.players.size === 0) {
        joinedPlayer.push(<JoinedPlayer name={"No one has joined yet"}/>)
    } else {
      this.context.state.players.forEach((value, key) => {
        joinedPlayer.push(<JoinedPlayer name={key}/>)
      });
    }

    return (
      <div className="container">
        <div id="create">
          <div id="playlists">
            <h1 className="cyan mb-3">Select a collaborative playlist</h1>
            <PlaylistTable playlists={this.state.playlists} />
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
                <span className="text-danger align-middle" style={this.state.warning ? null : {display: 'none'} } id="error-shuffle">Failed to start shuffle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Creategame.propTypes = {
  viewChangeEvent: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired
};

class PlaylistTable extends React.Component {
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
          { this.props.playlists.items.map((playlist, index) => {
            return (
              <PlaylistRow playlist={playlist} index={index} key={index} selectEvent={this.selectEvent} />
            );
          })}
        </tbody>
      </table>
    );
  }
}

class PlaylistRow extends React.Component {
  render() {
    return (
      <HostContext.Consumer>
        {(context) => (
        <tr id={this.props.index} className={context.state.selectedPlaylistId === this.props.playlist.id ? 'selected': null}>
          <th scope="row">{this.props.index + 1}</th>
          <td><Image width="150" height="150" thumbnail  src={this.props.playlist.images[0].url}/></td>
          <td>{this.props.playlist.name}</td>
          <td>{this.props.playlist.owner.display_name}</td>
          <td>{this.props.playlist.tracks.total}</td>
          <td>
            <button className="sbtn sbtn-green" id={this.props.playlist.id} value={this.props.index} type="button" onClick={()=>{context.selectPlaylist(this.props.playlist.id)}}>
              Select
            </button>
          </td>
        </tr>
        )}
      </HostContext.Consumer>
    );
  }
}
