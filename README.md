# Up2Day — Discover new things everyday !

With this website, you can see what is going on around you today !

This is a school project at ISTIA - Angers.
We are 3 students in 5th year :
- Antoine DE JESUS
- Pierre MARTIN
- Pierre MICHEL

## Getting Started

To get you started you can simply clone the Up2Day repository and install the dependencies:

### Prerequisites

You need git to clone the Up2Day repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test Up2Day. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone Up2Day

Clone the Up2Day repository using [git][git]:

```
git clone https://github.com/Kiruchi/Up2Day.git
cd Up2Day
```

### Install Dependencies

We have two kinds of dependencies in this project: tools, angular framework code and libraries.  The tools help
us manage the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular/front-end libraries code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
Up2Day changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

### Run the Application

We have preconfigured the project with an Express web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:3000/`.

## Directory Layout : Main files

```
launcher.js             --> Express file to launch the webserver
app/                    --> all of the source files for the application
  app.css               --> default stylesheet
  app.js                --> main application module
  index.html            --> app layout file (the main html template file of the app)
```

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
