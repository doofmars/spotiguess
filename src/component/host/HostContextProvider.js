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
      showVotes: true,                  //Instantly show if a player has voted
      players: new Map(),               //key name, values: {score:num, currentVote:str}
      selectedPlaylistId: "",           //Selected palaylist id
      volume: 0.2,                      //Sound voulme
      playlistItems: []
    };
  }

  nextRound = () => {
    console.log("nextRound");
    this.setState({round: this.state.round + 1});
  }

  render() {
    return (
      <HostContext.Provider value={
      { state: this.state,
        selectPlaylist: (value) => this.setState({selectedPlaylistId: value }),
        nextRound: this.nextRound,
        setPlaylist: (playlist) => this.setState({playlistItems: playlist})
      }}>
        {this.props.children}
      </HostContext.Provider>
    );
  }
}

//exporting context object
export { HostContext, HostContextProvider };
