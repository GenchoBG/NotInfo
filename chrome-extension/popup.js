const checkbox = document.getElementById('analyzerSwitch');

checkbox.addEventListener("click", function() {
	const value = checkbox.checked;

	chrome.storage.sync.set({'analyze': value});

	if (value) {
		reloadPage();
		changeIcon('alert.png');
	} else {
		changeIcon('default.png');
	}
});

(function () {
	chrome.storage.sync.get(['analyze'], function(data) {
		checkbox.checked = data.analyze;
		if(data.analyze){
			chrome.storage.sync.get(['fetchedData'], function(data) {
				const confidence = data.fetchedData.result;
				showResult(confidence);
			});
		}
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if(changes.fetchedData){
	    	const newConfidence = changes.fetchedData.newValue.result;
	    	showResult(newConfidence);
	    	console.log(newConfidence)
		}else if(changes.analyze && !changes.analyze.newValue){
			emptyResultDiv();
		}
	});
})();

reloadPage = () => {
	chrome.tabs.getSelected(null, (tab) => {
		chrome.tabs.executeScript(tab.id, {code: 'window.location.reload();'});
  	});
};
showResult = (confidence) => {
	const div = document.getElementById('result');
	const result = confidence ? "This article is disinformational!" : "Everything is fine.";
	div.innerHTML = result;
}

changeIcon = (iconName) => {
	chrome.runtime.sendMessage({
		action: 'changeIcon',
		payload: iconName
	});
emptyResultDiv = () => {
	const div = document.getElementById('result');
	div.innerHTML = '';
}
