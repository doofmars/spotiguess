import React from 'react';
import './Score.css';
import PropTypes from 'prop-types';
import { HostContext } from './HostContextProvider.js'

export default class Score extends React.Component {
  static contextType = HostContext;

  static propTypes = {
    viewChangeEvent: PropTypes.func.isRequired,
    results: PropTypes.object.isRequired
  }

  onContinueClick = () => {
    this.context.setRoundsEnd(this.context.state.roundEnd + this.context.state.rounds + 1)
    this.props.continue()
  }

  render() {
    let results = [];
    let max = 0;
    this.props.results.forEach((playerData, playerName) => {
      if (playerData.score > max) {
        results.unshift({name:playerName, score:playerData.score});
        max = playerData.score;
      } else {
        results.push({name:playerName, score:playerData.score});
      }
    });

    let continueBtn
    if (this.props.canContinue) {
      continueBtn = <button className="sbtn sbtn-white mb-1 float-right" onClick={this.onContinueClick}>Continue Playing</button>
    }

    return (
      <div className="score content">
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody id="results">
            {results.map((result, index) => {
              return(
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{result.name}</td>
                  <td>{result.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button className="sbtn sbtn-green mb-1 float-right" onClick={this.props.viewChangeEvent.bind(this, 'lobby')}>Back to Lobby</button>
        {continueBtn}
      </div>
    );
  }
}

