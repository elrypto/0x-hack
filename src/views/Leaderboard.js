import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import LeaderBoardImg from './leaderboard.png';


class Leaderboard extends Component {
  render() {
    
    return (
      <div>
        <Header />
        
        <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h4 class="display-5">leaderboard</h4>
          <img src={LeaderBoardImg}/>
        </div>

        <Footer />
    </div>
    );
  }
}

export default Leaderboard;
