const TIMELINE_STORAGE_KEY = "timeline";

function extractTimelineTweets() {
  let tweetElements = document.querySelectorAll('[data-testid="tweet"]');
  let tweets = Array.from(tweetElements).map((tweet) => {
    const tweetContentElement = tweet.querySelector(
      'div[data-testid="tweetText"] > span'
    );
    return tweetContentElement ? tweetContentElement.textContent : "";
  });
  return tweets;
}

function hideFilteredTweets(passed) {
  let tweetElements = Array.from(
    document.querySelectorAll('[data-testid="tweet"]')
  );
  passed.forEach((pass, index) => {
    if (!pass) {
      tweetElements[index].style.transition = "height 0.5s ease-out"; // Add transition
      tweetElements[index].style.height = "0px"; // Animate to height 0
      setTimeout(function () {
        tweetElements[index].style.display = "none"; // Hide after transition
      }, 500);
    }
  });
}

setInterval(function () {
  let timelineTweets = extractTimelineTweets();
  chrome.storage.local.get([TIMELINE_STORAGE_KEY], function (result) {
    if (
      JSON.stringify(timelineTweets) !== JSON.stringify(result.timelineTweets)
    ) {
      chrome.storage.local.set({ [TIMELINE_STORAGE_KEY]: timelineTweets }, function () {
        console.log("Timeline tweets stored in local storage");
      });
    }
  });
}, 1000);

// // Continuously extract new tweets from the user's Twitter timeline and send them to background.js
// setInterval(function () {
//   let timelineTweets = extractTimelineTweets();
//   console.log("timeline");
//   console.log(lastTimelineTweets);
//   if (JSON.stringify(timelineTweets) !== JSON.stringify(lastTimelineTweets)) {
//     console.log("sending timeline_tweets action");
//     lastTimelineTweets = timelineTweets;
//     chrome.runtime.sendMessage({
//       action: "timeline_tweets",
//       timelineTweets: timelineTweets,
//     });
//   }
// }, 1000);

// Listen for similarity scores from background.js and hide similar tweets
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "apply_filter") {
    console.log({ request });
    hideFilteredTweets(request.passed);
  }
});
