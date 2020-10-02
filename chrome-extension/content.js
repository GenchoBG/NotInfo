(function () {
    chrome.storage.sync.get('analyze', function(data) {
		if(data.analyze){
			alert(document.querySelector("p").textContent);
		}
	});
})();