import React from 'react';
import './CreateGame.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image'
import getPlaylist from '../api/getPlaylist.js'
import JoinedPlayer from './JoinedPlayer.js'
import { HostContext } from './HostContextProvider.js'
import socket from "../socket/socketConfig";

export default class CreateGame extends React.Component {
  static contextType = HostContext;
  static propTypes = {
    viewChangeEvent: PropTypes.func.isRequired,
    startGame: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      warning: false,
      showConfig: false,
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
    socket.on('request-join', this.joinRequest);
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

  configToggle = () => {
    this.setState({showConfig: !this.state.showConfig});
  }

  joinRequest = (msg) => {
    socket.emit('join-accepted', msg);
    if (this.context.state.players.get(msg.name)) {
      console.log('A Player Rejoined: ' + msg.name);
    } else {
      console.log('A Player Joined: ' + msg.name);
      this.context.addPlayer(msg.name)
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
      view = <HostContext.Consumer>{(context) => (<Config context={context} />)}</HostContext.Consumer>
    } else {
      title = "Select a collaborative playlist";
      view = <PlaylistTable playlists={this.state.playlists} />
    }

    if (this.context.state.players.size === 0) {
        joinedPlayer.push(<JoinedPlayer name={"No one has joined yet"} key={0}/>)
    } else {
      this.context.state.players.forEach((value, key) => {
        joinedPlayer.push(<JoinedPlayer name={key} key={key}/>)
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
                <button className="sbtn sbtn-gray mb-1 float-right gear" onClick={this.configToggle}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
                </button>
                <span className="text-danger float-right" style={this.state.warning ? null : {display: 'none'} } id="error-shuffle">Failed to start shuffle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
