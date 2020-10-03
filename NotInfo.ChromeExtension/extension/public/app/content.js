(() => {
	chrome.storage.sync.get('analyze', (data) => {
		if (data.analyze) {
			const article = getArticleText();

			chrome.runtime.sendMessage({
				method: 'sendContent',
				data: article
			});
		}
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
	    // do sth with changes.fetchedData.newValue
	    if(changes.fetchedData && changes.fetchedData.newValue.result){
			getTagByContent("В първата част на");
	    }
	});
})();

getTagByContent = (content) => {
	const pTags = document.getElementsByTagName("p");
	const searchText = content;
	let found;

	for (var i = 0; i < pTags.length; i++) {
		if (pTags[i].textContent.includes(searchText)) {
			found = pTags[i];
			break;
		}
	}

	found.style.border = "1px solid red";
	found.style.padding = "10px";
	found.style.borderRadius = "15px"; 
}

const getArticleText = () => {
	let articleContent = "";
	const paragraphs = document.querySelectorAll("p");

	for (const paragraph of paragraphs) {
		articleContent += paragraph.textContent;
	}

	return articleContent;
};