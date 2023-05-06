const openaiApiKey = "<your key>";

async function analyzeMood(tweetTexts) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          content: `Based on the following tweets, summarize the top content and determine the overall mood as positive, negative, or neutral.
    Tweets:

    ${tweetTexts.join("\n")}
    End tweets

    Use this template for your output:

    <describe the tweet vibes in three words>

    <overall mood, [positive | negative | neutral]>
    `,
          role: "system",
        },
      ],
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.5,
      n: 1,
    }),
  });

  const data = await response.json();
  console.log({ data });
  const mood = data.choices[0].message.content.trim();
  return mood;
}

function onPopupOpened() {
  console.log("Popup opened");
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    // Get tweetTexts from the content script
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getTweetTexts" },
      async (response) => {
        console.log({ response });
        const mood = await analyzeMood(response.tweetTexts);
        document.getElementById("moodSummary").textContent = mood;

        // If the mood is positive, automatically show the timeline.
        if (mood.toLowerCase().includes("positive")) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "showTimeline" });
        } else {
          // If the mood is not positive, display the 'Show Me Anyway' button.
          document.getElementById("showTimeline").style.display = "block";
        }
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", onPopupOpened);
document.getElementById("showTimeline").addEventListener("click", () => {
  // Send a message to the content script to show the timeline.
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "showTimeline" });
  });
});
