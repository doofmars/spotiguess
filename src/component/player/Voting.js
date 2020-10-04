import React from 'react';
import './Voting.css';
import PropTypes from 'prop-types';
import socket from "../api/socketConfig";

export default class Voting extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    roomcode: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      roomcode: this.props.roomcode,
      options: []
    };
  }

  render() {
    return (
      <div className="Voting">
        <p>{this.state.name} - {this.state.roomcode}</p>
      </div>
    );
  }
}

