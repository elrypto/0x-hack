import React, { Component } from 'react';
import logo from './logo.svg';
import './bootstrap.min.css';
import './App.css';
import Footer from './Footer';
import Card from './Card';


class App extends Component {
  render() {
    return (
      
      <div class="container">
        <div class="card-deck mb-3 text-center">
        
          <Card title="Highest Growth" 
                growth="339"
                line1="username1"
                line2="10 tokens"
                line3="created: Jan-7-2019"
                buttontext="Purchase"/>

          <Card title="#2 Growth" 
                growth="296"
                line1="username2"
                line2="8 tokens"
                line3="created: Jan-12-2019"
                buttontext="Purchase"/>

          <Card title="Most Stability" 
                growth="0.93"
                line1="username0"
                line2="3 tokens"
                line3="created: Jan-21-2019"
                buttontext="Purchase"/>

        </div>
      <Footer/>
    </div> 
    );
  }
}

export default App;
