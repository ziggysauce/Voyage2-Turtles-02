import React from 'react';

// Import files
import '../stylesheets/main.css';
import Pomodoro from './Pomodoro';
 
const Greeting = (props) => {
  let greetingUser = null;
  if(props.greetingToggle){
    greetingUser = (
    <div className="greeting-time-of-day">
     <span className="greeting-input">
      <form className='greetingForm' onSubmit={props.greetingSubmit}>
        <input id="greetingID" onChange={props.greetingHandler} type="text" />
        <input className="invisibleInput" type="submit" />
      </form>
     </span>
    </div>
    );
  }
  else {
    greetingUser = (
      <div className="greeting-time-of-day">
        Good morning,
        <span className="greeting-name" onClick={props.greetingToggleHandler}>{props.user}</span>
        .
      </div>
    );
  }

  return (
  <div className="greeting-container">
      {greetingUser}

      <p className="greeting-time">10:45 AM</p>
      <Pomodoro />
      <div className="picture-credits">
        <p>Photographed by <a href="https://www.pexels.com/photo/light-landscape-nature-red-33041/" target="_blank" rel="noopener">Paul IJsendoorn</a></p>
      </div>
  </div>
  );
}

export default Greeting;
