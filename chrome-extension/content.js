(() => {
	chrome.storage.sync.get('analyze', (data) => {
		if (data.analyze) {
			const article = getArticleText();
			alert(article);

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
	let articleContent;
	const paragraphs = document.querySelectorAll("p");

	for (const paragraph of paragraphs) {
		articleContent += paragraph.textContent;
	}

	return articleContent;
};

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