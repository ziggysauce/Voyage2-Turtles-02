import React, { Component } from 'react';

// Import files
import '../stylesheets/main.css';

class ColorPicker extends Component {
  constructor(){
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <i className="fas fa-paint-brush fa-lg colorpicker-icon"></i>
      </div>
    );
  }
}

export default ColorPicker;
