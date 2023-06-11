chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "hide") {
      document.documentElement.style.display = "none"; // Hide the page content
    } else if (request.action === "show") {
      document.documentElement.style.display = ""; // Show the page content
    }
  });
  