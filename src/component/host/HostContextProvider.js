import React from 'react';

const HostContext = React.createContext();  //exporting context object

class HostContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      access_token: props.access_token,
      selected: ""
    };
  }

  render() {
    return (
      <HostContext.Provider value={
      { state: this.state,
        setSelected: (value) => this.setState({selected: value })
      }}>
        {this.props.children}
      </HostContext.Provider>
    );
  }
}

export { HostContext, HostContextProvider };
