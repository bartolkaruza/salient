const TWEET_EXAMPLES_STORAGE_KEY = "tweetFilterExamples";
const TIMELINE_STORAGE_KEY = "timeline";

function checkFilterMatrix(timeline, examples) {
  fetch("http://localhost:3005/rate_tweets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_stored_to_filter_tweets: examples,
      new_timeline_tweets: timeline,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log({ data });
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "apply_filter",
            ...data,
          });
        }
      });
    })
    .catch((error) => console.error("Error:", error));
}

chrome.storage.local.onChanged.addListener((changed) => {
  const changedKeys = Object.keys(changed);
  console.log({ changed, changedKeys });
  if (
    changedKeys.includes(TWEET_EXAMPLES_STORAGE_KEY) ||
    changedKeys.includes(TIMELINE_STORAGE_KEY)
  ) {
    chrome.storage.local.get(
      [TIMELINE_STORAGE_KEY, TWEET_EXAMPLES_STORAGE_KEY],
      (storageResult) => {
        const timeline = storageResult[TIMELINE_STORAGE_KEY];
        const examples = storageResult[TWEET_EXAMPLES_STORAGE_KEY];
        checkFilterMatrix(timeline, examples || []);
      }
    );
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "add_filter_example") {
    chrome.storage.local.get(
      [TWEET_EXAMPLES_STORAGE_KEY],
      function (storageResult) {
        let exampleTweets = storageResult[TWEET_EXAMPLES_STORAGE_KEY] || [];
        exampleTweets.push(request.tweet);
        chrome.storage.local.set(
          { [TWEET_EXAMPLES_STORAGE_KEY]: exampleTweets },
          function () {
            console.log("Added filter " + request.tweet);
          }
        );
      }
    );
  } else if (request.action === "remove_filter_example") {
    chrome.storage.local.get(
      [TWEET_EXAMPLES_STORAGE_KEY],
      function (storageResult) {
        let exampleTweets = storageResult[TWEET_EXAMPLES_STORAGE_KEY] || [];
        chrome.storage.local.set(
          {
            [TWEET_EXAMPLES_STORAGE_KEY]: exampleTweets.filter(
              (exampleTweet) => exampleTweet !== request.tweet
            ),
          },
          function () {
            console.log("Removed " + request.tweet);
          }
        );
      }
    );
  } else if (request.action === "reset_filter_examples") {
    chrome.storage.local.set({ [TWEET_EXAMPLES_STORAGE_KEY]: [] }, function () {
      console.log("clearing complete");
    });
  }
});
