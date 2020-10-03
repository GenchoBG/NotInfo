/* global chrome */
import React, { Component } from 'react';

class Analyze extends Component {
    state = {
        checkboxValue: null
    }

    componentDidMount() {
        chrome.storage.sync.get(['analyze'], (data) => {
            console.log('from mounted', data.analyze)
            if (data) {
                this.setState({ checkboxValue: data.analyze });
            }
        });
    }

    checkboxClickedHandler = (e) => {
        const value = e.target.checked;
        console.log('checkbox clicked', value)
        this.setState({ checkboxValue: value });

        if (value) {
            this.props.checkboxClickedHandler(value);
            this.reloadPage();
            this.changeIcon('alert.png');
            return;
        }

        this.changeIcon('default.png');
    }

    reloadPage = () => {
        chrome.tabs.getSelected(null, (tab) => {
            chrome.tabs.executeScript(tab.id, { code: 'window.location.reload();' });
        });
    };

    changeIcon = (iconName) => {
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