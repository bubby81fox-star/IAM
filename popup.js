document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const loggedOutState = document.getElementById("logged-out-state");
  const loggedInState = document.getElementById("logged-in-state");
  const userEmailField = document.getElementById("user-email");

  // 1. Check if the user is already signed in when they open the popup
  chrome.storage.local.get(["idToken"], (result) => {
    if (result.idToken) {
      // Decode the payload out of the JWT token to show the user profile data
      try {
        const base64Url = result.idToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const tokenData = JSON.parse(atob(base64));
        
        loggedOutState.classList.add("hidden");
        loggedInState.classList.remove("hidden");
        userEmailField.textContent = tokenData.email || "Authenticated User";
      } catch (e) {
        console.error("Error parsing stored session token:", e);
      }
    }
  });

  // 2. Trigger the Auth0 handshake when clicking the login button
  loginBtn.addEventListener("click", () => {
    loginBtn.textContent = "Connecting...";
    loginBtn.disabled = true;
    
    // Fire a message directly to background.js to open launchWebAuthFlow
    chrome.runtime.sendMessage({ action: "login" });
  });

  // 3. Listen for the background script to report back a successful login
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "auth_success") {
      window.location.reload(); // Refresh popup UI to toggle states
    }
  });
});