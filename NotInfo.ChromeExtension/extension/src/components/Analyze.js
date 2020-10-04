/* global chrome */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

const ACTIVE_ICON = 'alert.png';
const DEFAULT_ICON = 'default.png';

class Analyze extends Component {
    componentDidMount() {
        chrome.storage.sync.get(['analyze'], (data) => {
            if (data) {
                this.setState({ checkboxValue: data.analyze });
            }
        });

        chrome.storage.onChanged.addListener((changes, namespace) => {
            console.log('[Analyze]');
            console.log(changes)
            if (changes.analyze) {
                this.setState({ checkboxValue: changes.analyze.newValue });
                this.changeIcon(changes.analyze.newValue);
            }
        });
    }

    btnClickedHandler = (e) => {
        console.log('clicked');

        this.props.btnClickedHandler(true);
    }

    changeIcon = (value) => {
        let iconName = DEFAULT_ICON;

        if (value) {
            iconName = ACTIVE_ICON;
        }

        chrome.runtime.sendMessage({
            action: 'changeIcon',
            payload: iconName
        });
    }

    render() {
        return (
            <Button variant='info' onClick={this.btnClickedHandler}>
                Analyze
            </Button>
        );
    }
}

export default Analyze;