import * as React from 'react';
import {PlaylistItem} from "./Playlist";
import {PlayerData} from "./PlayerData";

type IProps = {
  roomcode: string;
  access_token: string;
  children: any
}

type IState = {
  //the spotify access token to make api requests
  roomcode: string;
  //Position in shuffled playlist items
  access_token: boolean;
  //Current round
  itemsId: number;
  //Current round
  round: number;
  //number of rounds
  rounds: number;
  //Current end round increased for continue playing
  roundEnd: number;
  //skip songs without preview
  missingPreviewSkip: boolean;
  //Instantly show if a player has voted
  showVotes: boolean;
  //Show score while playing
  showScore: boolean;
  //key name, values: {score:num, currentVote:str}
  players: Map<string, PlayerData>
  //Selected playlist id
  selectedPlaylistId: string;
  //Sound volume
  volume: number;
  playlistItems: Array<PlaylistItem>;
}

type IContextProps = {
  state: IState;
  selectPlaylist: Function;
  nextRound: Function;
  setPlaylist: Function;
  addPlayer: Function;
  setItemsId: Function;
  setVote: Function;
  countVotes: Function;
  addScore: Function;
  setShowVotes: Function;
  setShowScore: Function;
  setRoundsEnd: Function;
  setRounds: Function;
}

const HostContext = React.createContext({} as IContextProps);

class HostContextProvider extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      roomcode: props.roomcode,
      access_token: props.access_token,
      itemsId: 0,
      round:0,
      rounds:30,
      roundEnd:30,
      missingPreviewSkip: true,
      showVotes: false,
      showScore: false,
      players: new Map(),
      selectedPlaylistId: "",
      volume: 0.2,
      playlistItems: []
    }
  }

  nextRound = () => {
    console.log("nextRound");
    this.setState({round: this.state.round + 1});
  }

  addPlayer = (player) => {
    let players = this.state.players
    players[player] = {score: 0, currentVote:""}
    this.setState({
      players: players
    })
  }

  setVote = (player, vote) => {
    if (this.state.players[player]) {
      let score = this.state.players[player].score
      let players = this.state.players
      players[player] = {score: score, currentVote:vote}
      this.setState({
        players: players
      })
    }
  }

  addScore = (player) => {
    if (this.state.players[player]) {
      let score = this.state.players[player].score
      let vote = this.state.players[player].currentVote
      let players = this.state.players
      players[player] = {score: score + 1, currentVote:vote}
      this.setState({
        players: players
      })
    }
  }

  countVotes = (rightAnswer) => {
    this.state.players.forEach((playerData, playerName) => {
      if (rightAnswer === playerData.currentVote) {
        this.addScore(playerName);
      }
      this.setVote(playerName, "");
    });
  }

  setRounds = (e) => {
    let value = e.target.valueAsNumber;
    if (Number.isInteger(value) && value > 0) {
      this.setState({rounds: value, roundEnd: value})
    }
  }

  setRoundsEnd = (value) => {
    if (Number.isInteger(value) && value > this.state.rounds) {
      this.setState({roundEnd: value})
    }
  }

  setShowVotes = () => {
    this.setState({showVotes: !this.state.showVotes})
  }

  setShowScore = () => {
    this.setState({showScore: !this.state.showScore})
  }

  render() {
    return (
      <HostContext.Provider value={
      { state: this.state,
        selectPlaylist: (value) => this.setState({selectedPlaylistId: value}),
        nextRound: this.nextRound,
        setPlaylist: (playlist) => this.setState({playlistItems: playlist}),
        addPlayer: this.addPlayer,
        setItemsId: (itemsId) => this.setState({itemsId: itemsId}),
        setVote: this.setVote,
        countVotes: this.countVotes,
        addScore: this.addScore,
        setShowVotes: this.setShowVotes,
        setShowScore: this.setShowScore,
        setRoundsEnd: this.setRoundsEnd,
        setRounds: this.setRounds
      }}>
        {this.props.children}
      </HostContext.Provider>
    );
  }
}

//exporting context object
export { HostContext, HostContextProvider };
