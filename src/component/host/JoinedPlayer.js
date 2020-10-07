import React from 'react';
import { HostContext } from './HostContextProvider.js'

export default class JoinedPlayer extends React.Component {
  static contextType = HostContext;
  render() {
    let text = this.props.name
    if (this.props.score !== undefined && this.context.state.showScore) {
      if (this.props.isCorrect && this.props.showResult) {
        text = text + ": " + (this.props.score + 1)
      } else {
        text = text + ": " + this.props.score
      }
    }
    let buttonClass = "sbtn float-right joined-player ";
    if (this.props.isCorrect && this.props.showResult) {
      buttonClass = buttonClass + "sbtn-green";
    } else if (!this.props.isCorrect && this.props.showResult) {
      buttonClass = buttonClass + "sbtn-red";
    } else if (this.props.hasVoted && this.context.state.showVotes) {
      buttonClass = buttonClass + "sbtn-white";
    } else {
      buttonClass = buttonClass + "sbtn-yellow";
    }
    return(
    <button className={buttonClass}>{text}</button>
    );
  }
}
