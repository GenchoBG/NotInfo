/* global chrome */
import React, { Component } from 'react';
import classes from './App.module.scss';
import AllowedWebsites from './components/AllowedWebsites/AllowedWebsites';

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <div className={classes.Content}>
          <AllowedWebsites className={classes.AllowedWebsites} />
        </div>
      </div>
    );
  }
}

export default App;
