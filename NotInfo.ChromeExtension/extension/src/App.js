/* global chrome */
import React, { Component } from 'react';
import classes from './App.module.scss';
import Aux from './hoc/Aux';

class App extends Component {
  state = {
    confidence: null,
    checkboxValue: null,
    loading: false
  }

  componentDidMount() {
    chrome.storage.sync.get(['analyze'], (data) => {
      console.log('analyze', data.analyze)
      this.setState(prevState => { return { checkboxValue: data.analyze } });
      if (data.analyze) {
        chrome.storage.sync.get(['fetchedData'], (data) => {
          console.log('fetchedData', data.fetchedData)
          const confidence = data.fetchedData.result;
          this.setState(prevState => { return { confidence: confidence } });
        });
      }
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (changes.fetchedData && changes.fetchedData.newValue) {
        const newConfidence = changes.fetchedData.newValue.result;
        this.setState({ confidence: newConfidence, loading: false });
      } else if (changes.analyze && !changes.analyze.newValue) {
        this.setState({ confidence: null });
      }
    });
  }

  checkboxClickedHandler = (e) => {
    const value = e.target.checked;
    console.log('clicked checkbox state', value)
    this.setState(prevState => { return { checkboxValue: value } });
    chrome.storage.sync.set({ 'analyze': value });

    if (value) {
      this.setState(prevState => { return { loading: true } });
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
    const { confidence, checkboxValue, loading } = this.state;

    let renderData = (
      <div>Loading...</div>

    );

    let resultText = "";
    if (confidence) {
      resultText = confidence ? "This article is disinformational!" : "Everything is fine.";
    }

    if (!loading) {
      renderData = (
        <Aux>
          <div>
            <label>Is analyzer on:</label>
            <input type="checkbox" defaultChecked={checkboxValue} onChange={this.checkboxClickedHandler} className={classes.analyzerSwitch} />
          </div>
          <div className={classes.Result}>
            {resultText}
          </div>
        </Aux>
      );
    }



    return (
      <div className={classes.App}>
        <div className={classes.Content}>
          {renderData}
        </div>
      </div>
    );
  }
}

export default App;
