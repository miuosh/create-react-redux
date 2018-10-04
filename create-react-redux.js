const fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events');

class myCreateEmitter extends EventEmitter { }
const createEmitter = new myCreateEmitter();
createEmitter.on('create', (name) => {
    console.log(`Create: \x1b[36m ${name} \x1b[0m`);
});



let indexFileName = 'index';

function prompt(question) {
    return new Promise((resolve, reject) => {
        const { stdin, stdout } = process;

        stdin.resume();
        stdout.write(question);

        stdin.on('data', (data) => resolve(data.toString().trim()));
        stdin.on('error', (err) => reject(err));
    });
}

prompt('Set App name: ')
    .then((name) => {
        indexFileName = name;
        logger(`Creating ${indexFileName}`);

        createProject(indexFileName);
        fillFiles(indexFileName);

        logger('Created!');
        process.exit();

    }).catch((err) => {
        console.log(err);
    });



function createProject(indexFileName) {
    const flag = 'ax';

    // Create project structure
    fs.mkdirSync('dist', errorCb);
    createEmitter.emit('create', 'dist');

    fs.mkdirSync('src', errorCb);
    createEmitter.emit('create', 'src');

    fs.open(`src/${indexFileName}.js`, flag, errorCb);
    createEmitter.emit('create', `src/${indexFileName}.js`);

    //actions
    fs.mkdirSync('src/actions', errorCb);
    createEmitter.emit('create', 'src/actions');

    fs.open('src/actions/actionTypes.js', flag, errorCb);
    createEmitter.emit('create', 'src/actions/actionTypes.js');

    //components
    fs.mkdirSync('src/components', errorCb);
    createEmitter.emit('create', 'src/components');

    fs.open('src/components/App.js', flag, errorCb);
    createEmitter.emit('create', 'src/components/App.js');

    //reducers
    fs.mkdirSync('src/reducers', errorCb);
    createEmitter.emit('create', 'src/reducers');

    fs.open('src/reducers/index.js', flag, errorCb);
    createEmitter.emit('create', 'src/reducers/index.js');

    fs.open('src/reducers/initialState.js', flag, errorCb);
    createEmitter.emit('create', 'src/reducers/initialState.js');

    //store
    fs.mkdirSync('src/store', errorCb);
    createEmitter.emit('create', 'src/store');

    fs.open('src/store/configureStore.js', flag, errorCb);
    createEmitter.emit('create', 'src/store/configureStore.js');

    fs.open('src/store/configureStore.dev.js', flag, errorCb);
    fs.open('src/store/configureStore.prod.js', flag, errorCb);


    //configuration files

    fs.open('package.json', flag, errorCb);
    createEmitter.emit('create', 'package.json');

    fs.open('webpack.config.js', flag, errorCb);
    createEmitter.emit('create', 'webpack.config.js');


}

function fillFiles(indexFileName) {

    /* FILES CONTENT */


    const initialState = `export default {

};`;

    const indexReducer = `import { combineReducers } from 'redux'

export default combineReducers({

});
`;

    const configureStoreDev = `import { applyMiddleware, createStore, compose } from "redux"
import { createLogger } from 'redux-logger'
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"
import rootReducer from "../reducers"
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
/////////////////////////////////////////////////////////////////

const middleware = applyMiddleware(reduxImmutableStateInvariant(), promise(), thunk, createLogger({}))

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        compose(
            middleware,
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )
        
    )
}
`;

    const configureStoreProd = `import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import promise from "redux-promise-middleware"

/////////////////////////////////////////////////////////////////
const middleware = applyMiddleware(promise(), thunk)

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        middleware
    );
}
`;


    const configureStore = `
if (process.env.NODE_ENV === 'production') {
        module.exports = require('./configureStore.prod');
    } else {
        module.exports = require('./configureStore.dev');
    }
`;

    const indexFile = `/*@ NODE MODULES  */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
/*@ LOCAL */
import App from './components/App';
import configureStore from './store/configureStore';

const store = configureStore();

render(
    <Provider store={store}>
        <App />
    </Provider>,
     document.getElementById('mainApp')
);`;

    const babelRC = `
{
    "presets": ["env", "react"]

}`;

    const eslint = `{
    "parser": "babel-eslint",
    "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "node": true,
      "jest": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "parserOptions": {
      "ecmaFeatures": {
        "experimentalObjectRestSpread": true,
        "jsx": true
      },
      "sourceType": "module"
    },
    "plugins": ["react"],
    "rules": {
      "react/prop-types": ["off"],
      "indent": ["error", 4, { "SwitchCase": 1 }],
      "linebreak-style": ["error", "windows"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-console": ["warn", { "allow": ["info", "error"] }],
      "arrow-parens": ["error", "always"],
      "space-before-function-paren": ["warn", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }],
      "object-curly-spacing": ["warn", "always"],
      "arrow-spacing": ["warn", { "before": true, "after": true }]
    }
  }
`;

    const App = `import React, { Component } from 'react'

export class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Hello world!!
            </div>
        )
    }
}

export default App;`;


    const webpackConfig = `const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: ['babel-polyfill', './src/${indexFileName}.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.js?$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader' },
        ]
    },
    stats: 'normal'
}`;


    const packageJson = `{
    "name": "${indexFileName}",
    "version": "1.0.0",
    "description": "",
    "main": "src/${indexFileName}.js",
    "scripts": {
      "test": "jest -- --watchAll",
      "watch-q": "webpack --mode=development --watch",
      "build": "webpack --mode=production",
      "lint": "eslint"
    },
    "dependencies": {
        "ag-grid": "^14.2.0",
        "ag-grid-react": "^14.2.0",
        "axios": "^0.16.2",
        "babel-eslint": "^8.2.6",
        "babel-polyfill": "^6.26.0",
        "chart.js": "^2.7.1",
        "classnames": "^2.2.5",
        "eslint": "^5.2.0",
        "eslint-plugin-import": "^2.13.0",
        "eslint-plugin-react": "^7.10.0",
        "lodash": "^4.15.0",
        "moment": "^2.19.3",
        "prop-types": "^15.6.0",
        "rc-time-picker": "^2.4.1",
        "react": "^15.6.2",
        "react-addons-css-transition-group": "^15.6.2",
        "react-autosuggest": "^9.3.2",
        "react-bootstrap": "^0.31.5",
        "react-color": "^2.14.0",
        "react-datalist": "^4.0.0",
        "react-datepicker": "^0.29.0",
        "react-dom": "^15.6.2",
        "react-dom-factories": "^1.0.2",
        "react-dropzone": "^3.13.4",
        "react-grid-layout": "^0.15.3",
        "react-intl": "^2.4.0",
        "react-notification-system": "^0.2.16",
        "react-notify": "^2.0.1",
        "react-redux": "^5.0.6",
        "react-timepicker": "^1.3.1",
        "react-toggle-display": "^2.2.0",
        "redux": "^3.7.2",
        "redux-logger": "^3.0.6",
        "redux-promise-middleware": "^4.4.2",
        "redux-thunk": "^2.2.0",
        "section-iterator": "^2.0.0",
        "style-loader": "^0.13.2"
    },
    "devDependencies": {
        "babel-core": "^6.26.0",
        "babel-jest": "^23.4.0",
        "babel-loader": "^7.1.2",
        "babel-plugin-lodash": "^3.3.2",
        "babel-plugin-syntax-object-rest-spread": "^6.13.0",
        "babel-plugin-transform-class-properties": "^6.24.1",
        "babel-plugin-transform-decorators-legacy": "^1.3.4",
        "babel-preset-env": "^1.6.1",
        "babel-preset-es2015": "^6.24.1",
        "babel-preset-react": "^6.24.1",
        "babel-preset-stage-0": "^6.24.1",
        "chalk": "^2.3.0",
        "cross-env": "^5.1.1",
        "css-loader": "^0.23.1",
        "enzyme": "^3.3.0",
        "enzyme-adapter-react-15": "^1.0.6",
        "jest": "^23.4.1",
        "jest-cli": "^23.4.1",
        "parallel-webpack": "^1.5.0",
        "progress-bar-webpack-plugin": "^1.11.0",
        "react-test-renderer": "^15.6.2",
        "redux-immutable-state-invariant": "^2.1.0",
        "style-loader": "^0.13.1",
        "webpack": "^4.16.1",
        "webpack-cli": "^3.0.8"
    },
    "author": "",
    "license": "ISC"
  }`;


    /* fill project files */
    fs.writeFileSync('src/store/configureStore.dev.js', configureStoreDev);
    fs.writeFileSync('src/store/configureStore.prod.js', configureStoreProd);
    fs.writeFileSync('src/store/configureStore.js', configureStore);

    fs.writeFileSync('src/reducers/index.js', indexReducer);
    fs.writeFileSync('src/reducers/initialState.js', initialState);

    fs.writeFileSync('src/components/App.js', App);
    fs.writeFileSync(`src/${indexFileName}.js`, indexFile);


    fs.writeFileSync('package.json', packageJson);
    fs.writeFileSync('webpack.config.js', webpackConfig);
    fs.writeFileSync('.babelrc', babelRC);
    createEmitter.emit('create', '.babelrc');

    fs.writeFileSync('.eslintrc', eslint);
    createEmitter.emit('create', '.eslintrc');

}


/* HELPER FUNCTIONS */

function errorCb(err, data) {
    if (err) {
        console.error(err);
        console.log(data);
    }
}

function logger(text) {
    console.log(`-> \x1b[36m ${text} \x1b[0m`);
}




