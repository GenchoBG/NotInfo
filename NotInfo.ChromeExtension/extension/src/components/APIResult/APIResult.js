/* global chrome */
import React, { Component } from 'react';
import classes from './APIResult.module.scss';
import { ReactComponent as Fine } from '../../assets/icons/fine.svg';
import { ReactComponent as Disinformation } from '../../assets/icons/disinformation.svg';

class APIResult extends Component {
    state = {
        confidence: null
    }

    componentDidMount() {
        chrome.storage.sync.get('fetchedData', data => {
            if (data.fetchedData) {
                this.setState({ confidence: data.fetchedData.result });
            }
        });

        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (changes.fetchedData && changes.fetchedData.newValue) {
                const newConfidence = changes.fetchedData.newValue.result;
                this.setState({ confidence: newConfidence });
                this.props.fetchedData();
                chrome.storage.sync.set({ 'loading': false });
                return;
            }
        });
    }

    render() {
        const { confidence } = this.state;
        console.log(confidence)
        return (
            <div className={[classes.Result, this.props.className].join(' ')}>
                {confidence !== null
                    ? confidence
                        ? <Disinformation /> : <Fine />
                    : null}
            </div>
        );
    }

    componentWillUnmount() {
        chrome.storage.onChanged.removeListener(() => {
            chrome.storage.sync.set({ 'fetchedData': null });
        });
    }
}

export default APIResult;