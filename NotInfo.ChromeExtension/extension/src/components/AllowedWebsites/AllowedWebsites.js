/* global chrome */
import React, { useState, Component } from 'react';
import { Button } from 'react-bootstrap';
import { isIncluded } from '../../utils/arrayUtils';
import { changeIcon } from '../../utils/changeIcon';
import Analyze from '../Analyze/Analyze';
import Aux from '../../hoc/Auxiliary';
import APIResult from '../APIResult/APIResult';
import classes from './AllowedWebsites.module.scss';
import Loader from '../Loader/Loader';

class AllowedWebsites extends Component {
    state = {
        isWebsiteAdded: false,
        loading: false
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

        changeIcon(true);
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

        changeIcon(false);
        this.setState({ isWebsiteAdded: false });
    }

    analyzedClickedHandler = () => {
        console.log("%cCLICKED", "color:green")
        chrome.storage.sync.get('loading', (data) => {
            if (!data.loading) {
                chrome.storage.sync.set({ 'loading': true }, () => {
                    console.log('storage value set loading to true')
                });
            }
        });
        this.setState({ loading: true });
    }

    fetchedData = () => {
        chrome.storage.sync.get('loading', (data) => {
            if (data.loading) {
                chrome.storage.sync.set({ 'loading': false });
            }
        });
        this.setState({ loading: false });
    }

    render() {
        const { isWebsiteAdded, loading } = this.state;

        let btnVariant = "danger";
        let btnHandler = this.removeWebsiteHandler;
        let btnText = "Remove website";
        let navText = "!info is ON";

        if (!isWebsiteAdded) {
            btnVariant = "success";
            btnHandler = this.addWebsiteHandler;
            btnText = "Add website";
            navText = "!info is OFF";
        }

        return (
            <div className={[this.props.className, classes.Page].join(' ')}>
                <div className={[classes.Nav, isWebsiteAdded ? classes.On : classes.Off].join(' ')}>
                    <p>{navText}</p>
                </div>
                <div className={classes.Content}>
                    {loading
                        ? <Loader />
                        : <APIResult className={classes.APIResult} fetchedData={this.fetchedData} />}
                    <div style={loading ? { display: 'none' } : { display: 'block' }}>
                        <Analyze className={classes.Analyze} btnClickedHandler={this.analyzedClickedHandler} />
                    </div>
                </div>
                <div className={classes.Button} >
                    <Button variant={btnVariant} onClick={btnHandler}>
                        {btnText}
                    </Button>
                </div>
            </div>
        );
    }
}

export default AllowedWebsites;