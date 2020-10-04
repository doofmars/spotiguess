import React from 'react';

export default class JoinedPlayer extends React.Component {
  render() {
    let text = this.props.name
    if (this.props.score !== undefined) {
      text = text + ": " + this.props.score
    }
    return(
      <button className="sbtn sbtn-yellow float-right joined-player">{text}</button>
    );
  }
}
