## DevTab 2.0

**This is an upcoming version of DevTab which will be rebuilt from the ground-up with ReactJS.**

Our top priority in this version is to optimize DevTab for a truly fast tab-like speed.

**Secondly** We wish to add many new features for our users to use.
NOTE: Depending upon a variety a factors, not all of the features below may not
implemented in this version.

1: ToDo List with the preset checklists such as the popular Front-End Checklist.

2: Calendar Feature that allows users to mark certain days and write notes for that days.

3: JSON viewer/validator

4: Wakatime Dashboard. This will allow users to view how much they code, their stats, set coding goals.

5: A Github Dashboard, This will allows users to view their repos, profile. Moreover, this will allow users
 to search for repos with 'help wanted' issues or issues with any tag.
 
6: More Image galleries and the ability for users to create custom galleries.

7: Additional Languages.

## Installation

**Requirements**
1: Git
2: NodeJS and npm

**Guide**
1: Clone this repository onto your preferred directory

2: Run ```npm install``` within the cloned repository

3: Once the dependency installation is complete, run ```npm start``` to run the server.

4: Run ```npm run watch-css``` to update and compile the sass files into a usable css file.


## File Structure

**containers file**
This file contains all of the necessary files for App.js.

**components file**
This file will contain the files to all the other components for our application.

**assets file**
This file will contain the pictures that we will use in our application.

**stylesheets file**
This file will contain all of the stylesheets for our application.

## App Structure(Might change during development)

The idea is to have one stateful component that will contain ALL of the state for the entire application.

This stateful component(App.js) will pass it's state to it's stateless children components as props.

Moreover, App.js will be the only component to retrieve data from localstorage and it will fill it's state
with the data from localstorage.(if the localstorage item doesnt exist then the app.js state will have default
values.)

## What problems does DevTab 2.0 aim to solve?

At the current moment, the current jQuery based DevTab is inefficient.

Whenever DevTab is run, the webpage renders EVERYTHING at once. With React, we can conditionally render 
each feature with React and we can do so in a manageable way.

In the current DevTab, each feature and module grabs data from localstorage and parses it from a string
into an object. This constant grabbing from localstorage takes up alot of uneccessary resources.
With ReactJS, we can model our app so that we grab from localstorage once and no more.

With ReactJS, we can add in and re-use components easily when we need them.