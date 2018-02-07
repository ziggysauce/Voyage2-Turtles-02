import React, { Component } from 'react';

// Import files
import '../stylesheets/main.css';

class Tools extends Component {
  constructor(){
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <p className="tools-icon"><i className="fas fa-wrench fa-lg"></i>
          <span className="tools-label">Toolbox</span>
        </p>
      </div>
    );
  }
}

export default Tools;
