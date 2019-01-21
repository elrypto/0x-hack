import React, { Component } from 'react';

class Card extends Component {
  render() {
    return (
    
        <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">{this.props.title}</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">{this.props.growth}% <small class="text-muted">/ mo</small></h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>{this.props.line1}</li>
            <li>{this.props.line2}</li>
            <li>{this.props.line3}</li>
            <li>{this.props.line4}</li>
          </ul>
          <button type="button" class="btn btn-lg btn-block btn-outline-primary">{this.props.buttontext}</button>
        </div>
      </div>

    );
  }
}

export default Card;
