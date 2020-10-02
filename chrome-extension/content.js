(function () {
	chrome.storage.sync.get('analyze', function(data) {
		if(data.analyze){
			postContent(getContent());
		}
	});
})();

getContent = () => {
	var arrOfPtags = document.getElementsByTagName("p");
	let content = "";
	for (var i = 0;i < arrOfPtags.length; i++){
		content += arrOfPtags[i].textContent + " ";
	}
	return content;
}

postContent = (content) => {
	fetch('83.228.90.116:80/detectpropaganda', {
		method: 'post',
		body: content
	}).then(function(response) {
		return response.json();
	}).then(function(data) {
		alert(data);
	});
}