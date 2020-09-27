import React from 'react';
import './Creategame.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image'
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
        this.props.viewChangeEvent('error')
      });
    } else {
      this.props.viewChangeEvent('error')
    }
  }

  shuffleClick = () => {
    if (this.context.state.selected === "") {
      this.setState({warning: true});
    } else {
      console.log("done")
    }
  }

  render() {
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
              </div>
              <div className="col col-lg-4">
                <button className="sbtn sbtn-green mb-1 float-right" id="shuffle" onClick={this.shuffleClick}>
                  Shuffle
                </button>
                <span className="text-danger align-middle" style={this.state.warning ? null : {display: 'none'} } id="error-shuffle">Failed to start shuffle</span>
              </div>
              <button onClick={this.props.viewChangeEvent.bind(this, 'error')}>test</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Creategame.propTypes = {
  viewChangeEvent: PropTypes.func.isRequired
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
          { this.props.playlists.items.map((item, index) => {
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
  render() {
    return (
      <HostContext.Consumer>
        {(context) => (
        <tr id={this.props.index} className={context.state.selected === this.props.index ? 'selected': null}>
          <th scope="row">{this.props.index + 1}</th>
          <td><Image width="150" height="150" thumbnail  src={this.props.item.images[0].url}/></td>
          <td>{this.props.item.name}</td>
          <td>{this.props.item.owner.display_name}</td>
          <td>{this.props.item.tracks.total}</td>
          <td>
            <button className="sbtn sbtn-green" id={this.props.item.id} value={this.props.index} type="button" onClick={()=>{context.setSelected(this.props.index)}}>
              Select
            </button>
          </td>
        </tr>
        )}
      </HostContext.Consumer>
    );
  }
}

