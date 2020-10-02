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
