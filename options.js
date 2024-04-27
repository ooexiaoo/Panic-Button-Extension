document.addEventListener('DOMContentLoaded', function() {
  const optionsForm = document.getElementById('optionsForm');
  const safeWebsiteInput = document.getElementById('safeWebsiteInput');
  const confirmationMessage = document.getElementById('confirmationMessage');

  // Load the saved safe website URL from storage
  chrome.storage.sync.get(['safeWebsite'], function(result) {
    if (result.safeWebsite) {
      safeWebsiteInput.value = result.safeWebsite;
    } else {
      console.error('No safe website URL found in storage.');
    }
  });

  // Save the safe website URL to storage when the form is submitted
  optionsForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the entered safe website URL
    const safeWebsite = safeWebsiteInput.value;

    // Save the safe website URL to storage
    chrome.storage.sync.set({ safeWebsite: safeWebsite }, function() {
      console.log('Safe website URL saved:', safeWebsite);

      // Send a message to the background script indicating that the safe website URL has been updated
      chrome.runtime.sendMessage({ action: 'safeWebsiteUpdated', url: safeWebsite });

      // Show confirmation message
      confirmationMessage.textContent = 'Safe website URL saved!';
      confirmationMessage.style.display = 'block';

      // Clear the confirmation message after 3 seconds
      setTimeout(function() {
        confirmationMessage.style.display = 'none';
      }, 3000);
    });
  });

  // Automatically save the safe website URL when the input field value changes
  safeWebsiteInput.addEventListener('input', function() {
    const safeWebsite = safeWebsiteInput.value;
    chrome.storage.sync.set({ safeWebsite: safeWebsite }, function() {
      console.log('Safe website URL updated:', safeWebsite);
    });
  });
});
