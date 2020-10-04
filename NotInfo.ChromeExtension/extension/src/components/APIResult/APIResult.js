/* global chrome */
import React, { Component } from 'react';
import classes from './APIResult.module.scss';

class APIResult extends Component {
    state = {
        confidence: null
    }

    componentDidMount() {
        chrome.storage.sync.get(['analyze'], (data) => {
            if (data.analyze) {
                chrome.storage.sync.get(['fetchedData'], (data) => {
                    this.setState({ confidence: data.fetchedData.result });
                });
            }
        });

        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (changes.fetchedData && changes.fetchedData.newValue) {
                const newConfidence = changes.fetchedData.newValue.result;
                this.setState({ confidence: newConfidence });
                this.props.fetchedData();
                return;
            }

            if (changes.analyze && !changes.analyze.newValue) {
                this.setState({ confidence: null });
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
}

export default APIResult;