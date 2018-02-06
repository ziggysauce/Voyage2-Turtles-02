import React, { Component } from 'react';

// Import files
import '../stylesheets/main.css';

class Settings extends Component {
  constructor(){
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <i className="fas fa-cog fa-lg settings-icon"></i>
        </div>
    );
  }
}

export default Settings;
