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
        <p className="colorpicker-icon"><i className="fas fa-paint-brush fa-lg"></i>
          <span className="color-picker-label">Color Picker</span>
        </p>
      </div>
    );
  }
}

export default ColorPicker;
