import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer class="pt-4 my-md-5 pt-md-5 border-top">
        <div class="row">
          <div class="col-12 col-md">
            <img class="mb-2" src="/docs/4.2/assets/brand/bootstrap-solid.svg" alt="" width="24" height="24" />
            <small class="d-block mb-3 text-muted">&copy; 2019</small>
          </div>
          <div class="col-6 col-md">
          <h5>el_rypto</h5>
          <ul class="list-unstyled text-small">
            <li><a class="text-muted" href="https://github.com/lrypto/">github</a></li>
            <li><a class="text-muted" href="https://github.com/lrypto/0x-hack">0x hack</a></li>
          </ul>
      </div>
        </div>
      </footer>       
    );
  }
}

export default Footer;
