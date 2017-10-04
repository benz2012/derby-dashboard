# React Boilerplate Deployable

A personal & opinionated boilerplate, full-stack, based in React. Immediately ready for development, and production deployment to Heroku, without any additional configuration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Resource](#resource)


## Prerequisites

1. You will need to Download and Install [Node.js](https://nodejs.org/en/download/) v6.x.x or greater
2. You will need both a [Github](https://github.com/join) and a [Heroku](https://signup.heroku.com/) account
3. You will need to install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

## Installation

Create your desired React app directory
```bash
mkdir my-react-app
```

Move into that directory
```bash
cd my-react-app
```

Download or clone this project, setting your app as the root
```bash
git clone https://github.com/benz2012/react-boilerplate.git .
```

Allow your shell the ability to execute the setup script
```bash
chmod +x ./internals/start.sh
```

Establish the boilerplate as a standalone project. Requires user input. Read the [inline comments](internals/start.sh) for more details.
```bash
./internals/start.sh
```

## Usage

Once the project is established using ```./internals/start.sh```, the following can be performed for development and production deployment.

#### Build/Bundle the Javascript & Assets for production use
```bash
npm run build
```

#### Run the Node/Express server in production mode
```bash
npm start
```
*NOTE*: The server will attempt to serve the statically built html/javascript/assets from the output of ```npm run build```, make sure this has been done prior to starting the server in production mode.

---

#### Run the Node/Express server in development mode
```bash
npm run dev
```
Webpack will bundle the Javascript code using Hot Module Replacement, allowing for a quicker development cycle.

#### Lint the Javascript source
```bash
npm run lint
```


## Architecture

### Hosting
- Heroku [&#128279;](https://devcenter.heroku.com/)
	- Nodejs buildpack
	- Deployment thru GitHub hooks (no Heroku remote)
---
### Server
- Node [&#128279;](https://nodejs.org/en/) - *runtime environment*
- Express [&#128279;](https://expressjs.com/) - *web server*
	- [express.static()](http://expressjs.com/en/api.html#express.static) - *serves all files from the `public` directory*
- Hot Module Replacement [&#128279;](https://webpack.js.org/concepts/hot-module-replacement/) *(development only)*
	- [Webpack Dev Middleware](https://github.com/webpack/webpack-dev-middleware)
	- [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware)
---
### Client
- React [&#128279;](https://reactjs.org/) - *ui library*
- Styled Components [&#128279;](https://www.styled-components.com/) - *css in js*
- Modified AirBnB lint configuration [&#128279;](https://github.com/airbnb/javascript)
- Webpack [&#128279;](https://webpack.js.org/) - *asset bundler*
	- [Babel loader](https://github.com/babel/babel-loader) - *transpilation*
	- [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin) - *dynamic `index.html` creation*
	- **Development Only**
		- [Hot Module Replacement](https://webpack.js.org/plugins/hot-module-replacement-plugin/)
		- [React Hot Loader](https://github.com/gaearon/react-hot-loader)
	- **Production Only**
		- [Clean Webpack Plugin](https://github.com/johnagan/clean-webpack-plugin) - *output folder cleanliness*
		- [UglifyJS Webpack Plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) - *minification*
		- [Commons Chunk Plugin](https://webpack.js.org/plugins/commons-chunk-plugin/) - *bundle splitting*
		- [Predictable long term caching with Webpack](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31) - *hash persistence*

## Resource

**Additional Documentation**
- [start.sh](internals/start.sh) - The comments in this file will describe the steps being performed when *establishing* the boilerplate as a standalone project

**Project Specific Files** (*The following files will replace their matching file, within the current repository, upon startup*)
- [README.md](internals/README.md)

**Author(s):**
- Ben Zenker - [benz2012](https://github.com/benz2012)
