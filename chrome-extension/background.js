chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({analyze: false}, function() {
		console.log('set analyzer to false');
	});
});

// chrome.storage.onChanged.addListener(function(changes, namespace) {
    
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getAnalyzerStatus"){
    	let analyzeStatus = false;
    	chrome.storage.sync.get('analyze', function(data) {
			analyzeStatus = data.analyze;
		});
      sendResponse({status: analyzeStatus});
    }
});