import React, { Component } from 'react';

// Import files
import '../stylesheets/main.css';

class Pomodoro extends Component {
  constructor(){
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <button className="pomodoro-button">Pomodoro Feature</button>
      </div>
    );
  }
}

export default Pomodoro;
