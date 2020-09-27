import React from 'react';
import './Game.css';
import { HostContext } from './HostContextProvider.js'

export default class Game extends React.Component {
  static contextType = HostContext;

  componentDidMount() {
  }

  render() {
    return (
      <div className="Game">
      </div>
    );
  }
}

