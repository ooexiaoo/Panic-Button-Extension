let isPanicModeActive = false;
let originalWindowState = null;
let originalWindowId = null;
let safeWindowId = null;
let safeWebsite = "";

// Function to update the safe website URL
function updateSafeWebsite(url) {
  safeWebsite = url;
  // Save the safe website URL to localStorage
  localStorage.setItem('safeWebsite', url);
}

// Function to retrieve the safe website URL from localStorage
function retrieveSafeWebsite() {
  const url = localStorage.getItem('safeWebsite');
  if (url) {
    safeWebsite = url;
  }
}

// Function to toggle panic mode
function togglePanicMode() {
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

// Listen for the "toggle-panic" command
chrome.commands.onCommand.addListener(function (command) {
  if (command === "toggle-panic") {
    togglePanicMode();
  }
});

// Listen for safe website URL updates from options.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'safeWebsiteUpdated') {
    // Update the safe website URL
    updateSafeWebsite(message.url);
    console.log('Safe website URL updated:', safeWebsite);
  }
});

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(function () {
  retrieveSafeWebsite();
  if (!safeWebsite) {
    chrome.tabs.create({ url: 'options.html' });
    alert('Please set a safe website URL in the extension options.');
  }
});

// Log the safe website URL
console.log('Safe website URL:', safeWebsite);
