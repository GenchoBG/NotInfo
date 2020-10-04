/* global chrome */
import React, { Component } from 'react';
import classes from './App.module.scss';

import Aux from './hoc/Auxiliary';
import Analyze from './components/Analyze';
import APIResult from './components/APIResult/APIResult';
import Loader from './components/Loader/Loader';
import AllowedWebsites from './components/AllowedWebsites/AllowedWebsites';

class App extends Component {
  state = {
    loading: false
  }

  checkboxClickedHandler = (value) => {
    this.setState({ loading: true });
  }

  fetchedData = () => {
    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;

    return (
      <div className={classes.App}>
        <div className={classes.Content}>
          {loading
            ? <Loader />
            : <Aux>
              <Analyze checkboxClickedHandler={this.checkboxClickedHandler} />
              <APIResult fetchedData={this.fetchedData} />
              <AllowedWebsites />
            </Aux>}
        </div>
      </div>
    );
  }
}

export default App;
