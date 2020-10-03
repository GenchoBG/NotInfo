/* global chrome */
import React, { Component } from 'react';
import classes from './App.module.scss';
import Aux from './hoc/Auxiliary';
import Analyze from './components/Analyze';
import APIResult from './components/APIResult/APIResult';

class App extends Component {
  state = {
    loading: false
  }

  checkboxClickedHandler = (value) => {
    chrome.storage.sync.set({ 'analyze': value });
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
            ? <p>Loading...</p>
            : <Aux>
              <Analyze checkboxClickedHandler={this.checkboxClickedHandler} />
              <APIResult fetchedData={this.fetchedData} />
            </Aux>}
        </div>
      </div>
    );
  }
}

export default App;
