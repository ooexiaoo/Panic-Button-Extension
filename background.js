let isPanicModeActive = false;
let originalWindowState = null;
let originalWindowId = null;
let safeWindowId = null;
let safeWebsite = "";

chrome.commands.onCommand.addListener(function (command) {
  if (command === "toggle-panic") {
    if (isPanicModeActive) {
      // Close the safe window and restore the original window state
      if (safeWindowId) {
        chrome.windows.remove(safeWindowId, function () {
          safeWindowId = null;
          if (originalWindowState === "minimized") {
            chrome.windows.update(originalWindowId, { state: "minimized" });
          } else {
            chrome.windows.update(originalWindowId, { state: originalWindowState });
          }
        });
      }
      isPanicModeActive = false;
    } else {
      // Minimize or save the original window state and open the safe website in a new window
      chrome.windows.getCurrent(function (currentWindow) {
        originalWindowId = currentWindow.id;
        originalWindowState = currentWindow.state;
        if (originalWindowState === "minimized") {
          chrome.windows.update(originalWindowId, { state: "minimized" });
        } else {
          chrome.windows.update(originalWindowId, { state: "normal" });
        }
        chrome.windows.create({ url: safeWebsite, state: "maximized" }, function (newWindow) {
          safeWindowId = newWindow.id;
        });
      });

      isPanicModeActive = true;
    }
  }
});

// Listen for safe website URL updates from options.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'safeWebsiteUpdated') {
    // Update the safe website URL
    safeWebsite = message.url;
    console.log('Safe website URL updated:', safeWebsite);
  }
});
