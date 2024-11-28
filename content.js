// Inject the custom alert box into the page
function injectCustomAlert() {
  if (document.getElementById("customAlert")) return; // Prevent duplicate injection

  const alertHTML = `
      <div id="customAlert" class="modal">
        <div class="modal-content">
          <span class="close-button">×</span>
          <pre id="alertMessage">This is a custom alert!</pre>
          <button id="alertOkButton">OK</button>
        </div>
      </div>
    `;

  const alertStyles = `
      <style>
      .modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .modal-content {
        position: relative;
        background-color: white;
        margin: 5% auto; /* Reduced margin to allow more space for the alert box */
        padding: 20px;
        border-radius: 5px;
        width: 50%;
        max-height: 80vh; /* Limit height to 80% of viewport */
        overflow-y: auto; /* Enable vertical scrolling if content is too large */
        text-align: center;
      }
      .close-button {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 20px;
        cursor: pointer;
      }
      pre {
        text-align: left;
        background: #f4f4f4;
        padding: 10px;
        border-radius: 4px;
        white-space: pre-wrap; /* Prevents text from overflowing horizontally */
        word-wrap: break-word; /* Ensures long words or JSON keys are wrapped */
      }
      </style>
    `;

  // Inject the alert HTML and styles into the page
  document.body.insertAdjacentHTML("beforeend", alertHTML);
  document.head.insertAdjacentHTML("beforeend", alertStyles);

  // Close button event
  document.querySelector(".close-button").addEventListener("click", closeAlert);
  document
    .querySelector("#alertOkButton")
    .addEventListener("click", closeAlert);
}

// Function to display the alert box with formatted JSON or an error message
function showAlert(message) {
  injectCustomAlert(); // Ensure alert box is injected
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("customAlert").style.display = "block";
}

// Function to close the alert box
function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}

// Function to format valid JSON and return the result
function formatJSON(input) {
  try {
    const parsed = JSON.parse(input); // Try parsing the selected text
    return JSON.stringify(parsed, null, 4); // Pretty-print valid JSON
  } catch (e) {
    return "Invalid JSON or unable to format the text.";
  }
}

// Listen for the message from the background script to format the selected text
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "formatJson") {
    const formattedJson = formatJSON(request.text);
    showAlert(formattedJson);
  }
});
