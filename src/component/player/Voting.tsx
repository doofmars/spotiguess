import * as React from 'react';
import './Voting.css';
import PropTypes from 'prop-types';
import socket from "../socket/socketConfig";

type IProps = {
  name: string;
  roomcode: string;
}

type IState = {
  name: string
  roomcode: string
  warning: boolean;
  info: string;
  votingOptions: Map<string, string>;
  selectedOption: string;
  voteTime: number;
}

export default class Voting extends React.Component<IProps, IState> {
  static propTypes = {
    name: PropTypes.string.isRequired,
    roomcode: PropTypes.string.isRequired
  }
  state: IState

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      roomcode: this.props.roomcode,
      info: "Wait until the host has started the game or the next round is started.",
      warning: false,
      votingOptions: new Map(),
      selectedOption: '',
      voteTime: new Date().getTime()
    }
  }

  componentDidMount() {
    socket.on('options', this.onOptionsReceived)
    socket.on('next-song', this.onRoundStarted)
  }

  onRoundStarted = (roundInfo) => {
    let info = roundInfo.title + ' - ' + roundInfo.artist;
    if (this.state.info !== info && this.state.voteTime !== roundInfo.voteTime) {
      // Check local storage for selected option
      let selectedOption = ''
      const localInfo = localStorage.getItem('spotiguess-info');
      if (info === localInfo) {
        selectedOption = localStorage.getItem('spotiguess-selectedOption');
      } else {
        localStorage.removeItem('spotiguess-info')
        localStorage.removeItem('spotiguess-selectedOption')
      }
      // Upate song info
      this.setState({
        selectedOption: selectedOption,
        voteTime: roundInfo.voteTime,
        info: info
      })
    }
  }

  onOptionsReceived = (options: Map<string, string>) => {
    this.setState({votingOptions: new Map(Object.entries(options))})
  }

  onOptionSelect = (e) => {
    if (new Date().getTime() < this.state.voteTime) {
      socket.emit('vote', {
        name: this.state.name,
        roomcode: this.state.roomcode,
        option: e.target.value
      });
      // Store selected option for vote into local storage
      localStorage.setItem('spotiguess-selectedOption', e.target.value)
      localStorage.setItem('spotiguess-info', this.state.info)
      this.setState({selectedOption: e.target.value})
    }
  }


  render() {
    return (
      <div className="voting">
        <h1 className="cyan mb-3 block">Spotiguess</h1>
        <p className="text-white" id="waiting">{this.state.info}</p>
        <>
          {
            Array.from(this.state.votingOptions,
              ([playerID, playerName]) => ({playerID, playerName})
            ).map((entry) => {
              let btnClass = "sbtn mb-1 btn-block option"
              return (
                <button
                  className={this.state.selectedOption === entry.playerID ? btnClass + " sbtn-white" : btnClass + " sbtn-green"}
                  key={entry.playerID}
                  value={entry.playerID}
                  onClick={(value) => this.onOptionSelect(value)}>
                  {entry.playerName}
                </button>
              );
            })
          }
        </>
      </div>
    );
  }
}

