const TWEET_EXAMPLES_STORAGE_KEY = "tweetFilterExamples";

document.getElementById("add-button").addEventListener("click", function () {
  let tweet = document.getElementById("tweet-input").value;
  chrome.runtime.sendMessage(
    { action: "add_filter_example", tweet: tweet },
    function (response) {
      // pass
    }
  );
  document.getElementById("tweet-input").value = "";
});

document.getElementById("reset-button").addEventListener("click", function () {
  chrome.runtime.sendMessage(
    { action: "reset_filter_examples" },
    function (response) {
      // pass
    }
  );
});

function updateExampleList(examples) {
  const ul = document.getElementById("tweet-list");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  examples.forEach((example) => {
    const li = document.createElement("li");
    li.textContent = example;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function (response) {
      chrome.runtime.sendMessage(
        { action: "remove_filter_example", tweet: example },
        function (response) {
          // pass
        }
      );
    });
    li.appendChild(removeButton);
    ul.appendChild(li);
  });
}

window.onload = function () {
  console.log("ON LOAD");
  chrome.storage.local.onChanged.addListener((changed) => {
    const changedKeys = Object.keys(changed);
    if (changedKeys.includes(TWEET_EXAMPLES_STORAGE_KEY)) {
      const tweetFilterExamples = changed[TWEET_EXAMPLES_STORAGE_KEY].newValue;
      updateExampleList(tweetFilterExamples);
    }
  });
  chrome.storage.local.get([TWEET_EXAMPLES_STORAGE_KEY], (storage) => {
    console.log({ storage });
    updateExampleList(storage[TWEET_EXAMPLES_STORAGE_KEY]);
  });
};
