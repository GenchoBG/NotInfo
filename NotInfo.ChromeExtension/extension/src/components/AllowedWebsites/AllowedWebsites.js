/* global chrome */
import React, { useState, Component } from 'react';
import { Button } from 'react-bootstrap';
import { isIncluded } from '../../utils/arrayUtils';

class AllowedWebsites extends Component {
    state = {
        isWebsiteAdded: false
    }

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

                chrome.storage.sync.set({ 'analyze': isAlreadyAdded });
            });
        });
    }

    addWebsiteHandler = () => {
        chrome.storage.sync.get({ 'websiteURLS': [] }, (data) => {
            const websiteURLS = data.websiteURLS;
            chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
                const tabURL = tabs[0].url;
                const urlName = tabURL.split('/')[2];
                websiteURLS.push({ urlName });
                chrome.storage.sync.set({ websiteURLS });
            });
        });

        this.setState({ isWebsiteAdded: true });
    }

    removeWebsiteHandler = () => {
        chrome.storage.sync.get({ 'websiteURLS': [] }, (data) => {
            let websiteURLS = data.websiteURLS;
            chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
                const tabURL = tabs[0].url;
                const urlName = tabURL.split('/')[2];
                websiteURLS = websiteURLS.filter(el => el.urlName !== urlName);
                chrome.storage.sync.set({ websiteURLS });
            });
        });

        this.setState({ isWebsiteAdded: false });
    }

    render() {
        const { isWebsiteAdded } = this.state;

        let btnVariant = "danger";
        let btnHandler = this.removeWebsiteHandler;
        let btnText = "Remove website";

        if (!isWebsiteAdded) {
            btnVariant = "success";
            btnHandler = this.addWebsiteHandler;
            btnText = "Add website";
        }

        return (
            <Button variant={btnVariant} onClick={btnHandler}>
                {btnText}
            </Button>
        );
    }
}

export default AllowedWebsites;