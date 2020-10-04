/* global chrome */
const ACTIVE_ICON = 'alert.png';
const DEFAULT_ICON = 'default.png';

export const changeIcon = (value) => {
    let iconName = DEFAULT_ICON;

    if (value) {
        iconName = ACTIVE_ICON;
    }

    chrome.runtime.sendMessage({
        method: 'changeIcon',
        payload: iconName
    });
}