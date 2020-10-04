/* global chrome */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { isIncluded } from '../../utils/arrayUtils';

class Analyze extends Component {
    state = {
        isWebsiteAdded: false,
    };

    componentDidMount() {
        chrome.storage.sync.get({ 'websiteURLS': [] }, (data) => {
            const websiteURLS = data.websiteURLS;
            chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
                const tabURL = tabs[0].url;
                const urlName = tabURL.split('/')[2];
                const isAlreadyAdded = isIncluded(websiteURLS, "urlName", urlName);

                if (isAlreadyAdded) {
                    this.setState({ isWebsiteAdded: true });
                }
            });
        });
    }

    btnClickedHandler = () => {
        this.props.btnClickedHandler();
    }

    reloadPage = () => {
        chrome.tabs.getSelected(null, (tab) => {
            chrome.tabs.executeScript(tab.id, { code: 'window.location.reload();' });
        });
    };

    render() {
        const { isWebsiteAdded } = this.state;

        return (
            <div className={this.props.className}>
                <Button variant='info' onClick={this.btnClickedHandler}>
                    {isWebsiteAdded ? "Analyze again" : "Analyze"}
                </Button>
            </div>
        );
    }
}

export default Analyze;