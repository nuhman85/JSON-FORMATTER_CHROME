// Create a context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "formatJson",
    title: "JSONB- Format",
    contexts: ["selection"],
  });
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "formatJson") {
    // Inject the content script into the active tab
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        // Once the content script is injected, send the message
        chrome.tabs.sendMessage(
          tab.id,
          { action: "formatJson", text: info.selectionText },
          (response) => {
            console.log("Message sent and response received:", response);
          }
        );
      }
    );
  }
});
// Function to format the selected text (sent to content script)
function formatSelectedText(selectedText) {
  chrome.runtime.sendMessage({ action: "formatJson", text: selectedText });
}
