# Derby Dashboard &middot; [![Build Status](https://travis-ci.com/benz2012/derby-dashboard.svg?branch=master)](https://travis-ci.com/benz2012/derby-dashboard)

A web app that displays fundraising data, along with schedules and challenges.
[Live Website](https://www.derbydashboard.io)

![cover image of derby dashboard](public/og_image_v001.png)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Resources](#resources)
- [Contributing](#contributing)

## Prerequisites

You will need to Download and Install [Node.js](https://nodejs.org/en/download/) v6.x.x or greater

## Installation

Download or clone this project
```bash
git clone https://github.com/benz2012/derby-dashboard.git
```

Move into the project folder
```bash
cd derby-dashboard
```

Install all the Javascript libraries used to build this web application
```bash
npm install
```

## Usage

#### Development

You will need the following two environment variables to run the server in development: `AWS_ACCESS_KEY_ID_SERVER` and `AWS_SECRET_ACCESS_KEY_SERVER`. Request these from the project maintainers.

Create an environment variable file in the project root
```bash
touch env.js
```

Add the following lines to `env.js`
```javascript
process.env.AWS_ACCESS_KEY_ID_SERVER = 'YOURKEY'
process.env.AWS_SECRET_ACCESS_KEY_SERVER = 'YOURSECRETKEY'

```

Run the Node/Express server in development mode.
```bash
npm start
```

Open a web browser and navigate to [localhost:8080](http://localhost:8080)

This mode will simultaneously bundle your javascript code on every file save (nicknamed *Hot Module Replacement*).

#### Production

Bundle & Build the web application using *Webpack*
```bash
npm run build
```

Deployable static files/assets will now live in the `/public` directory of your project.

#### Worker Process

The worker process both scrapes/parses information from the web, and writes that information to an AWS DynamoDB.

You will need the following two environment variables: `AWS_ACCESS_KEY_ID_WORKER` and `AWS_SECRET_ACCESS_KEY_WORKER`, to connect to a database. You should create your own DynamoDB Tables and connect to that for testing. Contact project maintainers for proper database schema design.

Create an environment variable file in the project root
```bash
touch env.js
```

Add the following lines to `env.js`
```javascript
process.env.AWS_ACCESS_KEY_ID_WORKER = 'YOURKEY'
process.env.AWS_SECRET_ACCESS_KEY_WORKER = 'YOURSECRETKEY'

```

Run the process
```bash
node worker
```

#### Additional

Lint the Javascript source
```bash
npm run lint
```

## Resources

##### Major Libraries Used
- Express
- React
- Styled Components
- Webpack with Babel
- AWS SDK
- Cheerio

##### Maintainers
- [Ben Zenker](https://github.com/benz2012)

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/benz2012/derby-dashboard/compare).
