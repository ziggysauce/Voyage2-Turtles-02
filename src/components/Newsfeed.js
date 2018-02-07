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
        <p className="newsfeed-icon"><i className="far fa-newspaper fa-lg"></i>
          <span className="newsfeed-label">Newsfeed</span>
        </p>
      </div>
    );
  }
}

export default Newsfeed;
