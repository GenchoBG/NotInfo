const checkbox = document.getElementById('analyzerSwitch');

checkbox.addEventListener("click", function() {
	const value = checkbox.checked;
	chrome.storage.sync.set({'analyze': value});
	if(value){
		chrome.tabs.getSelected(null, function(tab) {
		  	var code = 'window.location.reload();';
		  	chrome.tabs.executeScript(tab.id, {code: code});
		});
	}
});

(function () {
chrome.storage.sync.get(['analyze'], function(data) {
	console.log(data)
	checkbox.checked = data.analyze;
});
})();
