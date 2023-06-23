// Listen for the runtime.onInstalled event to inject our content script
chrome.runtime.onInstalled.addListener(function () {
    chrome.webNavigation.onDOMContentLoaded.addListener(
      function (details) {
        chrome.tabs.executeScript(details.tabId, {
          file: "content.js",
          runAt: "document_end",
        });
      },
      { url: [{ urlMatches: "https://twitter.com/*" }] }
    );
  });