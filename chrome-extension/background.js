chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({analyze: false}, function() {
		console.log('set analyzer to false');
	});
});