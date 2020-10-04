import React from 'react';
import './Voting.css';
import PropTypes from 'prop-types';
import socket from "../socket/socketConfig";

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
      info: "Wait until the host has started the game or the next round is started.",
      options: [],
      selectedOption: ''
    };
  }

  componentDidMount() {
    socket.on('options', this.onOptionsReceived);
  }

  onOptionsReceived = (options) => {
    this.setState({options: options})
  }

  onOptionSelect = (e) => {
    this.setState({selectedOption: e.target.value})
  }

  render() {
    return (
      <div className="voting">
        <h1 className="cyan mb-3 block">Spotiguess</h1>
        <p className="text-white" id="waiting">{this.state.info}</p>
        { this.state.options.map((option) => {
          let btnClass = "sbtn mb-1 btn-block option"
          return(
            <button className={this.state.selectedOption === option ? btnClass + " sbtn-white" : btnClass + " sbtn-green"} key={option} value={option}
              onClick={(value) => this.onOptionSelect(value)}>
              {option}
            </button>
          );
        })}
      </div>
    );
  }
}

