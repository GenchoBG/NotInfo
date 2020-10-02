  let checkbox = document.getElementById('analyzerSwitch');

  chrome.storage.sync.get('analyze', function(data) {
    checkbox.checked = data.analyze;
    console.log(data)
  });