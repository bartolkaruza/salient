const timelineSelector = 'div[aria-label="Timeline: Your Home Timeline"]';

function getTweetTexts() {
  const tweets = document.querySelectorAll('[data-testid="tweet"]');
  const tweetTexts = Array.from(tweets).map((tweet) => {
    const tweetContentElement = tweet.querySelector(
      'div[data-testid="tweetText"] > span'
    );
    return tweetContentElement ? tweetContentElement.textContent : "";
  });
  return tweetTexts;
}

let hideInterval;

function hideTimeline() {
  console.log("HIDING TIMELINE");

  if (hideInterval) {
    clearInterval(hideInterval);
  }

  hideInterval = setInterval(() => {
    const timeline = document.querySelector(timelineSelector);
    if (timeline && timeline.style.display !== "none") {
      timeline.style.display = "none";
    }
  }, 100);
}

function showTimeline() {
  const timeline = document.querySelector(timelineSelector);
  if (timeline) {
    timeline.style.display = "";

    if (hideInterval) {
      clearInterval(hideInterval);
    }
  }
}

function onDOMContentLoaded() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideTimeline);
  } else {
    hideTimeline();
  }
}

// Call onDOMContentLoaded() function
onDOMContentLoaded();

// Call onDOMContentLoaded() function when the DOMContentLoaded event fires
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "getTweetTexts") {
    sendResponse({ tweetTexts: getTweetTexts() });
  } else if (request.action === "showTimeline") {
    showTimeline();
  }
  return true;
});
