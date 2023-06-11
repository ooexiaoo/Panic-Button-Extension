let isPanicModeActive = false;
let originalWindowId = null;
let safeWindowId = null;

chrome.commands.onCommand.addListener(function (command) {
  if (command === "toggle-panic") {
    if (isPanicModeActive) {
      // Close the safe window and show the original window
      if (safeWindowId) {
        chrome.windows.remove(safeWindowId);
        safeWindowId = null;
      }
      if (originalWindowId) {
        chrome.windows.update(originalWindowId, { focused: true });
        originalWindowId = null;
      }
      isPanicModeActive = false;
    } else {
      // Hide the original window and open the safe website in a new window
      chrome.windows.getCurrent(function (currentWindow) {
        originalWindowId = currentWindow.id;
        chrome.windows.update(originalWindowId, { state: "minimized" });
        chrome.windows.create({ url: "https://github.com" }, function (newWindow) {
          safeWindowId = newWindow.id;
        });
      });
      isPanicModeActive = true;
    }
  }
});
