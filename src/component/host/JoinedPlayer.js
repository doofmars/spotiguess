import React from 'react';

export default class JoinedPlayer extends React.Component {
  render() {
    return(
      <button className="sbtn sbtn-yellow float-right joined-player">{this.props.name}</button>
    );
  }
}
