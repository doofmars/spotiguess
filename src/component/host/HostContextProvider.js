import React from 'react';

const HostContext = React.createContext();  //exporting context object

class HostContextProvider extends React.Component {
state = {selected: ""}

render() {
  return (
    <HostContext.Provider value={
    { state: this.state,
      setSelected: (value) => this.setState({selected: value })
    }}>
      {this.props.children}
    </HostContext.Provider>)
  }
}

export { HostContext, HostContextProvider };
