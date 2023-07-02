const TIMELINE_STORAGE_KEY = "timeline";

function addFilterButton(tweet, tweetContentElement) {
  const avatarParentDiv = tweet.querySelector(
    'div > [data-testid="Tweet-User-Avatar"]'
  ).parentNode;
  const existingButton = avatarParentDiv.querySelector("button");
  if (!existingButton) {
    const button = document.createElement("button");
    button.innerHTML = "Filter similar";
    avatarParentDiv.appendChild(button);
    button.addEventListener("click", function () {
      chrome.runtime.sendMessage(
        {
          action: "add_filter_example",
          tweet: tweetContentElement.textContent,
        },
        function (response) {
          // pass
        }
      );
    });
  }
}

function extractTimelineTweets() {
  let tweetElements = document.querySelectorAll('[data-testid="tweet"]');
  let tweets = Array.from(tweetElements).map((tweet) => {
    const tweetContentElement = tweet.querySelector(
      'div[data-testid="tweetText"] > span'
    );
    addFilterButton(tweet, tweetContentElement);
    return tweetContentElement ? tweetContentElement.textContent : "";
  });
  return tweets;
}

function hideFilteredTweets(passed) {
  const tweetElements = Array.from(
    document.querySelectorAll('[data-testid="tweet"]')
  );

  passed.forEach((pass, index) => {
    if (!pass) {
      tweetElements[index].style.transition = "height 0.5s ease-out";
      tweetElements[index].style.height = "0px";
      setTimeout(function () {
        tweetElements[index].style.display = "none";
      }, 500);
    } else if (tweetElements[index].style.display === "none") {
      console.log('restoring')

      tweetElements[index].style.display = "flex";
      setTimeout(function () {
        tweetElements[index].style.transition = "height 0.5s ease-out";
        tweetElements[index].style.height = "";
      }, 0);
    }
  });
}

setInterval(function () {
  let timelineTweets = extractTimelineTweets();
  chrome.storage.local.get([TIMELINE_STORAGE_KEY], function (result) {
    if (
      JSON.stringify(timelineTweets) !== JSON.stringify(result.timelineTweets)
    ) {
      chrome.storage.local.set(
        { [TIMELINE_STORAGE_KEY]: timelineTweets },
        function () {
          console.log("Timeline tweets stored in local storage");
        }
      );
    }
  });
}, 1000);


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "apply_filter") {
    console.log({ request });
    hideFilteredTweets(request.passed);
  }
});
