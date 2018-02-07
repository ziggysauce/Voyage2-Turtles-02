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
        <p className="stickynote-icon">+ <i className="fas fa-sticky-note fa-lg"></i>
          <span className="sticky-note-label">Sticky Notes</span>
        </p>
      </div>
    );
  }
}

export default StickyNotes;
