import React, { Component } from 'react';

// Import files
import '../stylesheets/main.css';

class Newsfeed extends Component {
  constructor(){
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <i className="far fa-newspaper fa-lg newsfeed-icon"></i>
      </div>
    );
  }
}

export default Newsfeed;
