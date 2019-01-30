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
            <p class="lead">Follow and match the moves of top performing crypto assset portfolios. 
                              The Portfolio creators are rewarded with crypto currency tokens based on performance and allowing others to follow their trades. 
                              Users can benefit by mirroring the trades of high performing market experts.</p>
          </div>

        <div class="container">
          <div class="card-deck mb-3 text-center">
          
            <Card title="Top Daily Performer" 
                  growth="339"
                  line1="u:RaSpUtAn"
                  line2="10 tokens"
                  line3="created: Jan-7-2019"
                  buttontext="Follow"/>

            <Card title="Top 30 Day Performer" 
                  growth="296"
                  line1="morpheus"
                  line2="8 tokens"
                  line3="created: Jan-12-2019"
                  buttontext="Follow"/>

            <Card title="Best Stability" 
                  growth="0.93"
                  line1="b.bernake"
                  line2="3 tokens"
                  line3="created: Jan-21-2019"
                  buttontext="Follow"/>

          </div>
        <Footer/>
      </div> 
    </div>
    );
  }
}

export default Main;
