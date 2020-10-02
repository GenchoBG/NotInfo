chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({analyze: false}, function() {
		console.log('set analyzer to false');
	});
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "getAnalyzerStatus"){
    	let analyzeStatus = false;
    	chrome.storage.sync.get('analyze', function(data) {
			analyzeStatus = data.analyze;
		});
	  sendResponse({status: analyzeStatus});
	  return;
	}
	
	if (msg.action === "changeIcon") {
		chrome.browserAction.setIcon({path: `icons/${msg.payload}`});
	}
});