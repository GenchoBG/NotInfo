/* global chrome */
import React, { Component } from 'react';

const ACTIVE_ICON = 'alert.png';
const DEFAULT_ICON = 'default.png';

class Analyze extends Component {
    state = {
        checkboxValue: null
    }

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

    checkboxClickedHandler = (e) => {
        const value = e.target.checked;
        this.setState({ checkboxValue: value });
        chrome.storage.sync.set({ 'analyze': value });

        this.changeIcon(value);

        if (value) {
            this.props.checkboxClickedHandler(value);
            return;
        }

    }

    reloadPage = () => {
        chrome.tabs.getSelected(null, (tab) => {
            chrome.tabs.executeScript(tab.id, { code: 'window.location.reload();' });
        });
    };

    changeIcon = (value) => {
        let iconName = DEFAULT_ICON;

        if (value) {
            this.reloadPage();
            iconName = ACTIVE_ICON;
        }

        chrome.runtime.sendMessage({
            action: 'changeIcon',
            payload: iconName
        });
    }

    render() {
        const { checkboxValue } = this.state;

        return (
            <div>
                <div>
                    <label>Is analyzer on:</label>
                    <input type="checkbox" checked={checkboxValue} onChange={this.checkboxClickedHandler} />
                </div>
            </div>
        );
    }
}

export default Analyze;