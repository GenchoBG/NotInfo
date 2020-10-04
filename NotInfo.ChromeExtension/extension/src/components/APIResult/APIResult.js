/* global chrome */
import React, { Component } from 'react';
import classes from './APIResult.module.scss';

class APIResult extends Component {
    state = {
        confidence: null
    }

    componentDidMount() {
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (changes.fetchedData && changes.fetchedData.newValue) {
                const newConfidence = changes.fetchedData.newValue.result;
                this.setState({ confidence: newConfidence });
                this.props.fetchedData();
                chrome.storage.sync.set({'loading': false});
                return;
            }
        });
    }

    render() {
        const { confidence } = this.state;

        return (
            <div className={classes.Result}>
                {confidence !== null
                    ? confidence
                        ? "This article is disinformational!" : "Everything is fine."
                    : null}
            </div>
        );
    }

    componentWillUnmount() {
        chrome.storage.sync.set({'fetchedData': null});
    }
}

export default APIResult;