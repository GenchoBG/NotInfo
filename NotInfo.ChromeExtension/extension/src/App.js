/* global chrome */
import React, { Component } from 'react';
import classes from './App.module.scss';

class App extends Component {
  state = {
    confidence: null,
    checkboxValue: null
  }

  componentDidMount() {
    chrome.storage.sync.get(['analyze'], (data) => {
      this.setState({ checkboxValue: data.analyze });
      if (data.analyze) {
        chrome.storage.sync.get(['fetchedData'], function (data) {
          const confidence = data.fetchedData.result;
          this.setState(prevState => { return { confidence: confidence } });
        });
      }
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (changes.fetchedData && changes.fetchedData.newValue) {
        const newConfidence = changes.fetchedData.newValue.result;
        this.setState({ confidence: newConfidence });
      } else if (changes.analyze && !changes.analyze.newValue) {
        this.setState({ confidence: null });
      }
    });
  }

  checkboxClickedHandler = (e) => {
    const value = e.target.checked;
    chrome.storage.sync.set({ 'analyze': value });

    if (value) {
      this.reloadPage();
      this.changeIcon('alert.png');
    } else {
      this.changeIcon('default.png');
    }
  }

  reloadPage = () => {
    chrome.tabs.getSelected(null, (tab) => {
      chrome.tabs.executeScript(tab.id, { code: 'window.location.reload();' });
    });
  };

  changeIcon = (iconName) => {
    chrome.runtime.sendMessage({
      action: 'changeIcon',
      payload: iconName
    });
  }

  render() {
    const { confidence, checkboxValue } = this.state;

    return (
      <div className={classes.App}>
        <div className={classes.Content}>
          <div>
            <label>Is analyzer on:</label>
            <input type="checkbox" defaultChecked={checkboxValue} onChange={this.checkboxClickedHandler} className={classes.analyzerSwitch} />
          </div>
          <div className={classes.Result}>
            {confidence !== null ?
              confidence ? "This article is disinformational!" : "Everything is fine."
              : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
