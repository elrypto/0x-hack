import React, { Component } from 'react';
import logo from './logo.svg';
import './bootstrap.min.css';
import './App.css';



class App extends Component {
  render() {
    return (
      <div>
        {this.props.children}
    </div>
    );
  }
}

export default App;
