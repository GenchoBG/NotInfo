(() => {
	chrome.storage.sync.get({ 'websiteURLS': [] }, (data) => {
		const websiteURLS = data.websiteURLS;
		const urlName = window.location.toString().split('/')[2];
		const isAlreadyAdded = isIncluded(websiteURLS, "urlName", urlName);
		if (isAlreadyAdded) {
			chrome.runtime.sendMessage({
				method: 'changeIcon',
				payload: 'alert.png'
			});
			chrome.runtime.sendMessage({
				method: 'sendContent',
				data: getArticleText()
			});
		} else {
			chrome.runtime.sendMessage({
				method: 'changeIcon',
				payload: 'default.png'
			});
		}
	});

	// chrome.storage.onChanged.removeListener(() => {
	chrome.storage.onChanged.addListener((changes, namespace) => {
		//search for a paragraph to customize
		if (changes.loading && changes.loading.newValue) {
			alert('loading...')
			chrome.runtime.sendMessage({
				method: 'sendContent',
				data: getArticleText()
			});
		}

		if (changes.fetchedData && changes.fetchedData.newValue.result) {
			getTagByContent("component");
		}
	});
	// });
})();

const getTagByContent = (content) => {
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
	found.scrollIntoView({ behavior: "smooth", block: "center" });
}

const getArticleText = () => {
	let articleContent = "";
	const paragraphs = document.querySelectorAll("p");

	for (const paragraph of paragraphs) {
		articleContent += paragraph.textContent;
	}

	return articleContent;
};

const isIncluded = (arr, elName, elValue) => {
	const length = arr.length;
	for (let i = 0; i < length; i++) {
		if (arr[i][elName] == elValue) {
			return true;
		}
	}
	return false;
}