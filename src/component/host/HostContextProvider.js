import React from 'react';

const HostContext = React.createContext();

class HostContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomcode: props.roomcode,         //the room code to join
      access_token: props.access_token, //the spotify access token to make api requests
      itemsId: 0,                       //Position in shuffled playlist items
      round:0,                          //Current round
      rounds:30,                        //number of rounds
      roundEnd:30,                      //Current end round increased for continue playing
      missingPreviewSkip: true,         //skip songs without preview
      showVotes: false,                 //Instantly show if a player has voted
      showScore: false,                 //Show score while playing
      players: new Map(),               //key name, values: {score:num, currentVote:str}
      selectedPlaylistId: "",           //Selected playlist id
      volume: 0.2,                      //Sound volume
      playlistItems: []
    };
  }

  nextRound = () => {
    console.log("nextRound");
    this.setState({round: this.state.round + 1});
  }

  setVote = (player, vote) => {
    if (this.state.players.get(player)) {
      let score = this.state.players.get(player).score
      this.setState({
        players: new Map([...this.state.players, [player, {score: score, currentVote:vote}]])
      })
    }
  }

  addScore = (player) => {
    if (this.state.players.get(player)) {
      let score = this.state.players.get(player).score
      let vote = this.state.players.get(player).currentVote
      this.setState({
        players: new Map([...this.state.players, [player, {score: score + 1, currentVote:vote}]])
      })
    }
  }

  countVotes = (rightAnswer) => {
    this.state.players.forEach((playerData, playerName) => {
      if (rightAnswer === playerData.currentVote) {
        this.addScore(playerName);
      }
    });
  }

  setRounds = (e) => {
    let value = e.target.valueAsNumber;
    if (Number.isInteger(value)) {
      this.setState({rounds: value, roundEnd: value})
    }
  }

  setRoundsEnd = (e) => {
    let value = e.target.valueAsNumber;
    if (Number.isInteger(value)) {
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
        selectPlaylist: (value) => this.setState({selectedPlaylistId: value }),
        nextRound: this.nextRound,
        setPlaylist: (playlist) => this.setState({playlistItems: playlist}),
        addPlayer: (player) => this.setState({
          players: new Map([...this.state.players, [player, {score: 0, currentVote:""}]])
        }),
        setVote: this.setVote,
        countVotes: this.countVotes,
        addScore: this.addScore,
        setShowVotes: this.setShowVotes,
        setShowScore: this.setShowScore,
        setRounds: this.setRounds
      }}>
        {this.props.children}
      </HostContext.Provider>
    );
  }
}

//exporting context object
export { HostContext, HostContextProvider };
