const checkbox = document.getElementById('analyzerSwitch');

checkbox.addEventListener("click", function() {
	const value = checkbox.checked;

	chrome.storage.sync.set({'analyze': value});

	if (value) {
		reloadPage();
		changeIconToDefault(false);
	} else {
		changeIconToDefault();
	}
});

(() => {
	chrome.storage.sync.get(['analyze'], function(data) {
		console.log(data)
		checkbox.checked = data.analyze;
	});
})();

reloadPage = () => {
	chrome.tabs.getSelected(null, (tab) => {
		chrome.tabs.executeScript(tab.id, {code: 'window.location.reload();'});
  	});
};

changeIconToDefault = (toDefault = true) => {
	const value = toDefault ? 'default' : 'alert';
	
	chrome.runtime.sendMessage({
		method: 'updateIcon',
		value
	});
}