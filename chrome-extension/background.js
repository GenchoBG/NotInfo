chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({analyze: false}, function() {
		console.log('set analyzer to false');
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getAnalyzerStatus"){
    	let analyzeStatus = false;
    	chrome.storage.sync.get('analyze', function(data) {
			analyzeStatus = data.analyze;
		});
	  sendResponse({status: analyzeStatus});
	  return;
	}
	
	if (request.method === "updateIcon") {
		chrome.browserAction.setIcon({path: `icons/${request.value}.png`});
	}
});