import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import Card from './../components/Card';


class Main extends Component {
  render() {
    return (
      <div>
        <Header />

          <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
            <h1 class="display-4">mirror</h1>
            <p class="lead">Follow and match the moves of top performing crypto assset portfolios. The Portfolio creators are rewarded with crypto currency tokens based on performance.</p>
          </div>

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
    </div>
    );
  }
}

export default Main;
