import * as React from 'react';

type IProps = {
  player: false
  // Name of the player
  name: string
} | {
  player: true
  // Name of the player
  name: string
  // Has the player already voted
  hasVoted: boolean;
  // Is the vote correct
  isCorrect: boolean
  // Current score
  score: number
  // Show the results of the voting (Success or failure)
  showResult: boolean
  // Show the current score during result display
  showScore: boolean
  // Show that the player has submitted a vote
  showVotes: boolean
}

export default class JoinedPlayer extends React.Component<IProps> {
  render() {
    let text = this.props.name
    let buttonClass = "sbtn float-right joined-player ";
    if (this.props.player) {
      if (this.props.score !== undefined && this.props.showScore) {
        if (this.props.isCorrect && this.props.showResult) {
          text = text + ": " + (this.props.score + 1)
        } else {
          text = text + ": " + this.props.score
        }
      }
      if (this.props.isCorrect && this.props.showResult) {
        buttonClass = buttonClass + "sbtn-green";
      } else if (!this.props.isCorrect && this.props.showResult) {
        buttonClass = buttonClass + "sbtn-red";
      } else if (this.props.hasVoted && this.props.showVotes) {
        buttonClass = buttonClass + "sbtn-white";
      } else {
        buttonClass = buttonClass + "sbtn-yellow";
      }
    }
    return(
    <button className={buttonClass}>{text}</button>
    );
  }
}
