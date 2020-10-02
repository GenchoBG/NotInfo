(() => {
	const getArticleText = () => {
		let articleContent;
		const paragraphs = document.querySelectorAll("p");

		for (const paragraph of paragraphs) {
			articleContent += paragraph.textContent;
		}

		return articleContent;
	};

    chrome.storage.sync.get('analyze', (data) => {
		if (data.analyze) {
			const article = getArticleText();

			alert(article);
		}
	});
})();

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