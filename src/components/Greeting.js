import React, { Component } from 'react';

// Import files
import '../stylesheets/main.css';
import Pomodoro from './Pomodoro';

class Greeting extends Component {
  constructor(){
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div className="greeting-container">
        <div className="greeting-time-of-day">Good morning,<span className="greeting-name">user</span>.</div>
        <p className="greeting-time">10:45 AM</p>
        <Pomodoro />
        <div className="picture-credits">
          <p>Photographed by <a href="https://www.pexels.com/photo/light-landscape-nature-red-33041/" target="_blank" rel="noopener">Paul IJsendoorn</a></p>
        </div>
      </div>
    );
  }
}

export default Greeting;
