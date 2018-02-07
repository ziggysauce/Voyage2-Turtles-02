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
        <p className="settings-icon"><i className="fas fa-cog fa-lg"></i>
          <span className="settings-label">Settings</span>
        </p>
      </div>
    );
  }
}

export default Settings;
