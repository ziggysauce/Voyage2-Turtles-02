import React, { Component } from 'react';

// Import files
import '../stylesheets/main.css';

class StickyNotes extends Component {
  constructor(){
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <span className=" stickynote-icon">+ <i className="far fa-sticky-note fa-lg"></i></span>
      </div>
    );
  }
}

export default StickyNotes;
