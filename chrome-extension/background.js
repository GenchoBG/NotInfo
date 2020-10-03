chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({analyze: false}, function() {
		console.log('set analyzer to false');
	});
});

// chrome.storage.onChanged.addListener(function(changes, namespace) {
    
// });

// see how i can get sendResponse data from content js through messages

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getAnalyzerStatus"){
    	let analyzeStatus = false;
    	chrome.storage.sync.get('analyze', function(data) {
			analyzeStatus = data.analyze;
		});
      sendResponse({status: analyzeStatus});
    }
    else if (request.method == "sendContent"){
    	postContent(request.data,);
    }
});

postContent = (content) => {
	fetch('http://83.228.90.116:80/detectpropaganda', {
		method: 'post',
		body: content
	}).then(function(response) {
		return response.json();
	}).then(function(data) {
		console.log(data)
		chrome.storage.sync.set({'fetchedData': data});
	});
}