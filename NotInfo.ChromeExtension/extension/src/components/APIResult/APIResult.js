/* global chrome */
import React, { Component } from 'react';
import classes from './APIResult.module.scss';
import { ReactComponent as Fine } from '../../assets/fine.svg';
import { ReactComponent as Disinformation } from '../../assets/disinformation.svg';

class APIResult extends Component {
    state = {
        confidence: null
    }

    componentDidMount() {
        chrome.storage.sync.get('fetchedData', data => {
            if (data.fetchedData) {
                this.setState({ confidence: data.fetchedData.length > 0 });
            }
        });

        chrome.storage.onChanged.addListener((changes, namespace) => {
            console.log('api result change caught')
            console.log(changes)
            if (changes.fetchedData) {
                if (changes.fetchedData.newValue) {
                    const newConfidence = changes.fetchedData.newValue.length > 0;
                    this.setState({ confidence: newConfidence });
                }

                this.props.fetchedData();
            }
        });
    }

    render() {
        const { confidence } = this.state;
        console.log('confidence', confidence)
        return (
            <div className={[classes.Result, this.props.className].join(' ')}>
                {confidence !== null
                    ? confidence
                        // ? <Disinformation /> : <Fine />
                        ? <p>disinfo</p> : <p>fineeee</p>
                    : null}
            </div>
        );
    }

    componentWillUnmount() {
        console.log('unmounteddddd')
        chrome.storage.sync.set({ 'fetchedData': null });
    }
}

export default APIResult;