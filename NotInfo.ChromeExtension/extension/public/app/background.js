chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({ loading: false });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('message received', request.method)
	console.log(sender)
	if (request.method == "getAnalyzerStatus") {
		let analyzeStatus = false;
		chrome.storage.sync.get('analyze', function (data) {
			analyzeStatus = data.analyze;
		});
		sendResponse({ status: analyzeStatus });
		return;
	}

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
		chrome.storage.sync.set({ 'fetchedData': data });
	}).catch(err => {
		chrome.storage.sync.set({ 'fetchedData': null });
		console.log(err);
	});
}
