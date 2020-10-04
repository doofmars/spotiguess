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
      selectedOption: '',
      voteTime: new Date().getTime()
    };
  }

  componentDidMount() {
    socket.on('options', this.onOptionsReceived);
    socket.on('next-song', this.onRoundStarted)
  }

  onRoundStarted = (roundInfo) => {
    this.setState({
      selectedOption: '',
      voteTime: roundInfo.votetime,
      info: roundInfo.title + ' - ' + roundInfo.artist})
  }

  onOptionsReceived = (options) => {
    this.setState({options: options})
  }

  onOptionSelect = (e) => {
    if (new Date().getTime() < this.state.voteTime) {
      socket.emit('vote', {
        name:this.state.name,
        roomcode:this.state.roomcode,
        option:e.target.value
      });
      this.setState({selectedOption: e.target.value})
    }
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

