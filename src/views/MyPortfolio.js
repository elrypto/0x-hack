import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';



export default class MyPortfolio extends Component {
  render() {
    
    return (
      <div>
        <Header />
        
        <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h4 class="display-5">My Portfolio - Details</h4>
            <p>Something to see here... soon</p>
        </div>

        <Footer />
    </div>
    );
  }
}

