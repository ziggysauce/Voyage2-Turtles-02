import React from 'react';

// Import files
import '../stylesheets/main.css';

const Quicklinks = (props) => {
  let quicklinks = null;
  let quickForms = null;
  if(props.inputToggled){
    quickForms = (
    <div className="addUrl">
      <div className="urlContainer" onSubmit={props.submitHandler}>
        <form id="targetForm">
          <input onChange={props.titleHandler} id="titleInput" type="text" placeholder="Title" value={props.quickTitle} />
          <input onChange={props.urlHandler} id="urlInput" type="text" placeholder="Url" value={props.quickUrl} />
          <input id="invisibleInput" type="submit"/>
        </form>
      </div>
    </div>
    );
  }
  if(props.toggled){
    quicklinks = (
    <div className="quickDropdown">
      <h2>Popular Sites</h2>
      <ul className="quickList">
        {props.links.map((link, index) => {
          return (
          <li>
          <a href={link.quickUrl} target="_blank" rel="noopener">{link.quickTitle}</a>
          <button onClick={props.linkChangeHandler.bind(this, null, false, index)} className="link-delete">x</button>
          </li>
          );
        })}
      </ul>

      <button onClick={props.inputToggleHandler} className="addSite siteButton">Add Link</button>

      {quickForms}
    </div>
    );
  }
  
  return (
    <div className='ql-icon'>
      <p onClick={props.toggleHandler}>Quick Links</p>
      {quicklinks}
    </div>
  );
}

export default Quicklinks;
