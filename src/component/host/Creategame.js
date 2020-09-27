import React from 'react';
import './Creategame.css';
import PropTypes from 'prop-types';
import { playlists } from "./../../sample_pls.js";
import Image from 'react-bootstrap/Image'
import { HostContext } from './HostContextProvider.js'

export default class Creategame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      warning: false
    };
  }

  static contextType = HostContext;

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
            <h1 className="cyan mb-3">Select collaborative playlist</h1>
            <PlaylistTable />
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

