const key = "";

chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({analyze: false}, function() {
		console.log('set analyzer to false');
	});
});

// chrome.storage.onChanged.addListener(function(changes, namespace) {
    
// });

// see how i can get sendResponse data from content js through messages

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.method == "getAnalyzerStatus"){
    	let analyzeStatus = false;
    	chrome.storage.sync.get('analyze', function(data) {
			analyzeStatus = data.analyze;
		});
	  sendResponse({status: analyzeStatus});
	  return;
	}
	
	if (request.action === "changeIcon") {
		chrome.browserAction.setIcon({path: `icons/${request.payload}`});
		return;
	}

	if (request.method == "sendContent") {
		var translatedData = await translate(request.data);
		postContent(translatedData);
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
	}).then(function(data) {
		console.log(data)
		chrome.storage.sync.set({'fetchedData': data});
	}).catch(err=>{
		chrome.storage.sync.set({'fetchedData': null});
		console.log(err);
	});
}

const translate = async function (text) {
	let result = "";
	let sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
	for (let i = 0; i < sentences.length; i++) {
		const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}&q=${sentences[i]}&target=EN`, {
			method: "POST",
			headers: {
				"Content-Type": "text/plain; charset=utf-8"
			}
		});
		var json = await response.json();
		result = result.concat(json.data.translations[0].translatedText);
	}
	return result;
}