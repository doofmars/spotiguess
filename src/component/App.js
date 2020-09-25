import React from 'react';
import './App.css';
import openSocket from 'socket.io-client';
import Lobby from'./Lobby.js'
import Creategame from'./Creategame.js'

const socket = openSocket('http://localhost:3000');

export default class App extends React.Component {

  render() {
    return (
      <Lobby></Lobby>
    );
  }
}

