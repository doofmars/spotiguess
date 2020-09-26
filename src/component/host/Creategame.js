import React from 'react';
import './Creategame.css';
import PropTypes from 'prop-types';
import { playlists } from "./../../sample_pls.js";
import Image from 'react-bootstrap/Image'

export default class Creategame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      connected: true
    };
  }

  render() {
    return (
     <div className="container">
       <Login visible={this.state.connected}/>
       <Create visible={!this.state.connected} />
     </div>
    );
  }
}

Creategame.propTypes = {
  room: PropTypes.string.isRequired
};

function Login(props) {
  if (props.visible) {
    return null;
  }
  return (
    <div id="login">
      <h1 className="cyan">Gamemaster
        <small className="text-muted">Login to start a game</small>
      </h1>
      <p className="text-danger" id="error">There was an error during the authentication</p>
      <button id="login-button" className="sbtn sbtn-green mb-1">Log in with Spotify</button>
    </div>
  );
}

function Create(props) {
  if (props.visible) {
    return null;
  }
  return (
    <div id="create">
      <div id="playlists">
        <h1 className="cyan mb-3">Select collaborative playlist</h1>
        <PlaylistTable />
      </div>
      <div className="container">
        <div className="row">
          <div className="col players">
          </div>
          <div className="col col-lg-4">
            <button className="sbtn sbtn-green mb-1 float-right" id="shuffle">
              Shuffle
            </button>
            <span className="text-danger align-middle" id="error-shuffle">Failed to start shuffle</span>
          </div>
        </div>
      </div>
    </div>
  );
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
          { playlists.items.map((item, index) => {
            return (
              <PlaylistRow item={item} index={index} key={index} selectEvent={this.selectEvent} />
            );
          })}
        </tbody>
      </table>
    );
  }
}

class PlaylistRow extends React.Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      active: false,
    };
  }

  static propTypes = {
    selectEvent: PropTypes.func,
  };

  toggleClass() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  render() {
    return (
      <tr id={this.props.index} className={this.state.active ? 'selected': null}>
        <th scope="row">{this.props.index + 1}</th>
        <td><Image width="150" height="150" thumbnail  src={this.props.item.images[0].url}/></td>
        <td>{this.props.item.name}</td>
        <td>{this.props.item.owner.display_name}</td>
        <td>{this.props.item.tracks.total}</td>
        <td>
          <button className="sbtn sbtn-green" id={this.props.item.id} value={this.props.index} type="button" onClick={this.toggleClass}>
            Select
          </button>
        </td>
      </tr>
    );
  }
}

