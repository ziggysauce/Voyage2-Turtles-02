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
    //This is the default data for DevTab
    quickLinks: [
    	{
    		quickTitle: 'Github',
    		quickUrl: 'https://github.com'
    	},
    	{
    		quickTitle: 'Stack Overflow',
    		quickUrl: 'https://stackoverflow.com'
    	},
    	{
    		quickTitle: 'MDN',
    		quickUrl: 'https://developer.mozilla.org'
    	}
    ],
    quickToggle:false,
    quickInputToggle:false,
    quickTitleInput: '',
    quickUrlInput:'',

    stickyNotes: [
    	{
    		stickyTitle: 'Thank You!',
    		stickyColor: 'blue',
    		stickyMessage: 'Thank You for choosing DevTab! To begin, click on "User" to set your name!'
    	}
    ],

    userTitle:'User',
    userToggle: false,
    userInput:'',

    pomodoroState: {
    	pomodoroTrue: false,
    	pomodoroTime: '30:00'
    }

   };
  }

  //-------------------Data RETRIEVE and POST------------------------
  componentDidMount(){
    //Here we retrieve data from localstorage
    let retrieveStorage = localStorage.getItem("devTabData");
    if(retrieveStorage){
      //If retrieve storage exists we push the localstorage items into the App.js state.
      retrieveStorage = JSON.parse(retrieveStorage);//We parse localstorage into useable object form.

      this.setState({
      	quickLinks: retrieveStorage.quickLinks,
      	stickyNotes: retrieveStorage.stickyNotes,
      	userTitle: retrieveStorage.userTitle,
      	pomodoroState: retrieveStorage.pomodoroState
      });
    }
    else {
      //If retrieve storage DOESN'T exist, then we create a default object and we push it into localstorage.
      const defaultStorage = JSON.stringify(this.state);
      localStorage.setItem("devTabData", defaultStorage); 
    }
    //console.log(retrieveStorage);
    //For debugging purposes.
  }

  //This will be a re-usable function that pushes the updated state into localstorage
  updateLocalStorage(){
  	const currentStateStorage = JSON.stringify(this.state);
  	localStorage.setItem("devTabData", currentStateStorage);
  }
  //-------------------------------------------------------------------

  //*****************************************************************//
  //--------------------QUICK LINK METHODS---------------------------//
  //*****************************************************************//
  addQuickLink = (newLink, deleteOrAdd, linkIndex) => {
  	let currentArray = this.state.quickLinks.slice();

  	if(deleteOrAdd){//If deleteOrAdd equals true, then we add to the quicklinks
  		currentArray.push(newLink);
  		this.setState({quickLinks:currentArray.slice(), quickTitleInput:'', quickUrlInput:'', quickInputToggle: false}, function(){
  			this.updateLocalStorage();
  		});
  	}
  	else {//If deleteOrAdd equals false, then we remove the link from quicklinks.
  		currentArray.splice(linkIndex, 1);

  		this.setState({quickLinks:currentArray.slice()}, function(){//setState doesnt immediatelly update state so we need to create a callback
  			this.updateLocalStorage();								//before we can update localstorage.
  		});
  	}
  }

  handleQuickTitle = (event) => {//Handles the title input
  	this.setState({quickTitleInput: event.target.value});
  }

  handleQuickUrl = (event) => {//Handles the url input
  	this.setState({quickUrlInput: event.target.value});
  }

  handleQuickSubmit = (event) => {//When the form is submitted we grab the current values from the state and creates a new link object
  								  //and we push our new link object into the quicklink array.
  	event.preventDefault()
  	if(this.state.quickTitleInput !== ''&&this.state.quickUrlInput !== ''){
  		const title = this.state.quickTitleInput;
  		const url = this.state.quickUrlInput;
  		let newLink = {
  			quickTitle: title,
  			quickUrl: url
  		};
  		console.log(newLink);
  		this.addQuickLink(newLink, true, null);
  	}
  }

  toggleQuickLink = () => {//This toggles the quicklinks itself. 
    this.setState({quickToggle: !this.state.quickToggle});
  }

  toggleQuickForm = () => {//This toggles the input forms inside of the quicklinks
  	this.setState({quickInputToggle: !this.state.quickInputToggle});
  }
  //*****************************************************************//
  //-----------------------------------------------------------------//
  //*****************************************************************//



  //*****************************************************************//
  //--------------------------GREETING METHODS-----------------------//
  //*****************************************************************//
  submitUserHandler = (event) => {
  	event.preventDefault()
  	this.setState({userTitle: this.state.userInput, userToggle:false}, function(){
  		this.updateLocalStorage();
  	});

  }

  userChangeHandler = (event) => {
  	this.setState({userInput: event.target.value});
  }

  toggleUserInput = () => {
  	this.setState({userToggle: !this.state.userToggle});
  }
  //*****************************************************************//
  //-----------------------------------------------------------------//
  //*****************************************************************//
  render() {
    return (
      <div className="App">
        <div className="bg-overlay" />
        <Greeting
         user={this.state.userTitle}
         greetingToggle={this.state.userToggle}
         greetingSubmit={this.submitUserHandler}
         greetingHandler={this.userChangeHandler}
         greetingToggleHandler={this.toggleUserInput}/>

        <Quicklinks
         inputToggled={this.state.quickInputToggle}
         toggled={this.state.quickToggle}
         toggleHandler={this.toggleQuickLink}
         inputToggleHandler={this.toggleQuickForm}
         titleHandler={this.handleQuickTitle}
         urlHandler={this.handleQuickUrl}
         submitHandler={this.handleQuickSubmit}
         links={this.state.quickLinks}
         linkChangeHandler={this.addQuickLink}
         quickTitle={this.state.quickTitleInput}
         quickUrl={this.state.quickUrlInput}/>

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
