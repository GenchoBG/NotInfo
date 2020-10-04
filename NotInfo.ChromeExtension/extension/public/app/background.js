chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({ loading: false });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	chrome.storage.sync.get('websiteURLS', (data) => {
		const websiteURLS = data.websiteURLS;

		if (websiteURLS) {
			chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
				const tabURL = tabs[0].url;
				const urlName = tabURL.split('/')[2];
				const isAlreadyAdded = isIncluded(websiteURLS, "urlName", urlName);

				if (isAlreadyAdded) {
					chrome.browserAction.setIcon({ path: 'icons/alert.png' });
				} else {
					chrome.browserAction.setIcon({ path: 'icons/default.png' });
				}
			});
		} else {
			chrome.browserAction.setIcon({ path: './icons/default.png' });
		}
	});
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.method === "changeIcon") {
		chrome.browserAction.setIcon({ path: `icons/${request.payload}` });
		return;
	}

	if (request.method == "sendContent") {
		postContent(request.data);
		return;
	}
});

const postContent = (content) => {
	fetch('http://83.228.90.116:80/detectpropaganda', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(content)
	}).then(response => {
		return response.json();
	}).then(function (data) {
		console.log(data)
		chrome.storage.sync.set({ 'fetchedData': data ? data : [] });
	}).catch(err => {
		chrome.storage.sync.set({ 'fetchedData': null });
	});
}

const isIncluded = (arr, elName, elValue) => {
	const length = arr.length;
	for (let i = 0; i < length; i++) {
		if (arr[i][elName] == elValue) {
			return true;
		}
	}
	return false;
}