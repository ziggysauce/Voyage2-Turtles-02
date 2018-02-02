import React, { Component } from 'react';
import '../stylesheets/main.css';

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
        
      </div>
    );
  }
}

export default App;
