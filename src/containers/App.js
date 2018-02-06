import React, { Component } from 'react';

// Import files
import '../stylesheets/main.css';
import Greeting from '../components/Greeting';
import Quicklinks from '../components/Quicklinks';
import StickyNotes from '../components/StickyNotes';
import ColorPicker from '../components/ColorPicker';
import Tools from '../components/Tools';
import Newsfeed from '../components/Newsfeed';
import Settings from '../components/Settings';

class App extends Component {
  constructor(){
    super();
    this.state = {
    //We can still decide what exactly to put in here.
    };
  }

  componentDidMount(){
    //Here we retrieve data from localstorage
    const retrieveStorage = localStorage.getItem("tabData");
    if(retrieveStorage){
      //If retrieve storage exists we push the localstorage items into the App.js state.
      this.setState({});
    }
    else {
      //If retrieve storage doesnt exist, we set a new localstorage filled with default values.
      const defaultData = {

      };
      localStorage.setItem("tabData", "Hello World!"); 
    }
  }

  render() {
    return (
      <div className="App">
        <div className="bg-overlay" />
        <Greeting />
        <Quicklinks />
        <StickyNotes />
        <ColorPicker />
        <Tools />
        <Newsfeed />
        <Settings />
      </div>
    );
  }
}

export default App;
