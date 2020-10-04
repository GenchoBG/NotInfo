/* global chrome */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { isIncluded } from '../../utils/arrayUtils';

const ACTIVE_ICON = 'alert.png';
const DEFAULT_ICON = 'default.png';

class Analyze extends Component {

    state = {
        isWebsiteAdded: false
    };

    componentDidMount() {
        chrome.storage.sync.get({ 'websiteURLS': [] }, (data) => {
            const websiteURLS = data.websiteURLS;
            chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
                const tabURL = tabs[0].url;
                const urlName = tabURL.split('/')[2];
                const isAlreadyAdded = isIncluded(websiteURLS, "urlName", urlName);

                if (isAlreadyAdded) {
                    this.setState({isWebsiteAdded: true});
                }
            });
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

    btnClickedHandler = () => {
        chrome.runtime.sendMessage({
            method: 'getDOMContent',
            data: null
        });

        this.props.btnClickedHandler();
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