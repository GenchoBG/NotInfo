chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.method === "getDOMContent") {
		alert('daaaaaa');
		chrome.runtime.sendMessage({
			method: 'sendContent',
			data: getArticleText()
		});
	}
});

(() => {

	chrome.storage.sync.get('analyze', (data) => {
		data.analyze && window.addEventListener('load', () => {
			chrome.runtime.sendMessage({
				method: 'sendContent',
				data: getArticleText()
			});
		})
	});



	chrome.storage.onChanged.addListener((changes, namespace) => {
		//search for a paragraph to customize
		if (changes.fetchedData && changes.fetchedData.newValue.result) {
			getTagByContent("В първата част на");
		}
	});
})();

// observeDOMChange = () => {
// 	const targetNode = document.querySelector('body');

// 	const config = {childList: true, subtree: true };

// 	const callback = function(mutationsList, observer) {
// 		for(const mutation of mutationsList) {
// 			if (mutation.type === 'childList') {
// 				const article = getArticleText();

// 				chrome.runtime.sendMessage({
// 					method: 'sendContent',
// 					data: article
// 				});

// 				break;
// 			}
// 			else if (mutation.type === 'attributes') {
// 				alert('The ' + mutation.attributeName + ' attribute was modified.');
// 			}
// 		}
// 	};

// 	const observer = new MutationObserver(callback);

// 	observer.observe(targetNode, config);
// }

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