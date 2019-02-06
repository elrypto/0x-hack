import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import Backend from './../components/Backend';



class Admin extends Component {
  render() {
    
    return (
      <div>
        <Header />
        
        <div class="container">
      
          <Backend />
          
          <br/><br/>
        </div>
        <Footer />
    </div>
    );
  }
}

export default Admin;
