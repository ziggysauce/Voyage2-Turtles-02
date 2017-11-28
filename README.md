<img src="dist/assets/img/readme/intro.png">

## Table of Contents
* [About](#about)
* [Download](#download)
* [Features](#features)
* [Contributing](#getting-started-with-contributing)
* [Pull Requests](#making-a-pull-request)
* [Installation](#deployment-to-chrome)
* [Build Tools](#built-with)
* [Contributors](#contributors)

## About
DevTab is a front-end developer focused new tab extension for Google Chrome. This new homepage is designed to help cater to a developer's everyday needs including quicklinks, a color picker, code validators, sticky note reminders, and more. It is created by a  [team](#contributors) of passionate coders in collaboration with [chingu cohorts](https://chingu-cohorts.github.io/chingu-directory/), an international community of remote developers.

## Download
[Google Chrome Store](https://chrome.google.com/webstore/detail/devtab/alolnmpdpmfhpcaljhaheeoedkfkganm)

## Features
* Pomodoro timer to keep you productive and focused
* Quicklinks to quickly access your most used websites
* Sticky notes to store information, tasks, reminders, etc.
* Color picker to quickly access hex, RGB, and HSL codes
* HTML/CSS validators to ensure your code is up to standards with W3C
* Page speed insights to see how to optimize your code
* Newsfeed to stay informed on the latest news
* Settings to customize your homepage to your liking

<img src="dist/assets/img/readme/features.png">
<img src="dist/assets/img/readme/stickynotefeature.png">
<img src="dist/assets/img/readme/colorfeature.png">
<img src="dist/assets/img/readme/toolboxfeatures.png">
<img src="dist/assets/img/readme/newsfeedfeature.png">
<img src="dist/assets/img/readme/settingsfeature.png">


## Getting Started with Contributing
1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository and [clone your fork](https://help.github.com/articles/cloning-a-repository/) onto your machine.
2. Make sure you have the latests versions of [Node.js and npm](https://nodejs.org/en/) installed.
3. In the command line terminal, navigate to the root directory of your local clone.
4. Install gulp-cli globally if you don't already have it. `npm install gulp-cli -g`
5. Run `npm install` This will install all the development dependencies of this project.
6. Run `gulp` to begin developing! For more info on a gulp-based workflow, [click here](https://gulpjs.com/).
7. NOTE: all Sass and CSS is written in the src/scss folder. If you work on files in src/css, you risk having your work overwritten when gulp compiles the Sass to CSS.

## Making a Pull Request
1. When you've finished making your changes, [watch this video](https://www.youtube.com/watch?v=mENDYhfxH-o) to make sure your local clone is up-to-date, and then properly make a pull request.

## Deployment to Google Chrome
1. Clone or download this repo
2. Open up Google Chrome
3. Enter `chrome://extensions` in browser's address bar
4. In top right-hand corner, ensure that the **Developer Mode** box is checked
5. Click **Load unpacked extension...** ; a file navigation box will appear
6. Navigate to the directory where you cloned/downloaded the repo, select the `dist` folder and click **Select**
7. DevTab extension should appear on page
8. On right-hand side, ensure the **Enabled** box is checked
9. Open up a new tab either by pressing the new tab button on the top-right hand corner of your browser or by pressing `Cmd+T` (mac) or `Ctrl+T` (windows)

## Deployment to Mozilla Firefox
1. Clone or download this repo
2. Open up Mozilla Firefox
3. Either enter `about:addons` in browser's address bar and on the left-hand side, click on **extensions** or click the menu bar icon on the right-hand side of the address bar and click on **Add-ons**, then on the left-hand side, click on **extensions**
4. On the top, click on the settings wheel icon (labeled `Tools for all add-ons`) dropdown menu
5. Click **Install Add-on From File...** ; a file navigation box will appear
6. Either navigate to the directory where you cloned/downloaded the repo, select the `dist` folder and click **Open** or drag and drop the file into the Add-ons window
7. DevTab extension should appear on page
8. Open up a new tab either by pressing the new tab button on the top-right hand corner of your browser or by pressing `Cmd+T` (mac) or `Ctrl+T` (windows)

## Built With

* HTML5
* CSS3
* JavaScript
* jQuery/jQuery UI
* [tinycolor.js](https://github.com/bgrins/TinyColor)

## Contributors

* [Jeff Bothe](https://github.com/jmbothe)
* [Tyler Del Rosario](https://github.com/TylerDelRosario)
* [Dan Nguyen](https://github.com/ziggysauce)
